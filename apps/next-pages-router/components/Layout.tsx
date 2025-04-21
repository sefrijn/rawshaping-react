import { AnimatePresence, motion } from "motion/react";
import { AllPosts } from "./AllPosts";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Tags } from "./Tags";
import Lightbox from "yet-another-react-lightbox-lite";
import { useState } from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Header />
        <Tags />
      </div>
      <motion.div layout className="flex flex-row grow min-h-[400px] w-screen">
        <Navigation />
        {children}
        <AllPosts />
      </motion.div>
    </>
  );
};
