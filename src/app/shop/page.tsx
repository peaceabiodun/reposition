'use client';

import { useProductContext } from '@/context/product-context';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import { supabase } from '@/lib/supabase';
import { ENUM_PRODUCT_FILTER_LIST } from '@/utils/enum';
import ErrorModal from '@/components/error-modal/page';
import Header from '@/components/header/page';
import Footer from '@/components/footer/page';
import { useRouter } from 'next/navigation';

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useProductContext();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );

  const options = [
    { name: ENUM_PRODUCT_FILTER_LIST.ALL },
    { name: ENUM_PRODUCT_FILTER_LIST.SHIRTS },
    { name: ENUM_PRODUCT_FILTER_LIST.SHORTS },
    { name: ENUM_PRODUCT_FILTER_LIST.SHOES },
    { name: ENUM_PRODUCT_FILTER_LIST.SUIT },
    { name: ENUM_PRODUCT_FILTER_LIST.COAT },
    { name: ENUM_PRODUCT_FILTER_LIST.PANTS },
    { name: ENUM_PRODUCT_FILTER_LIST.BAGS },
    { name: ENUM_PRODUCT_FILTER_LIST.ACCESSORIES },
    { name: ENUM_PRODUCT_FILTER_LIST.TSHIRTS },
    { name: ENUM_PRODUCT_FILTER_LIST.HOODIES },
    { name: ENUM_PRODUCT_FILTER_LIST.HAT },
    { name: ENUM_PRODUCT_FILTER_LIST.JACKET },
  ];
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('products')
        .select()
        .order('created_at', { ascending: false });
      if (data !== null) {
        if (filterValue !== ENUM_PRODUCT_FILTER_LIST.ALL) {
          data = data.filter((product) => product.category === filterValue);
        }
        setProducts(data ?? []);
      }

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
  }, [filterValue]);

  return (
    <Fragment>
      <div className='w-full relative min-h-[100vh] bg-[#dbd9d2] '>
        <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
          <Header />
          <div className='py-4 flex items-center gap-5 2xl:justify-center w-full overflow-x-auto no-scrollbar mt-5'>
            {options.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilterValue?.(item.name);
                  setSelectedFilter(item.name);
                }}
                className={`  py-2 px-4 h-[30px] cursor-pointer flex items-center justify-center hover:bg-[#5e3f225b] hover:text-white transition-all duration-300 text-nowrap text-sm md:text-base rounded-[4px] ${
                  selectedFilter === item.name
                    ? 'bg-[#5e3f225b] text-white '
                    : 'border border-[#38271c] border-solid'
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
          {loading ? (
            <div className='grow w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-4'>
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
            <div className='w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-4 text-sm'>
              {' '}
              No Products Available
            </div>
          ) : (
            <div className='product_grid w-full min-h-[85vh] md:min-h-full mt-5 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 '>
              {products?.map((item) => (
                <Link
                  href={`product/${item.id}`}
                  key={item.id}
                  className='mb-4 relative'
                >
                  <div className='relative min-h-[400px] lg:min-h-[500px] xl:min-h-[650px] w-[100%] hover:scale-105 transition-all duration-300  '>
                    <Image
                      src={item?.images[0] ?? '/placeholder.png'}
                      alt='product_image'
                      fill
                      className={` min-h-[400px] h-[400px] home_img object-cover shadow-md ${
                        item.sold_out ? 'brightness-50' : ''
                      } `}
                    />
                    {item.sold_out && (
                      <div className='home_img w-[200px] absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center'>
                        <p className=' text-sm text-gray-400 font-medium'>
                          Sold out
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='absolute bottom-0 left-0 right-0 p-4 text-[#3f2a16]'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2 font-light mt-2'>
                      <p className=' text-base uppercase font-semibold'>
                        {item.name}
                      </p>

                      {item.pre_order ? (
                        <p className='text-sm'>[Pre-Order]</p>
                      ) : null}
                    </div>
                    <p className='text-sm md:text-base '>
                      ₦ {Number(item.price).toLocaleString()}
                    </p>
                    <button
                      onClick={() => router.push(`product/${item.id}`)}
                      className='text-sm flex flex-col items-center justify-center mt-3 border border-[#38271c] border-solid rounded-[4px] p-2 h-[30px] hover:bg-[#fafafa56] hover:text-[#3f2a16] text-white transition-all duration-300 cursor-pointer z-[999]'
                    >
                      SELECT
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
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

export default Shop;
