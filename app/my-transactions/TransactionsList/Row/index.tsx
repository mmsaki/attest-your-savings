import { useState } from "react";
import Image from "../../../components/Image";
import Icon from "../../../components/Icon";
import TransactionDetails from "../../../components/TransactionDetails";

type RowProps = {
  item: any;
};

const Row = ({ item }: RowProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <tr className="">
      <td className="td-custom font-medium text-n-3 md:hidden dark:text-white/75">
        {item.date}
      </td>
      <td className="td-custom md:pl-4">
        <div
          className="flex items-center transition-colors cursor-pointer hover:text-purple-1"
          onClick={() => setVisible(true)}
        >
          <div className="shrink-0 w-7 h-7 mr-3.5">
            <Image
              className="w-full"
              src={item.logo}
              width={28}
              height={28}
              alt="Logo"
            />
          </div>
          <div className="">
            <div className="font-bold">{item.title}</div>
            <div className="hidden font-medium text-xs text-n-3 md:block dark:text-white/75">
              {item.date}
            </div>
          </div>
        </div>
        <TransactionDetails
          visible={visible}
          onClose={() => setVisible(false)}
        />
      </td>
      <td className="td-custom font-medium text-n-3 lg:hidden dark:text-white/75">
        {item.service}
      </td>
      <td className="td-custom font-medium lg:hidden">{item.fee}</td>
      <td className="td-custom whitespace-nowrap text-right font-bold md:pr-4">
        {item.price}
      </td>
      <td className="td-custom w-15 text-center !px-0 md:hidden">
        <button className="btn-transparent-dark btn-small btn-square">
          <Icon name="dots" />
        </button>
      </td>
    </tr>
  );
};

export default Row;
