/* eslint-disable @next/next/no-img-element */
'use client';

import Footer from '@/components/footer/page';
import Header from '@/components/header/page';

import { useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const OurStory = () => {
  const router = useRouter();
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#C4BAAF] pb-10'>
      <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
        <Header />

        <div
          onClick={() => router.back()}
          className='mt-4 gap-1 flex text-sm items-center px-3 xs:px-4'
        >
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </div>

        <div className='mt-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full'>
            <div className='flex flex-col items-center justify-center md:order-2'>
              <h4 className='text-sm md:text-lg text-center mb-4'>OUR STORY</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <p className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
                Reposition is a brand cultured with love for elevated
                contemporary classics; A symbol of sustained heritage and
                generational craftsmanship, designed for a discerning few.{' '}
                <br />
                <br />
                According to our founder Ugo Solomon, “Your clothes and personal
                style are a reflection of your life’s mission”. <br /> <br />
                Driven by our desire to help you position better in life towards
                fulfilling purpose, while doing so with faith, love and
                friendship in fellowship
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
            <h4 className='text-sm md:text-lg text-center mb-4'>Our Vision</h4>
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
              <h4 className='text-sm md:text-lg text-center mb-4'>Values</h4>
              <div className='w-[280px] sm:w-[350px] h-[1px] bg-[#4d3c1dfb] px-2' />

              <div className='text-xs sm:text-sm text-center max-w-[550px] mt-6'>
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
                  • Personalized Style DNA. Fashion that feels personal and
                  woven into your lifestyle, so each piece feels made for your
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

export default OurStory;
