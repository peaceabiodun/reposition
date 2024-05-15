'use client';

import Header from '@/components/header/page';
import Typewriter from 'typewriter-effect';
import Slider from 'react-slick';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { Fragment, useState } from 'react';
import EditCampaign from '@/components/edit-campaign-modal/page';
import { STORAGE_KEYS } from '@/utils/constants';
import ReactPlayer from 'react-player';

const CampaignPage = () => {
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false);

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

  const userRole =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      : '';
  return (
    <Fragment>
      <div className='bg-[#f8d3c98a] h-full min-h-screen'>
        <Header />
        <div className='p-4 gap-1 flex justify-between text-sm items-center'>
          <Link href='/' className=' gap-1 flex text-sm items-center'>
            <MdOutlineArrowBackIosNew size={20} />
            Back
          </Link>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setShowEditCampaignModal(true)}
              className='border border-[#3d3e3f]  p-2 text-xs md:text-sm'
            >
              Edit Campaign
            </button>
          )}
        </div>

        <div className='p-4'>
          <h2 className='text-lg sm:text-2xl font-semibold text-center mt-6'>
            <Typewriter
              options={{
                strings: [
                  "NEW DROP | Summer '24",
                  'REPOSITION - The Fellowship',
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>

          <div className='my-6 flex flex-col items-center justify-center '>
            <div className='w-full sm:h-[600px] '>
              <ReactPlayer
                width='100%'
                height='100%'
                url={'/video1.mp4'}
                controls={true}
                playing={true}
                loop={true}
              />
            </div>
            {/* {campaignDetails.map((itm, index) => (
              <div key={index} className=''>
                <img
                  src={itm.image}
                  alt='campaign-image'
                  className=' object-contain w-full h-[400px] sm:h-[600px]'
                />
              </div>
            ))} */}

            <div className='text-[#704e21] text-sm md:text-[16px] font-semibold flex flex-col items-center gap-2 mt-3'>
              <p>Now Available</p>
              <p>May 2024</p>
            </div>
          </div>
        </div>
      </div>
      {showEditCampaignModal && (
        <EditCampaign
          show={showEditCampaignModal}
          onClose={() => setShowEditCampaignModal(false)}
        />
      )}
    </Fragment>
  );
};

export default CampaignPage;
