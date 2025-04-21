import Link from "next/link";
import { useState, useEffect } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/router";

export function Navigation() {
  const router = useRouter();
  const [isOpen, setOpen] = useState(true);

  // On navigation, close the navigation
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  return (
    <>
      <button
        className="self-start mt-4.5 text-grey z-40 hover:bg-grey/10 rounded-full hover:text-primary"
        onClick={() => setOpen(!isOpen)}
      >
        <Hamburger size={18} toggled={isOpen} toggle={setOpen} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="shrink-0 z-30 mt-2 overflow-clip"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "125px" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="py-5 pr-5">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/downloads">Downloads</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="relative ml-[-13px] w-[13px] h-[293px] shrink-0 z-30">
        <Image src="/img/sidebar.png" alt="sidebar" width={13} height={293} />
      </div>
    </>
  );
}
