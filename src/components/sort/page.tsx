'use client';
import { useState } from 'react';
import { MdSort } from 'react-icons/md';

type Props = {
  text?: string;
  options: { name: string }[];
  filterValue?: string;
  setFilterValue?: (value: string) => void;
};
const SortInput = ({
  options,
  filterValue,
  setFilterValue,
  text = 'Sort by',
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='w-[200px] m-4 '>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className='cursor-pointer flex justify-between items-center border border-[#E5E6E6] rounded-md p-2 text-[#5E6164] text-sm gap-2 h-[36px] w-full font-normal shadow-md '
      >
        <p className='  gap-3 pl-2  text-sm text-[#5E6164]'>
          {filterValue || text}
        </p>
        <MdSort size={18} />
      </div>
      {showDropdown && (
        <div className='bg-[#dbd9d2] w-[200px] max-h-[235px] overflow-y-auto rounded-sm p-2 absolute shadow-md text-xs sm:text-sm flex flex-col gap-2 z-50 mt-2'>
          {options.map(({ name }: { name: string }, index) => (
            <div
              key={index}
              onClick={() => {
                setFilterValue?.(name);
                setShowDropdown(false);
              }}
              className=' object-fit hover:bg-gray-300 hover:rounded-md cursor-pointer p-2'
            >
              <div className=''>{name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortInput;
