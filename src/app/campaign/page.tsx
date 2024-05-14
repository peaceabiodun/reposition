'use client';

import Header from '@/components/header/page';
import Typewriter from 'typewriter-effect';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

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
    swipeToSlide: true,
    autoplaySpeed: 3000,
  };

  const campaignDetails = [
    {
      image: '/green2.JPG',
    },
    {
      image: '/green3.JPG',
    },
  ];
  return (
    <div className='bg-[#f8d3c98a] h-full min-h-screen'>
      <Header />
      <Link href='/' className=' gap-1 flex text-sm items-center p-4 '>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='p-4'>
        <h2 className='text-lg sm:text-2xl font-semibold text-center mt-6'>
          <Typewriter
            options={{
              strings: ["NEW DROP | Summer '24", 'REPOSITION - The Fellowship'],
              autoStart: true,
              loop: true,
            }}
          />
        </h2>

        <div className='my-6 w-full flex flex-col items-center justify-center '>
          <Slider {...settings} className='w-full h-full  '>
            {campaignDetails.map((itm, index) => (
              <div key={index} className=''>
                <img
                  src={itm.image}
                  alt='campaign-image'
                  className=' object-contain w-full h-[400px] sm:h-[600px]'
                />
              </div>
            ))}
          </Slider>

          <div className='text-[#704e21] text-sm md:text-[16px] font-semibold flex flex-col items-center gap-2 mt-3'>
            <p>New Drop coming soon</p>
            <p>May 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
