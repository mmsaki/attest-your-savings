import Link from "next/link";
import { useColorMode } from "@chakra-ui/color-mode";
import Image from "../Image";

type TestProps = {
  className?: string;
  light?: boolean;
};

const Test = ({ className, light }: TestProps) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <Link className={`flex w-[7.125rem] ${className} items-center`} href="/">
      <Image
        className="w-full h-auto"
        src={light ? "/logo-light.svg" : isDarkMode ? "/Logo.svg" : "/Logo.svg"}
        width={22}
        height={22}
        alt="attest"
        priority
      />
      <div className="flex whitespace-pre">
        <p className="text-white font-bold pl-2 flex">My Savings</p>
      </div>
    </Link>
  );
};

export default Test;
