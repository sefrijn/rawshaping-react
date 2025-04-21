import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pageKey = router.asPath;
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <AnimatePresence initial={false} mode="wait">
          <Component {...pageProps} key={pageKey} />
        </AnimatePresence>
      </Layout>
    </QueryClientProvider>
  );
}
