import Link from "next/link";
import Icon from "../Icon";
import ToggleTheme from "./ToggleTheme";

const navigations = [
  {
    title: "Privacy Policy",
    url: "/",
  },
  {
    title: "License",
    url: "/",
  },
  {
    title: "API",
    url: "/",
  },
];

type FooterProps = {};

const Footer = ({}: FooterProps) => (
  <footer className="">
    <div className="flex items-center h-16 px-16 max-w-[90rem] mx-auto 2xl:px-8 lg:px-6 md:px-5">
      <button className="inline-flex items-center mr-8 text-xs font-bold dark:fill-white transition-colors hover:text-purple-1 hover:fill-purple-1 md:mr-auto dark:hover:fill-purple-1">
        <Icon className="mr-1.5 fill-inherit" name="earth" />
        English
      </button>
      <div className="flex mr-auto">
        {navigations.map((link, index) => (
          <Link
            className="mr-8 text-xs font-bold transition-colors hover:text-purple-1 last:mr-0 md:mr-4"
            href={link.url}
            key={index}
          >
            {link.title}
          </Link>
        ))}
      </div>
      <ToggleTheme />
    </div>
  </footer>
);

export default Footer;
