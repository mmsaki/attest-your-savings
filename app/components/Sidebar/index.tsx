"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import Image from "../Image";
import Icon from "../Icon";
import Menu from "./Menu";

type SidebarProps = {};

const Sidebar = ({}: SidebarProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 flex flex-col w-[18.75rem] pt-6 px-8 pb-4.5 bg-n-1 overflow-auto scroll-smooth xl:z-30 md:hidden ${
        visible ? "w-[18.75rem]" : "xl:w-20"
      }`}
    >
      <div className="flex justify-between items-center h-[1.625rem] mb-11">
        <Logo className={visible ? "flex" : "xl:hidden"} light />
        <button className="hidden xl:flex" onClick={() => setVisible(!visible)}>
          <Icon className="fill-white" name={visible ? "close" : "burger"} />
        </button>
      </div>
      <Menu visible={visible} />
      <div
        className={`flex items-center h-18 mt-auto mx-0 pt-10 ${
          visible ? "mx-0" : "xl:-mx-4"
        }`}
      >
        <Link
          className={`inline-flex items-center font-bold text-white text-sm transition-colors hover:text-purple-1 ${
            visible ? "mx-0 text-sm" : "xl:mx-auto xl:text-0"
          }`}
          href="/profile"
        >
          <div
            className={`relative w-5.5 h-5.5 mr-2.5 rounded-full overflow-hidden ${
              visible ? "mr-2.5" : "xl:mr-0"
            }`}
          >
            <Image
              className="object-cover scale-105"
              src="/images/avatars/avatar.jpg"
              fill
              alt="Avatar"
            />
          </div>
          Henry Richardson
        </Link>
        <button
          className={`btn-transparent-light btn-square btn-small ml-auto ${
            visible ? "flex" : "xl:hidden"
          }`}
        >
          <Icon name="dots" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
