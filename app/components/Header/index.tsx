"use client";

import { useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useRouter, usePathname } from "next/navigation";
import Icon from "../Icon";
import Image from "../Image";
import Create from "./Create";
import Apps from "./Apps";

type HeaderProps = {
  back?: boolean;
  title?: string;
};

const Header = ({ back, title }: HeaderProps) => {
  const [headerStyle, setHeaderStyle] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useScrollPosition(({ currPos }) => {
    setHeaderStyle(currPos.y <= -1);
  });

  return (
    <header
      className={`fixed top-0 right-0 left-[18.75rem] z-20 border-b border-n-1 xl:left-20 md:left-0 md:relative dark:border-white ${
        headerStyle ? "bg-background dark:bg-n-2 md:!bg-transparent" : ""
      }`}
    >
      <div className="flex items-center max-w-[90rem] m-auto w-full h-18 px-16 2xl:px-8 lg:px-6 md:px-5">
        {back && (
          <button
            className="btn-stroke btn-square btn-medium shrink-0 mr-6 2xl:mr-4 md:!w-6 md:h-6 md:mr-3"
            onClick={() => router.back()}
          >
            <Icon name="arrow-prev" />
          </button>
        )}
        {title && (
          <div className="mr-4 text-h3 truncate md:mr-2 md:text-h4">
            {title}
          </div>
        )}
        <div className="flex items-center shrink-0 ml-auto">
          <Apps />
          <Create />
          <button className="relative hidden w-8 h-8 ml-1 md:block">
            <Image
              className="rounded-full object-cover"
              src="/images/avatars/avatar.jpg"
              fill
              alt="Avatar"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
