import PostContent from "@/components/PostContent";
import { fetchPostBySlug } from "@/lib/fetchPostBySlug";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import PageTransition from "@/components/Transition";
import { useEffect, useState } from "react";

export default function SinglePost() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const [slugState] = useState(slug);

  const { isPending, isError, data, error } = useQuery({
    queryKey: [slugState],
    queryFn: () => fetchPostBySlug(slugState),
  });

  return (
    <PageTransition>
      {isPending && <>Loading...</>}
      {isError && <>Error: {error?.message}</>}
      {!data && <>No posts found</>}
      {data && <PostContent post={data} />}
    </PageTransition>
  );
}
