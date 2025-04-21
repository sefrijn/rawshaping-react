import type { Metadata } from "next";
import "./globals.css";
import { AllPosts } from "@/components/AllPosts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Tags } from "@/components/Tags";

export const metadata: Metadata = {
  title: "Rawshaping",
  description: "Nextjs with Wordpress headless CMS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased flex flex-col h-full w-full"}>
        <div className="flex flex-col md:flex-row">
          <Header />
          <Tags />
        </div>
        <div className="flex flex-row grow min-h-[400px] w-screen">
          <Navigation />
          {children}
          {/* <div className="self-start inline-flex flex-col min-w-0 grow"> */}
          <AllPosts />
          {/* </div> */}
        </div>
      </body>
    </html>
  );
}
