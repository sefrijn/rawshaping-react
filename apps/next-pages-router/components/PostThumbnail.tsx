import Image from "next/image";
import { getSize } from "../lib/getSize";
import { PostProps } from "../types/PostProps";
import Link from "next/link";
import { formatDate } from "../lib/formatDate";
import { useRouter } from "next/router";
export const PostThumbnail = ({
  post,
  index,
  positions,
  isDragging,
}: {
  post: PostProps;
  index: number;
  positions: { x: number; y: number }[];
  isDragging: boolean;
}) => {
  const router = useRouter();
  // router pathname
  const pathname = router.pathname;
  const slug = router.query.slug as string;
  const isActive =
    slug === post.slug ||
    (index === 0 && slug === undefined && pathname === "/");

  const thumbnailProps = {
    src:
      post?.featuredImage?.sizes?.medium?.source_url ||
      post?.featuredImage?.source?.source_url,
    alt: post?.featuredImage?.title,
    width:
      post?.featuredImage?.sizes?.medium?.width ||
      post?.featuredImage?.source?.width,
    height:
      post?.featuredImage?.sizes?.medium?.height ||
      post?.featuredImage?.source?.height,
  };

  return (
    <Link
      href={`/posts/${post.slug}`}
      key={post.slug}
      draggable={false}
      className="absolute bg-primary/5 drop-shadow-md border border-transparent transition-all group"
      style={{
        position: "absolute",
        width: getSize(post.post_size),
        height: getSize(post.post_size),
        left: positions[index]?.x || 0,
        top: positions[index]?.y || 0,
        transition: "left 0.3s, top 0.3s",
      }}
    >
      {thumbnailProps.src && (
        <Image
          className="pointer-events-none w-full h-full object-cover"
          src={thumbnailProps.src}
          alt={thumbnailProps.alt}
          width={thumbnailProps.width}
          height={thumbnailProps.height}
        />
      )}

      <div
        className={`absolute inset-0 transition-colors duration-300 group-hover:bg-primary/80 flex flex-col p-2 ${
          isActive ? "bg-primary/80" : ""
        }`}
      >
        <div
          className={`text-xs text-white/80 opacity-30 group-hover:opacity-100 transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-30"
          }`}
        >
          {formatDate(post.date)}
        </div>
        <p className="text-shadow-custom text-white text-lg font-bold tracking-tight leading-tight whitespace-normal line-clamp-3">
          {post.title}
        </p>
        <div
          className={`mt-auto group-hover:opacity-100 ${
            isActive ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 text-white/80 text-[10px] whitespace-normal hyphens-auto tracking-tighter leading-tight line-clamp-5`}
        >
          {post.post_tag &&
            post.post_tag.map((tag) => (
              <span key={tag.slug}>#{tag.name} </span>
            ))}
        </div>
      </div>
    </Link>
  );
};
