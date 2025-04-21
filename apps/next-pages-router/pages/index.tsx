import PostContent from "@/components/PostContent";
import PageTransition from "@/components/Transition";
import { fetchLatestPost } from "@/lib/fetchLatestPost";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["latestPost"],
    queryFn: () => fetchLatestPost(),
  });

  return (
    <PageTransition>
      {isPending && <>Loading...</>}
      {isError && <>Error: {error?.message}</>}
      {!isPending && !data && <>No posts found</>}
      {data && <PostContent post={data} />}
    </PageTransition>
  );
}
