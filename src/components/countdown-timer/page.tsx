'use client';

import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const targetDate = new Date('2024-11-30T00:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='w-full max-w-md mx-auto bg-[#dbd9d2] shadow-md my-6 rounded-md text-[#311b07]'>
      <div className='p-6'>
        <div className='grid grid-cols-4 gap-4 text-center'>
          <div className='flex flex-col'>
            <span className='text-2xl md:text-3xl font-bold '>
              {timeLeft.days}
            </span>
            <span className='text-sm'>Days </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-2xl md:text-3xl font-bold '>
              {timeLeft.hours}
            </span>
            <span className='text-sm'>Hours</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-2xl md:text-3xl font-bold '>
              {timeLeft.minutes}
            </span>
            <span className='text-sm'>Minutes</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-2xl md:text-3xl font-bold '>
              {timeLeft.seconds}
            </span>
            <span className='text-sm'>Seconds</span>
          </div>
        </div>
        <p className='text-center mt-4 text-sm'>
          {timeLeft.days} day(s) to go before late payment
        </p>
        <p className='text-center mt-2 text-sm'>7 Solts left</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
