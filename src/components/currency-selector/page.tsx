'use client';

import React, { useState } from 'react';
import { useCurrency } from '@/context/currency-context';
import { MdOutlineLanguage, MdOutlineKeyboardArrowDown } from 'react-icons/md';

const CurrencySelector: React.FC = () => {
  const { userCurrency, userCountry, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    localStorage.setItem('userCurrency', currencyCode);
    window.location.reload(); // Simple refresh to update context
    setIsOpen(false);
  };

  const currentCurrency = currencies.find((c) => c.code === userCurrency);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=''
        title='Change currency'
      >
        {/* <span className='hidden sm:inline'>{currentCurrency?.symbol}</span> */}
        <p className=' text-sm'>{currentCurrency?.code}</p>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-[120px] bg-[#eee1d398] rounded-lg shadow-lg z-[999] text-[#3f2a16]'>
          <div className='py-2'>
            {/* <div className='px-3 py-2 text-xs  '> {userCountry}</div> */}
            {currencies.map((currency: any) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#fafafa52] transition-colors ${
                  userCurrency === currency.code ? 'bg-[#fafafa52]' : ''
                }`}
              >
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{currency.symbol}</span>
                  <span>{currency.code}</span>
                  {/* <span className='text-gray-500 text-xs'>{currency.name}</span> */}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
