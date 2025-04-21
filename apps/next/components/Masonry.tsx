"use client";
import { useState, useEffect, useRef } from "react";
import { PostProps } from "../types/PostProps";
import { PostThumbnail } from "./PostThumbnail";
import Scrollbar from "react-scrollbars-custom";
import { Footer } from "./Footer";
import { unstable_ViewTransition as ViewTransition } from "react";
import { motion } from "motion/react";

export function getSize(postSize: string | number) {
  // Convert string to number if needed
  const size =
    typeof postSize === "string" ? parseInt(postSize, 10) || 0 : postSize;

  // Possible square sizes
  const squareSizes = [140, 190, 240, 290, 340];

  if (size <= 2) {
    return squareSizes[0];
  }
  if (size === 3) {
    return squareSizes[1];
  }
  if (size === 5) {
    return squareSizes[3];
  }
  if (size >= 6) {
    return squareSizes[4];
  }
  return squareSizes[2];
}

const HorizontalMasonry = ({ posts }: { posts: PostProps[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const rowHeight = 40; // Row height
  const gutter = 10; // Space between rows
  const effectiveRowHeight = rowHeight + gutter;

  // Layout logic adapted from Isotope masonryHorizontal
  const calculateLayout = () => {
    if (!containerRef.current || !posts.length) return;

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

    for (const post of posts) {
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
  };

  // Recalculate layout on mount, item change, or resize
  useEffect(() => {
    calculateLayout();
  }, [posts]);

  // Handle resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      calculateLayout();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <ViewTransition name="masonry">
      <div
        className="relative h-[calc(100vh-118px-80px)] w-full border border-gray-300 overflow-visible"
        ref={containerRef}
      >
        <Scrollbar className="h-full w-full overflow-y-hidden">
          <div
            ref={wrapperRef}
            className="masonry-wrapper"
            style={{
              position: "relative",
              width: `${wrapperWidth}px`,
              height: `${containerHeight}px`,
            }}
          >
            {posts.map((post: PostProps, index: number) => (
              <PostThumbnail
                key={post.slug}
                post={post}
                index={index}
                positions={positions}
                isDragging={false}
              />
            ))}
          </div>
        </Scrollbar>
        <Footer />
      </div>
    </ViewTransition>
  );
};

export default HorizontalMasonry;
