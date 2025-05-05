import { motion } from "motion/react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[calc(100vw-75px)] sm:w-md lg:w-lg bg-white shrink-0 z-10 relative self-stretch flex mr-[13px]"
    >
      {children}
    </motion.div>
  );
}
