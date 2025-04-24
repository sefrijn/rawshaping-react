import { useState, useEffect, useRef, UIEvent, useCallback } from "react";
import { PostProps } from "../types/PostProps";
import { PostThumbnail } from "./PostThumbnail";
import Scrollbar from "react-scrollbars-custom";
import { Footer } from "./Footer";
import { motion } from "motion/react";
import { fetchPosts } from "@/lib/fetchPosts";
import { ScrollState } from "react-scrollbars-custom/dist/types/types";
import { useWindowWidth } from "../lib/useWindowWidth";
import { getSize } from "../lib/getSize";

type MasonryProps = {
  posts: PostProps[];
  initialPage?: number;
  hasNextPage?: boolean;
};

const HorizontalMasonry = ({
  posts: initialPosts,
  initialPage = 1,
  hasNextPage = true,
}: MasonryProps) => {
  const [page, setPage] = useState(initialPage);
  const [allPosts, setAllPosts] = useState<PostProps[]>(initialPosts);
  const isLoading = useRef(false);
  const recalculatingLayout = useRef(false);
  const [canLoadMore, setCanLoadMore] = useState(hasNextPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const windowWidth = useWindowWidth(); // Add this hook to trigger recalculation on window resize
  const rowHeight = 40; // Row height
  const gutter = 10; // Space between rows
  const effectiveRowHeight = rowHeight + gutter;
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Layout logic adapted from Isotope masonryHorizontal
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || !allPosts.length) return;

    const height = containerRef.current.offsetHeight - 14;
    setContainerHeight(height);
    // Calculate number of rows
    const rows = Math.max(
      Math.floor((height + gutter) / effectiveRowHeight),
      1
    );
    // Initialize rowXs to track rightmost x-coordinate of each row
    const rowXs = new Array(rows).fill(0);
    const newPositions = [];

    for (const post of allPosts) {
      const size = getSize(post.post_size);
      const remainder = size % effectiveRowHeight;
      const mathMethod = remainder && remainder < 1 ? "round" : "ceil";
      let rowSpan = Math[mathMethod](size / effectiveRowHeight);
      rowSpan = Math.min(rowSpan, rows);

      // Get row group (possible row sets the item can occupy)
      let rowGroup = [];
      if (rowSpan < 2) {
        rowGroup = rowXs;
      } else {
        const groupCount = rows + 1 - rowSpan;
        for (let i = 0; i < groupCount; i++) {
          const groupRowXs = rowXs.slice(i, i + rowSpan);
          rowGroup[i] = Math.max(...groupRowXs);
        }
      }

      // Find leftmost position
      const minimumX = Math.min(...rowGroup);
      const shortRowIndex = rowGroup.indexOf(minimumX);

      // Set position
      const position = {
        x: minimumX,
        y: shortRowIndex * effectiveRowHeight,
      };
      newPositions.push(position);

      // Update rowXs for affected rows
      const setWidth = minimumX + size + gutter;
      const setSpan = rows + 1 - rowGroup.length;
      for (let i = 0; i < setSpan; i++) {
        rowXs[shortRowIndex + i] = setWidth;
      }
    }

    setPositions(newPositions);

    // Calculate the required width for the wrapper
    const maxX = Math.max(...rowXs) || 0;
    // Add a buffer to ensure all items fit with proper spacing
    setWrapperWidth(maxX + 20); // Add 20px buffer

    recalculatingLayout.current = false;
  }, [allPosts, effectiveRowHeight, gutter]);

  // Recalculate layout on mount, item change, or resize
  useEffect(() => {
    calculateLayout();
  }, [allPosts, windowWidth, calculateLayout]);

  // Create and update resizeObserver
  useEffect(() => {
    // If we already have an observer, don't create a new one
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        calculateLayout();
      });

      // Start observing if container exists
      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }
    }

    // Cleanup on component unmount
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  // Create and update resizeObserver callback when calculateLayout changes
  useEffect(() => {
    // Disconnect old observer and create new one with updated callback
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();

      resizeObserverRef.current = new ResizeObserver(() => {
        calculateLayout();
      });

      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }
    }
  }, [calculateLayout]);

  const loadMorePosts = async () => {
    if (isLoading.current || !canLoadMore || recalculatingLayout.current)
      return;

    console.log("Loading more posts...", canLoadMore, isLoading.current, page);

    isLoading.current = true;
    try {
      const nextPage = page + 1;
      const result = await fetchPosts("posts", {
        per_page: 25,
        page: nextPage,
        order: "desc",
        orderby: "date",
      });

      if (result.posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...result.posts]);
        setPage(nextPage);
        setCanLoadMore(nextPage < Number(result.pages));
      } else {
        setCanLoadMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      isLoading.current = false;
      recalculatingLayout.current = true;
    }
  };

  // Check scroll position on scroll
  const handleScroll = useCallback(
    (
      scrollValuesOrEvent: ScrollState | UIEvent<HTMLDivElement>,
      prevScrollState?: ScrollState
    ) => {
      // If we have a ScrollState (not an event), process it
      if (
        scrollValuesOrEvent &&
        "scrollLeft" in scrollValuesOrEvent &&
        prevScrollState
      ) {
        const scrollValues = scrollValuesOrEvent as ScrollState;

        if (!canLoadMore || isLoading.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollValues;

        // If we're within 300px of the end, load more
        const scrollThreshold = 300;
        if (scrollWidth - (scrollLeft + clientWidth) < scrollThreshold) {
          loadMorePosts();
        }
      }
      // If it's a UIEvent, we don't need to do anything special
    },
    [canLoadMore, loadMorePosts]
  );

  // Handle wheel events to convert vertical scroll to horizontal
  const handleWheel = (event: WheelEvent) => {
    if (containerRef.current) {
      const scrollbar = containerRef.current.querySelector(
        ".ScrollbarsCustom-Scroller"
      );
      if (scrollbar instanceof HTMLElement) {
        // Only prevent default for vertical scrolling
        if (event.deltaY !== 0) {
          event.preventDefault();
          const scrollAmount = event.deltaY;
          const currentScroll = scrollbar.scrollLeft;
          scrollbar.scrollLeft = currentScroll + scrollAmount;
        }

        // For horizontal scrolling (shift+wheel or trackpad), let it happen naturally
        // by not preventing default when deltaX is being used
      }
    }
  };

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <motion.div
      layout
      layoutId="masonry"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, width: "100%" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative md:h-[calc(100vh-118px-66px)] h-[calc(100vh-118px-40px)] w-full overflow-visible -ml-[13px]"
      ref={containerRef}
    >
      <Scrollbar noDefaultStyles onScroll={handleScroll}>
        <div
          ref={wrapperRef}
          className="masonry-wrapper"
          style={{
            position: "relative",
            width: `${wrapperWidth}px`,
            height: `${containerHeight}px`,
          }}
        >
          {allPosts.map((post: PostProps, index: number) => (
            <PostThumbnail
              key={post.slug}
              post={post}
              index={index}
              positions={positions}
              isDragging={false}
            />
          ))}
          {isLoading && (
            <div className="loading-indicator">Loading more...</div>
          )}
        </div>
      </Scrollbar>
      <Footer />
    </motion.div>
  );
};

export default HorizontalMasonry;
