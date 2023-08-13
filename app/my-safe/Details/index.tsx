import Icon from "../../components/Icon";

type DetailsProps = {
  hash: string;
  options: {
    from: string;
    gasLimit: string;
  };
  transactionResponse: {
    accessList: null;
    blockHash: null;
    blockNumber: null;
    chainId: 0;
    confirmations: 0;
    creates: null;
    data: string;
    from: string;
    gasLimit: BigInt;
    gasPrice: BigInt;
    hash: string;
    maxFeePerGas: BigInt;
    maxPriorityFeePerGas: BigInt;
    nonce: number;
    r: string;
    s: string;
    to: string;
    transactionIndex: null;
    type: number;
    v: number;
    value: BigInt;
  };
};

const Details = (data: DetailsProps) => (
  <div className="card">
    <div className="card-head">
      <div className="text-h6">Transaction Details</div>
      <button className="group">
        <Icon
          className="icon-18 transition-colors dark:fill-white group-hover:fill-purple-1"
          name="chart"
        />
      </button>
    </div>
    <div className="pt-2 px-5 pb-5">
      <div>
        <div
          className="flex justify-between items-center py-3.5 border-b border-dashed border-n-1 text-sm last:border-none dark:border-white"
          id="execute-transaction"
        >
          <div className="font-medium text-n-3 dark:text-white/50">
            {data.hash}
          </div>
          <div className="font-bold">{}</div>
        </div>
      </div>
      <button className="btn-stroke btn-small w-full mt-4">
        <Icon name="chart-fill" />
        <span>See more details</span>
      </button>
    </div>
  </div>
);

export default Details;
