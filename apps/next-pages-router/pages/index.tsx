import PostContent from "@/components/PostContent";
import PageTransition from "@/components/Transition";
import { fetchLatestPost } from "@/lib/fetchLatestPost";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["latestPost"],
    queryFn: () => fetchLatestPost(),
  });

  return (
    <>
      <PageTransition>
        {isPending && <>Loading...</>}
        {isError && <>Error: {error?.message}</>}
        {!isPending && !data && <>No posts found</>}
        {data && <PostContent post={data} />}
      </PageTransition>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta
          property="og:title"
          content={data?.title + " | " + process.env.NEXT_PUBLIC_SITE_NAME}
          key="title"
        />
        <meta
          property="og:description"
          content={"The home of the Rawshaping Formfinding Society"}
          key="description"
        />
        <meta property="og:image" content={"/img/logo.png"} key="image" />
      </Head>
    </>
  );
}
