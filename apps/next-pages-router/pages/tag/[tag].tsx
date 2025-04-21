import PageTransition from "@/components/Transition";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function TagPage() {
  const router = useRouter();
  const slug = router.query.tag as string;
  const [slugState] = useState(slug);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-12 relative border-r border-r-grey z-20 bg-white mr-3"
    >
      <p className="w-full text-center font-bold text-xs">tag</p>
      <h1 className="font-bold rotate-90 origin-bottom-left absolute top-2 left-2 w-[60vh] text-lg text-primary line-clamp-1">
        {slugState}
      </h1>
    </motion.div>
  );
}
