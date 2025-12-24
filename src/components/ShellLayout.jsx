"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ShellLayout({ children }) {
  const pathname = usePathname();
  const hideNav = pathname === "/login";

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}
