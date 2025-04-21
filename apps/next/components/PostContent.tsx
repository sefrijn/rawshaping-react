"use client";

import { Scrollbar } from "react-scrollbars-custom";
import { PostProps } from "@/types/PostProps";
import { useState } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";

export const cx = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export default function PostContent({ post }: { post: PostProps }) {
  return (
    <ViewTransition name={post.slug}>
      <main
        className="overflow-y-auto w-md shrink-0 z-10 relative bg-white/90 backdrop-blur-xs -my-2 py-2 h-full"
        key={post.slug}
      >
        <Scrollbar
          noDefaultStyles
          className="overflow-x-hidden overflow-y-auto scrollbar"
        >
          <div className="p-5">
            <div className="flex justify-end">
              <Link href="/posts" className="text-primary">
                close
              </Link>
            </div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            {post.content && (
              <div
                className="mt-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: post?.content?.rendered }}
              />
            )}
          </div>
        </Scrollbar>
      </main>
    </ViewTransition>
  );
}
