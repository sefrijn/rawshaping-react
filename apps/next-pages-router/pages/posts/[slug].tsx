import PostContent from "@/components/PostContent";
import { fetchPostBySlug } from "@/lib/fetchPostBySlug";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import PageTransition from "@/components/Transition";
import { useState } from "react";
import Head from "next/head";

export default function SinglePost() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const [slugState] = useState(slug);

  const { isPending, isError, data, error } = useQuery({
    queryKey: [slugState],
    queryFn: () => fetchPostBySlug(slugState),
  });

  // Remove all html tags from the excerpt
  const excerpt = data?.excerpt.rendered.replace(/<[^>]*>?/g, "");

  return (
    <>
      <PageTransition>
        {isPending && <>Loading...</>}
        {isError && <>Error: {error?.message}</>}
        {!data && <>No posts found</>}
        {data && <PostContent post={data} />}
      </PageTransition>
      <Head>
        <title>
          {data?.title} | {process.env.NEXT_PUBLIC_SITE_NAME}
        </title>
        <meta
          property="og:title"
          content={data?.title + " | " + process.env.NEXT_PUBLIC_SITE_NAME}
          key="title"
        />
        <meta property="og:description" content={excerpt} key="description" />
        <meta
          property="og:image"
          content={data?.featuredImage?.sizes?.full?.source_url}
          key="image"
        />
      </Head>
    </>
  );
}
