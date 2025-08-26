'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface CurrencyContextType {
  userCurrency: string;
  userCountry: string;
  exchangeRates: Record<string, number> | null;
  convertPrice: (priceInNaira: number) => string;
  formatPrice: (price: number, currency: string) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [userCurrency, setUserCurrency] = useState<string>('NGN');
  const [userCountry, setUserCountry] = useState<string>('Nigeria');
  const [exchangeRates, setExchangeRates] = useState<Record<
    string,
    number
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Currency symbols and formatting
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
  };

  // Country to currency mapping
  const countryToCurrency: Record<string, string> = {
    'United States': 'USD',
    'United Kingdom': 'GBP',
    Canada: 'CAD',
    Australia: 'AUD',
    Germany: 'EUR',
    France: 'EUR',
    Italy: 'EUR',
    Spain: 'EUR',
    Netherlands: 'EUR',
    Belgium: 'EUR',
    Austria: 'EUR',
    Switzerland: 'CHF',
    Japan: 'JPY',
    China: 'CNY',
    India: 'INR',
    Nigeria: 'NGN',
    Ghana: 'GHS',
    Kenya: 'KES',
    'South Africa': 'ZAR',
  };

  // Detect user location and set currency
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Try to get location from localStorage first
        const savedCurrency = localStorage.getItem('userCurrency');
        const savedCountry = localStorage.getItem('userCountry');

        if (savedCurrency && savedCountry) {
          setUserCurrency(savedCurrency);
          setUserCountry(savedCountry);
        } else {
          // Detect location using IP geolocation
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();

          const country = data.country_name || 'Nigeria';
          const currency = countryToCurrency[country] || 'NGN';

          setUserCountry(country);
          setUserCurrency(currency);

          // Save to localStorage
          localStorage.setItem('userCurrency', currency);
          localStorage.setItem('userCountry', country);
        }
      } catch (error) {
        console.log('Error detecting location:', error);
        // Fallback to Nigeria/Naira
        setUserCountry('Nigeria');
        setUserCurrency('NGN');
      }
    };

    detectUserLocation();
  }, []);

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (userCurrency === 'NGN') {
        setExchangeRates(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/NGN`
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.log('Error fetching exchange rates:', error);
        setExchangeRates(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (userCurrency) {
      fetchExchangeRates();
    }
  }, [userCurrency]);

  // Convert price from Naira to user's currency
  const convertPrice = (priceInNaira: number): string => {
    if (userCurrency === 'NGN' || !exchangeRates) {
      return priceInNaira.toString();
    }

    const rate = exchangeRates[userCurrency];
    if (!rate) {
      return priceInNaira.toString();
    }

    const convertedPrice = priceInNaira * rate;
    return convertedPrice.toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (price: number, currency: string): string => {
    const symbol = currencySymbols[currency] || currency;

    if (currency === 'NGN') {
      return `₦${price.toLocaleString()}`;
    }

    return `${symbol}${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const value: CurrencyContextType = {
    userCurrency,
    userCountry,
    exchangeRates,
    convertPrice,
    formatPrice,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
