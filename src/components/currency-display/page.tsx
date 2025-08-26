'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/context/currency-context';

interface CurrencyDisplayProps {
  priceInNaira: number;
  className?: string;
  showToggle?: boolean;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  priceInNaira,
  className = '',
  showToggle = true,
}) => {
  const { userCurrency, convertPrice, formatPrice, isLoading } = useCurrency();
  const [showOriginalPrice, setShowOriginalPrice] = useState(false);

  // If user is in Nigeria, just show Naira price
  if (userCurrency === 'NGN') {
    return <span className={className}>₦{priceInNaira.toLocaleString()}</span>;
  }

  const convertedPrice = parseFloat(convertPrice(priceInNaira));
  const originalPrice = `₦${priceInNaira.toLocaleString()}`;
  const displayPrice = formatPrice(convertedPrice, userCurrency);

  if (!showToggle) {
    return (
      <div className='flex flex-col'>
        <span className={className}>{displayPrice}</span>
        <span className='text-xs text-gray-500 mt-1'>{originalPrice}</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='flex flex-col'>
        <span className={className}>
          {showOriginalPrice ? originalPrice : displayPrice}
        </span>
        {/* {!showOriginalPrice && (
          <span className='text-xs text-gray-500 mt-1'>{originalPrice}</span>
        )} */}
      </div>
    </div>
  );
};

export default CurrencyDisplay;
