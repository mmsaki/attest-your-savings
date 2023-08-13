import Icon from "../Icon";

type TablePaginationProps = {};

const TablePagination = ({}: TablePaginationProps) => (
  <div className="flex justify-between items-center mt-6 md:mt-5">
    <button className="btn-stroke btn-small">
      <Icon name="arrow-prev" />
      <span>Prev</span>
    </button>
    <div className="text-sm font-bold">Page 1 of 1</div>
    <button className="btn-stroke btn-small">
      <span>Next</span>
      <Icon name="arrow-next" />
    </button>
  </div>
);

export default TablePagination;
