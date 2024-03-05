'use client';
import { Fragment, ReactNode } from 'react';
// import { Paginate } from './paginate';

export type TableProps = {
  headers: (JSX.Element | string)[];
  children: JSX.Element[];
  loading?: boolean;
  pageCount?: number;
  onPageChange?: (selectedPage: { selected: number }) => void;
  canSelect?: boolean;
  isAllSelected?: boolean;
  onToggleAll?: () => void;
  hideOnMobile?: boolean;
  mobileContent?: ReactNode;
};

export function Table({
  headers,
  children,
  loading,
  pageCount = 1,
  onPageChange,
  canSelect,
  isAllSelected,
  onToggleAll,
  hideOnMobile,
  mobileContent,
}: TableProps) {
  return (
    <Fragment>
      <table className={`table ${hideOnMobile ? 'lg-and-above' : ''}`}>
        <thead className='table__head'>
          <tr className='table__head__row'>
            {canSelect && (
              <th>
                <input
                  className='table__data_checkbox'
                  type='checkbox'
                  checked={isAllSelected}
                  onChange={() => onToggleAll?.()}
                />
              </th>
            )}
            {headers.map((h, i) => (
              <th key={i} className='table__head__row__text'>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children.map((b) => b)}</tbody>
      </table>
      {mobileContent && <div className='table__mobile'>{mobileContent}</div>}
      {loading && <p className='table__loading'>Loading...</p>}
      {/* <Paginate pageCount={pageCount} onPageChange={(e) => onPageChange?.(e)} /> */}
    </Fragment>
  );
}
