import { FC } from "react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
};

const Pagination: FC<Props> = (props) => {
  const { page, pageSize, total, onPageChange } = props;

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div
      style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}
    >
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} / {pages}
      </span>
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
