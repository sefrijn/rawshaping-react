import Image from "next/image";
import { getSize } from "../lib/getSize";
import { PostProps } from "../types/PostProps";
import Link from "next/link";
import { formatDate } from "../lib/formatDate";
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
  return (
    <Link
      href={`/posts/${post.slug}`}
      key={post.slug}
      draggable={false}
      className="absolute bg-primary/50 hover:bg-primary shadow-lg group"
      style={{
        position: "absolute",
        width: getSize(post.post_size),
        height: getSize(post.post_size),
        left: positions[index]?.x || 0,
        top: positions[index]?.y || 0,
        transition: "left 0.3s, top 0.3s",
      }}
    >
      {post?.featuredImage?.sizes?.medium?.source_url && (
        <Image
          className="pointer-events-none w-full h-full object-cover"
          src={post.featuredImage.sizes.medium.source_url}
          alt={post.featuredImage.title}
          width={post.featuredImage.sizes.medium.width}
          height={post.featuredImage.sizes.medium.height}
        />
      )}

      {!post?.featuredImage?.sizes?.medium?.source_url &&
        post?.featuredImage?.sizes?.full?.source_url && (
          <Image
            className="pointer-events-none w-full h-full object-cover"
            src={post.featuredImage.sizes.full.source_url}
            alt={post.featuredImage.title}
            width={post.featuredImage.sizes.full.width}
            height={post.featuredImage.sizes.full.height}
          />
        )}
      <div className="absolute inset-0 transition-colors duration-300 group-hover:bg-primary/80 flex flex-col p-2">
        <div className="text-xs text-white/80 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
          {formatDate(post.date)}
        </div>
        <p className="text-shadow-custom text-white text-lg font-bold tracking-tight leading-tight whitespace-normal line-clamp-3">
          {post.title}
        </p>
        <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/80 text-[10px] whitespace-normal hyphens-auto tracking-tighter leading-tight line-clamp-5">
          {post.post_tag &&
            post.post_tag.map((tag) => (
              <span key={tag.slug}>#{tag.name} </span>
            ))}
        </div>
      </div>
    </Link>
  );
};
