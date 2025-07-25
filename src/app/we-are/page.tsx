'use client';

import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import Typewriter from 'typewriter-effect';

const WeAre = () => {
  return (
    <div className='w-full h-screen we_are_bg overflow-y-hidden '>
      <div className='bg-[#8b68265e]'>
        <Header />
      </div>

      <Link href='/' className='flex gap-1 mt-4 px-4 md:p-8 text-[#4d3c1dfb]'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='w-full h-full p-4 flex flex-col items-center text-[#4d3c1d] text-sm font-semibold'>
        <h3 className='text-center'>
          We are a brand with love for elevated and contemporary classics; our
          symbol of sustained heritage and craftsmanship for a discerning few -
          designed to last.
        </h3>
        <h3 className='mt-4 text-center'>
          As we help each other as much as we can to adjust our position -
          connect better in a personal fellowship with God, in spirit and in
          truth.
        </h3>
      </div>
      {/* <div className='blur_bg w-full h-full p-4 flex flex-col justify-center items-center'>
        <h2 className='text-[#e4e0e0] font-bold text-xl mb-7 mt-[-80px]'>
          We Are
        </h2>
        <div className='sm:max-w-[450px] text-[#e4e3e0] border-[2px] border-[#4d3c1da2] p-2 bg-[#f7f3e548]'>
          <h3>
            We are a people with love for elevated streetwear and contemporary
            classics; as it maintains it&apos;s appeal through time - our symbol
            of sustained style, designed to last.{' '}
          </h3>
          <h3 className='mt-4'>
            <Typewriter
              options={{
                strings: [
                  'As we help each other as much as we can to adjust our position - connect better in a personal fellowship with God, in spirit and in truth. ',
                  'As we help each other as much as we can to adjust our position - connect better in a personal fellowship with God, in spirit and in truth.',
                ],
                autoStart: true,
                loop: true,
                delay: 1,
              }}
            />
          </h3>
        </div>
      </div> */}
      <div className='fixed bottom-0 left-0 right-0'>
        <Footer />
      </div>
    </div>
  );
};

export default WeAre;
