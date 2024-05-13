'use client';

import Header from '@/components/header/page';
import Typewriter from 'typewriter-effect';
import Slider from 'react-slick';
import Image from 'next/image';

const CampaignPage = () => {
  const settings = {
    dots: false,
    arrows: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className='bg-[#f8d3c98a] h-full min-h-screen'>
      <Header />
      <div className='p-4'>
        <h2 className='text-2xl font-semibold text-center mt-6'>
          <Typewriter
            options={{
              strings: ["NEW DROP | Summer '24", 'REPOSITION - Galatians 2:9'],
              autoStart: true,
              loop: true,
            }}
          />
        </h2>

        {/* <div className='my-6 flex flex-col items-center justify-center w-full h-full'>
          <div>
            <Slider {...settings} className=' '>
              <Image
                src={'/green2.JPG'}
                alt='product_image'
                width='200'
                height='200'
                className='border border-black shadow-md w-full h-full'
              />
            </Slider>
          </div>
          <p>New Drop</p>
          <p>May 2024</p>
        </div> */}
      </div>
    </div>
  );
};

export default CampaignPage;
