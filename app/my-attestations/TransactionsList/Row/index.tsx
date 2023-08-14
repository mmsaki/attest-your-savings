import { useEffect, useState } from "react";
import Image from "../../../components/Image";
import Icon from "../../../components/Icon";
import TransactionDetails from "../../../components/TransactionDetails";
import { AttestationProps } from "..";
import Link from "next/link";
import { useNetwork } from "wagmi";

type Props = {
  item: AttestationProps;
};

const Row = ({ item }: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { chain } = useNetwork();
  const [network, setNetwork] = useState("");

  if (!chain) throw Error("Not connected");

  useEffect(() => {
    setNetwork(chain.network);
  }, [chain.network]);

  return (
    <tr className="">
      <td className="td-custom font-medium text-n-3 md:hidden dark:text-white/75">
        {item.blockTimestamp}
      </td>
      <td className="td-custom md:pl-4">
        <div
          className="flex items-center transition-colors cursor-pointer hover:text-purple-1"
          onClick={() => setVisible(true)}
        >
          <div className="">
            <div className="font-bold">{item.attester}</div>
            <div className="hidden font-medium text-xs text-n-3 md:block dark:text-white/75">
              {item.blockTimestamp}
            </div>
          </div>
        </div>
        {/* <TransactionDetails
          visible={visible}
          onClose={() => setVisible(false)}
        /> */}
      </td>
      <td className="td-custom font-medium text-n-3 lg:hidden dark:text-white/75  hover:text-purple-1">
        {network === "base-goerli" ? (
          <Link href={`https://goerli.basescan.org/tx/${item.transactionHash}`}>
            {item.transactionHash}
          </Link>
        ) : (
          item.transactionHash
        )}
      </td>
      <td className="td-custom font-medium lg:hidden">{item.__typename}</td>
      <td className="td-custom whitespace-nowrap text-right font-bold md:pr-4">
        {-100}
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
