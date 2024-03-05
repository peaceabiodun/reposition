'use client';

export type TableRowProps = {
  children: JSX.Element | JSX.Element[];
  className?: string;
  canSelect?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
};

export function TableRow({
  children,
  className = '',
  canSelect,
  isSelected,
  onToggle,
}: TableRowProps) {
  return (
    <tr className={`table__row ${className}`}>
      {canSelect && (
        <td className={`table__row__data`}>
          <input
            className='table__data_checkbox accent-gray-400'
            type='checkbox'
            checked={isSelected}
            onChange={() => onToggle?.()}
          />
        </td>
      )}
      {children}
    </tr>
  );
}
