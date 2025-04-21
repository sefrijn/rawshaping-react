"use client";
import Link from "next/link";
import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";

export function Navigation() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!isOpen)}>
        <Hamburger toggled={isOpen} toggle={setOpen} />
      </button>
      <nav className="p-5 w-36 shrink-0 z-30 md:relative fixed">
        <ul>
          <li>
            <Link href="/posts">Home</Link>
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
      </nav>
    </>
  );
}
