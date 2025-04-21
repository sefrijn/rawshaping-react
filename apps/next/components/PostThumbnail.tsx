"use client";
import Image from "next/image";
import React, { useState } from "react";
import { getSize } from "./Masonry";
import { PostProps } from "../types/PostProps";
import { useRouter } from "next/navigation";

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
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const moveThreshold = 15; // 15px movement threshold

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't prevent default here to allow parent to track dragging
    // But set our own tracking for potential navigation
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default here to allow parent to track dragging
    if (e.touches.length === 1) {
      setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startPos) {
      const dx = Math.abs(e.clientX - startPos.x);
      const dy = Math.abs(e.clientY - startPos.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < moveThreshold && !isDragging) {
        router.push(`/posts/${post.slug}`);
      }
      setStartPos(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startPos && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const dx = Math.abs(touch.clientX - startPos.x);
      const dy = Math.abs(touch.clientY - startPos.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < moveThreshold && !isDragging) {
        router.push(`/post/${post.slug}`);
      }
      setStartPos(null);
    }
  };

  return (
    <div
      key={post.slug}
      draggable={false}
      className="absolute bg-white shadow-lg"
      style={{
        position: "absolute",
        width: getSize(post.post_size),
        height: getSize(post.post_size),
        left: positions[index]?.x || 0,
        top: positions[index]?.y || 0,
        transition: "left 0.3s, top 0.3s",
        cursor: isDragging ? "grabbing" : "pointer",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
    </div>
  );
};
