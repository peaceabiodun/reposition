/* eslint-disable @next/next/no-img-element */
'use client';

import Header from '@/components/header/page';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const OurImpact = () => {
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2] pb-10'>
      <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
        <Header />

        <Link href='/' className='flex gap-1 w-fit text-[#4d3c1dfb] mt-4 mb-10'>
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>

        <div className='mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full'>
            <div className='flex flex-col items-center justify-center md:order-2'>
              <div className='flex flex-col items-center justify-center'>
                <h4 className='text-sm md:text-lg text-center mb-4'>IMPACT</h4>
                <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

                <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                  Reposition believes in the power of the creative mind, to
                  create, sustain and advance the human experience across all
                  sectors and fields of life.
                </p>
              </div>

              <div className='flex flex-col items-center justify-center mt-8'>
                <h4 className='text-sm md:text-lg text-center mb-4'>
                  WHAT WE ARE DOING
                </h4>
                <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

                <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                  In collaboration with you, we seek to Identify and sponsor
                  creative children with special needs from age 5-15yrs Old.
                  Equipping them with knowledge, tools, access to mentorship and
                  monthly upkeep.
                </p>
              </div>
            </div>

            <div className='w-full h-[400px] sm:h-[600px] md:h-[750px] px-4'>
              <img
                src='/children.png'
                alt='our-story'
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          <div className='my-8 md:my-16 flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
              <h4 className='text-sm md:text-lg text-center mb-4'>
                SPECIFIC FOCUS
              </h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                Children with down syndrome, autism, and learning disabilities
                such as dyslexia.
              </p>
            </div>

            <div className='flex flex-col items-center justify-center my-8'>
              <h4 className='text-sm md:text-lg text-center mb-4'>
                REGIONAL FOCUS
              </h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                <p>Africa:</p>
                Nigeria, Ghana, Mali, Côte d’ivoire, and Rwanda
              </p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <h4 className='text-sm md:text-lg text-center mb-4'>PURPOSE</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                To create level playing access to opportunities and support for
                less privileged special needs children, helping them to make
                their own contribution to humanity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurImpact;
