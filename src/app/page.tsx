'use client';
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import { products } from '@/utils/data';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { ThreeCircles } from 'react-loader-spinner';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Home = () => {
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select();
      console.log(data, 'a');
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  // const getSession = async () => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();
  //   if (session !== null) {
  //     localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
  //     localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session.user.email ?? '');
  //   }
  // };

  // const refreshSession = async () => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.refreshSession();

  //   if (session !== null) {
  //     localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
  //     localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session.user?.email ?? '');
  //   }
  // };

  // useEffect(() => {
  //   getSession();
  //   refreshSession();
  // }, []);
  return (
    <div className='w-full relative min-h-[100vh] bg-[#dbd9d2] '>
      <Header />
      <div className='hidden md:flex flex-col items-center justify-center w-full h-[85vh] p-3 xs:p-4'>
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

      {loading ? (
        <div className='grow w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-3 xs:p-4'>
          <ThreeCircles
            visible={true}
            height={50}
            width={50}
            color='#b4b4b4ad'
            ariaLabel='three-circles-loading'
            wrapperClass='my-4'
          />
        </div>
      ) : (
        <div className='w-full min-h-[85vh] md:min-h-full mt-4 text-xs lg:text-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-3 xs:p-4'>
          {products.map((item, index) => (
            <Link href='product/{index}' key={index}>
              <Image
                src={item.img}
                alt='product_image'
                width='172'
                height='179'
                className='product_image object-cover'
              />
              <p className='my-1 font-medium'>{item.product_name}</p>
              <p>{item.price}</p>
              <p className='font-semibold mt-1'>Sold Out</p>
            </Link>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
