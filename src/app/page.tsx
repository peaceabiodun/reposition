'use client';
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';

const Home = () => {
  const products = [
    {
      img: '/img1.jpg',
      product_name: 'Reposition White Jacket',
      price: '$75',
    },
    {
      img: '/img2.jpg',
      product_name: 'Reposition White Jacket',
      price: '$100',
    },
    {
      img: '/img3.jpg',
      product_name: 'Reposition White Jacket',
      price: '$75',
    },
  ];
  return (
    <main className='w-full min-h-screen bg-[#ece8e3] p-3 xs:p-4'>
      <Header />
      <div className='hidden md:flex flex-col items-center justify-center w-full h-[85vh]'>
        <h2 className='text-4xl font-semibold'>
          <Typewriter
            options={{
              strings: ['REPOSITION [ ]', 'REPOSITION [ ]'],
              autoStart: true,
              loop: true,
            }}
          />
        </h2>
        <p className='mt-2 text-sm'>Exodus Collection is here</p>
      </div>
      <div className='mt-4 text-xs lg:text-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
        {products.map((item, index) => (
          <Link href='product/{index}' key={index}>
            <Image
              src={item.img}
              alt='product_image'
              width='172'
              height='179'
              className='product_image'
            />
            <p className='my-1 font-medium'>{item.product_name}</p>
            <p>{item.price}</p>
          </Link>
        ))}
      </div>
      <Footer />
    </main>
  );
};

export default Home;
