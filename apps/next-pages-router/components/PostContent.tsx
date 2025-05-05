import { Scrollbar } from "react-scrollbars-custom";
import { PostProps } from "@/types/PostProps";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { formatDate } from "../lib/formatDate";
import Lightbox from "yet-another-react-lightbox-lite";
import { useState, useEffect, useRef } from "react";
import "yet-another-react-lightbox-lite/styles.css";
import Image from "next/image";
import { IoChevronBackSharp } from "react-icons/io5";

export default function PostContent({ post }: { post: PostProps }) {
  const [index, setIndex] = useState<number>();
  const [photos, setPhotos] = useState<{ src: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formattedContent, setFormattedContent] = useState<string>("");

  useEffect(() => {
    if (post?.content?.rendered) {
      // Process PDF tags in content
      let processedContent = processPdfTags(post.content.rendered);
      processedContent = processVimeoTags(processedContent);
      setFormattedContent(processedContent);

      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = processedContent;

      // Extract all image URLs from anchor tags containing images
      const imageLinks = tempDiv.querySelectorAll("a > img");
      const imageUrls = Array.from(imageLinks).map((img) => {
        const anchor = img.parentElement as HTMLAnchorElement;
        return { src: anchor.href };
      });

      setPhotos(imageUrls);
    }
  }, [post?.content?.rendered]);

  // Function to replace [pdf filename.pdf] tags with PDF download links
  const processPdfTags = (content: string): string => {
    // Regex to match [pdf filename.pdf] pattern
    return content.replace(/\[pdf (.*?)\]/gi, (match, filename) => {
      return `<div class="wrap_pdf"><a href="https://www.rawshaping.com/documents/${filename}"><img src="/img/adobe_pdf_icon.png" alt="PDF" height="15" /> ${filename}</a></div>`;
    });
  };

  // Function to replace [vimeo VIDEO_ID] tags with Vimeo embeds
  const processVimeoTags = (content: string): string => {
    // Regex to match [vimeo VIDEO_ID] pattern
    return content.replace(/\[vimeo (\d+)\]/gi, (match, videoId) => {
      return `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${videoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Vimeo Video"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`;
    });
  };

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
        .wrap_pdf {
          margin: 1rem 0;
        }
        .wrap_pdf a {
          display: inline-flex;
          align-items: center;
          color: #333;
          text-decoration: none;
          font-weight: 500;
        }
        .wrap_pdf a:hover {
          text-decoration: underline;
        }
        .wrap_pdf img {
          margin-right: 5px;
        }
      `}</style>
      <Link
        href="/posts"
        className="text-grey absolute z-20 group hover:text-primary hover:bg-white flex flex-row items-center gap-1"
      >
        <IoChevronBackSharp size={16} />
        <span className="text-xs">back to overview</span>
      </Link>

      <div className="scrollbar-wrapper">
        <Scrollbar noDefaultStyles>
          <div className="md:pl-5 md:pr-5 pl-2 pr-0 pt-6 pb-6">
            <div className="flex justify-between">
              <p className="text-grey text-xs uppercase font-bold tracking-tighter">
                {formatDate(post.date)}
              </p>
            </div>
            <h1 className="text-lg font-bold tracking-tight my-1">
              {post.title}
            </h1>
            {formattedContent && (
              <div
                ref={contentRef}
                className="mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
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
