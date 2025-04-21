import { Scrollbar } from "react-scrollbars-custom";
import { PostProps } from "@/types/PostProps";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { formatDate } from "../lib/formatDate";
import Lightbox from "yet-another-react-lightbox-lite";
import { useState, useEffect, useRef } from "react";
import "yet-another-react-lightbox-lite/styles.css";

export default function PostContent({ post }: { post: PostProps }) {
  const [index, setIndex] = useState<number>();
  const [photos, setPhotos] = useState<{ src: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.content?.rendered) {
      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = post.content.rendered;

      // Extract all image URLs from anchor tags containing images
      const imageLinks = tempDiv.querySelectorAll("a > img");
      const imageUrls = Array.from(imageLinks).map((img) => {
        const anchor = img.parentElement as HTMLAnchorElement;
        return { src: anchor.href };
      });

      setPhotos(imageUrls);
    }
  }, [post?.content?.rendered]);

  // Handle click on content to intercept image clicks
  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const closestAnchor = target.closest("a");

    if (closestAnchor && target.tagName === "IMG") {
      e.preventDefault();

      // Find the index of the clicked image by matching its URL
      const imageUrl = closestAnchor.href;
      const imageIndex = photos.findIndex((photo) => photo.src === imageUrl);

      if (imageIndex !== -1) {
        setIndex(imageIndex);
      }
    }
  };

  return (
    <>
      <style jsx>{`
        .bg-view {
          background-image: url("/img/view.png");
          background-size: 5px 493px;
          background-repeat: repeat-y;
          background-position: top left;
        }
      `}</style>
      <Link
        href="/posts"
        className="text-grey absolute top-[22px] right-4 p-2 z-20 group hover:bg-grey/10 rounded-full"
      >
        <IoMdClose size={26} className="text-grey group-hover:text-primary" />
      </Link>

      <div className="scrollbar-wrapper">
        <Scrollbar noDefaultStyles>
          <div className="md:pl-5 md:pr-5 pl-2 pr-5 py-2">
            <div className="flex justify-between">
              <p className="text-grey text-xs uppercase font-bold tracking-tighter">
                {formatDate(post.date)}
              </p>
            </div>
            <h1 className="text-lg font-bold tracking-tight my-1">
              {post.title}
            </h1>
            {post.content && (
              <div
                ref={contentRef}
                className="mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: post?.content?.rendered }}
                onClick={handleContentClick}
              />
            )}
          </div>
        </Scrollbar>
      </div>
      <div
        style={{ height: "calc(100% - 20px)" }}
        className="overflow-clip w-[5px] bg-view relative left-[5px]"
      />
      <Lightbox slides={photos} index={index} setIndex={setIndex} />
    </>
  );
}
