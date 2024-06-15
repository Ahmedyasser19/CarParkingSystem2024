"use client";
import Link from "next/link";
import "./Navbar.css";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathName = usePathname();

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Garage", path: "/garage" },
    { title: "reserve", path: "/reserve" },
    { title: "Logs", path: "/logs" },
    { title: "About", path: "/about" },
  ];

  const printNavLinks = () => {
    return navLinks.map((item) => (
      <Link
        href={item.path}
        key={item.title}
        className={pathName === item.path ? "activeTab" : ""}
      >
        {item.title}
      </Link>
    ));
  };

  return (
    <nav>
      <div className="logo">Parking Smart</div>
      <div className="navbarMenu ">{printNavLinks()}</div>
    </nav>
  );
};

export default Navbar;
