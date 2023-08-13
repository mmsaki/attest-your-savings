import Modal from "../Modal";
import Image from "../Image";
import Icon from "../Icon";

type DetailsProps = {
  visible: boolean;
  onClose: () => void;
};

const Details = ({ visible, onClose }: DetailsProps) => {
  return (
    <Modal
      classWrap="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[10.4375rem] before:bg-[#6653CE] md:before:h-[8rem]"
      classButtonClose="z-2 fill-white"
      visible={visible}
      onClose={onClose}
    >
      <div className="relative z-1 card-title border-white text-white">
        Transaction details
      </div>
      <div className="pt-18 px-5 pb-7 md:pt-8">
        <div className="mb-10 text-center">
          <div className="relative z-1 w-15 h-15 mx-auto mb-3 border-4 border-white rounded-full dark:border-n-1">
            <Image
              className="w-full"
              src="/images/logo-4.png"
              width={60}
              height={60}
              alt="Logo"
              priority
            />
          </div>
          <div className="mb-1 text-h4 md:text-h5">
            2,702.12 USD to James Dean
          </div>
          <div className="mb-3.5 text-sm font-medium text-n-3 dark:text-white/50">
            Completed Thursday 29 April
          </div>
          <div className="label-green min-w-[4.75rem]">Paid</div>
        </div>
        <div className="flex justify-between mb-6 pb-6 border-b border-dashed border-n-1 md:block dark:border-white">
          <div className="md:mb-5">
            <div className="mb-2 text-xs font-medium text-n-3 dark:text-white/75">
              Bank Details
            </div>
            <div className="font-medium">
              <p>James Dean</p>
              <p>james.dea89@gmail.com</p>
            </div>
          </div>
          <div className="text-right md:text-left">
            <div className="mb-2 text-xs font-medium text-n-3 dark:text-white/75">
              Amount
            </div>
            <div className="font-medium">2,702.12 USD</div>
          </div>
        </div>
        <div className="flex justify-between mb-8 md:block">
          <div className="md:mb-5">
            <div className="mb-2 text-xs font-medium text-n-3 dark:text-white/75">
              Send To
            </div>
            <div className="font-medium">
              <p>GE91TB7752145031788598TBCBGE22</p>
              <p>Transfer #241894617</p>
            </div>
          </div>
          <div className="text-right md:text-left">
            <div className="mb-2 text-xs font-medium text-n-3 dark:text-white/75">
              Exchange Rate
            </div>
            <div className="font-medium">1.00000</div>
          </div>
        </div>
        <div className="flex justify-between md:block">
          <button className="btn-stroke min-w-[10.125rem] outline-none md:min-w-full md:mb-3">
            <span>Print</span>
            <Icon name="print" />
          </button>
          <button className="btn-stroke min-w-[10.125rem] outline-none md:min-w-full">
            <span>Issue Refund</span>
            <Icon name="clock-1" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Details;
