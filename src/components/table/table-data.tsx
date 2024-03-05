'use client';
export type TableDataProps = {
  children: JSX.Element | JSX.Element[] | string | string[] | number;
  className?: string;
};

export function TableData({ children, className = '' }: TableDataProps) {
  return <td className={`table__data_cell ${className}`}>{children}</td>;
}
