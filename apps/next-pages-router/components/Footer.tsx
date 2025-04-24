import Link from "next/link";

export function Footer() {
  return (
    <div className="md:mt-3 md:px-3 px-1 leading-tight text-xs md:text-sm fixed left-0 text-center sm:text-left w-full sm:w-auto bottom-0 sm:left-0 sm:relative">
      <div className="absolute bottom-full -left-1 w-[20px] h-[25px] bg-white z-40" />
      <p>The Home Of Raw Shaping Society © 2009-{new Date().getFullYear()}</p>
      <Link href="/posts/supported-by">
        Supporters of Raw Shaping Form Finding
      </Link>
    </div>
  );
}
