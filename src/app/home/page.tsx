'use client';
import Footer from '@/components/footer/page';
import Header from '@/components/header/page';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { ThreeCircles } from 'react-loader-spinner';
import { Fragment, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import { useProductContext } from '@/context/product-context';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useProductContext();
  // const [products, setProducts] = useState<ProductDetailType[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select();
      setProducts(data ?? []);
      if (error) {
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setShowErrorModal(true);
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
    <Fragment>
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
        ) : products.length === 0 ? (
          <div className='w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-3 xs:p-4 text-sm'>
            {' '}
            No Products Available
          </div>
        ) : (
          <div className='w-full min-h-[85vh] md:min-h-full mt-4 text-xs lg:text-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-3 xs:p-4'>
            {products.map((item) => (
              <Link href={`product/${item.id}`} key={item.id}>
                <Image
                  src={item.images[0]}
                  alt='product_image'
                  width='200'
                  height='300'
                  className='sm:min-h-[300px] object-cover'
                />
                <p className='my-1 font-medium'>{item.name}</p>
                <p>{item.price}</p>
                {item.sold_out && (
                  <p className='font-semibold mt-1'>Sold Out</p>
                )}
              </Link>
            ))}
          </div>
        )}
        <Footer />
      </div>
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description='Sorry an error occured while loading the products'
        />
      )}
    </Fragment>
  );
};

export default Home;
