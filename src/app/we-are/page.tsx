/* eslint-disable @next/next/no-img-element */
'use client';

import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import Link from 'next/link';
import { useState } from 'react';
import { BsFillInfoSquareFill } from 'react-icons/bs';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const WeAre = () => {
  const [showImpact, setShowImpact] = useState(false);
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2] pb-10'>
      <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
        <Header />

        <div className='relative'>
          <div className='flex items-center justify-between gap-4 mt-4 w-full '>
            <Link href='/' className='flex gap-1  text-[#4d3c1dfb]'>
              <MdOutlineArrowBackIosNew size={20} />
              Back
            </Link>
            <p
              onClick={() => setShowImpact(!showImpact)}
              className='text-sm flex italic items-center gap-1  text-[#38271c] animate-bounce cursor-pointer w-fit '
            >
              <BsFillInfoSquareFill />
              Our Impact
            </p>
          </div>
          {showImpact && (
            <div className='bg-[#dbd9d2] absolute top-0 right-0 mt-5 p-4 transition-all duration-500 ease-in-out text-sm max-w-[500px] shadow-lg flex flex-col items-center justify-center'>
              <p className='underline underline-offset-4 p3-2'>IMPACT</p>
              <p>
                Reposition believes in the power of the creative mind, to
                create, sustain and advance the human experience across all
                sectors and fields of life.
              </p>{' '}
              <p className='underline underline-offset-4 py-3'>
                WHAT WE ARE DOING
              </p>
              <p>
                In collaboration with you, we seek to Identify and sponsor
                creative children with special needs from age 5-15yrs Old.
                Equipping them with knowledge, tools, access to mentorship and
                monthly upkeep.
              </p>{' '}
              <p className='underline underline-offset-4 py-3'>
                SPECIFIC FOCUS:
              </p>
              <p>
                Children with down syndrome, autism, and learning disabilities
                such as dyslexia.
              </p>{' '}
              <p className='underline underline-offset-4 py-3'>
                REGIONAL FOCUS:
              </p>
              <p>Africa [ Nigeria, Ghana, Mali, Côte d’ivoire, and Rwanda ]</p>{' '}
              <p className='underline underline-offset-4 py-3'>PURPOSE:</p>
              <p>
                To create level playing access to opportunities and support for
                less privileged special needs children, helping them to make
                their own contribution to humanity.
              </p>
            </div>
          )}
        </div>
        <div className='mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full'>
            <div className='flex flex-col items-center justify-center md:order-2'>
              <h4 className='text-sm md:text-lg text-center mb-4'>OUR STORY</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                Reposition is a brand cultured with love for elevated
                contemporary classics; A symbol of sustained heritage and
                generational craftsmanship, designed for a discerning few.
                According to our founder Ugo Solomon, “Your clothes and personal
                style are a reflection of your life’s mission”. Driven by our
                desire to help you position better in life towards fulfilling
                purpose, while doing so with faith, love and friendship in
                fellowship
              </p>
            </div>

            <div className='w-full h-[400px] sm:h-[600px] md:h-[750px] px-4'>
              <img
                src='/img3.png'
                alt='our-story'
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          <div className='my-8 md:my-16 flex flex-col items-center justify-center'>
            <h4 className='text-sm md:text-lg text-center mb-4'>The Vision</h4>
            <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

            <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
              To be the world’s leading transformative brand, delivering
              superior fit and quality with purpose.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full '>
            <div className='w-full h-[400px] sm:h-[600px] md:h-[750px] px-4 md:order-2'>
              <img
                src='/img4.png'
                alt='our-story'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='flex flex-col items-center justify-center  '>
              <h4 className='text-sm md:text-lg text-center mb-4'>Our Goal</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                Our goal is to weave stories together into clothes that
                represents you and your journey to creating legacy and fulfill
                purpose.
              </p>
            </div>
          </div>

          <div className='my-8 md:my-16 flex flex-col items-center justify-center'>
            <h4 className='text-sm md:text-lg text-center mb-4'>Our Mission</h4>
            <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

            <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
              To drive transformation through well crafted, tastefully finished
              menswear, together with experiences that leaves a legacy.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full '>
            <div className='w-full h-[400px] sm:h-[600px] md:h-[750px] px-4 '>
              <img
                src='/img5.png'
                alt='our-story'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='flex flex-col items-center justify-center  '>
              <h4 className='text-sm md:text-lg text-center mb-4'>Slogan</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <div className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                <p>Global Taste. African Craftsmanship.</p>
                <p className='text-start mt-1'>We stand for:</p>
                <ul className='text-start mt-1'>
                  <li>• Timeless Elegance</li>
                  <li>• Cultural Integrity</li>
                  <li>• Designing with Purpose</li>
                  <li>• Stewardship</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='my-8 md:my-16 flex flex-col items-center justify-center'>
            <h4 className='text-sm md:text-lg text-center mb-4'>Our Promise</h4>
            <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

            <div className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
              <ul className='text-start space-y-2'>
                <li>
                  • Personalized Style DNA. Fashion that feels personal,
                  palette, and lifestyle, so every piece feels made for your
                  journey.
                </li>
                <li>
                  • Personalized Touch & Care. Personal and garment care,
                  keeping you refreshed through curated, momentary experiences
                  and care
                </li>
                <li>
                  • Exclusive Fabric Selection. Fusing heritage fabrics with
                  modern performance, that commands admiration, and respect
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='fixed bottom-0 left-0 right-0'>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default WeAre;
