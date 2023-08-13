import Link from "next/link";
import Image from "../Image";
import Icon from "../Icon";

type CategoryProps = {
  item: any;
};

const Category = ({ item }: CategoryProps) => (
  <div className="block w-[calc(33.333%-1.25rem)] mt-2.5 mx-2.5 px-5 py-6 card lg:w-full lg:mx-0">
    <div className="flex justify-center items-center w-12 h-12 mb-5 border border-n-1 dark:bg-white dark:border-white">
      <Image className="w-4.5" src={item.icon} width={18} height={18} alt="" />
    </div>
    <div className="mb-3 text-h6">{item.title}</div>
    <div className="flex flex-col items-start mb-4">
      {item.links.map((link: any, index: number) => (
        <Link
          className="mb-2.5 text-sm font-bold text-purple-1 transition-colors hover:text-purple-2 last:mb-0"
          href={`${item.path}`}
          key={index}
        >
          {link}
        </Link>
      ))}
    </div>
    <Link
      className="group flex items-center text-xs font-bold text-n-1 transition-colors dark:text-white hover:!text-purple-1"
      href={`${item.path}`}
    >
      <Icon
        className="mr-1.5 transition-colors dark:fill-white group-hover:fill-purple-1"
        name="arrow-next"
      />
      See more
    </Link>
  </div>
);

export default Category;
