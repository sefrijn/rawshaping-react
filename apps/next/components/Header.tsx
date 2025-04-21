import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="p-2">
      <Link
        href="/posts"
        title="Rawshaping"
        className="hover:opacity-50 transition-opacity duration-300"
      >
        <Image
          src="/img/header.png"
          alt="Rawshaping"
          width={410}
          height={102}
        />
      </Link>
    </header>
  );
}
