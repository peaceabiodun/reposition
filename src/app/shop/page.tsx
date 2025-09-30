'use client';

import { useProductContext } from '@/context/product-context';
import { useCurrency } from '@/context/currency-context';
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
import Marquee from 'react-fast-marquee';
import { GoDotFill } from 'react-icons/go';
import { isWestAfricanCountry } from '@/utils/helpers';

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useProductContext();
  const { userCountry } = useCurrency();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );

  // Check if user is from West Africa
  const isFromWestAfrica = isWestAfricanCountry(userCountry);

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
      <div className='w-full relative min-h-[100vh] bg-[#eee1d3] '>
        <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
          <Header />
        </div>

        <div
          onClick={() => router.push('/assemble')}
          className='w-full h-[36px] p-2 bg-[#c2a18b4b] my-4 cursor-pointer'
        >
          <Marquee speed={100}>
            {isFromWestAfrica ? (
              // Marquee for West African users (including Nigeria)
              <div className='flex items-center text-xs sm:text-sm gap-2'>
                <p className='mx-2'>Join Assemble </p>
                <GoDotFill size={10} />
                <p className='mx-2'>
                  Get exclusive access to local events and early product drops
                </p>
                <GoDotFill size={10} />
                <p className='mx-2'>
                  {' '}
                  Members in west africa to enjoy free delivery for orders above
                  950,000 Naira
                </p>
              </div>
            ) : (
              // Marquee for international users (outside West Africa)
              <div className='flex items-center text-xs sm:text-sm gap-2'>
                <p className='mx-2'>Join Assemble </p>
                <GoDotFill size={10} />
                <p className='mx-2'>
                  Members in US, UK and Canada to enjoy free delivery for orders
                  above $950
                </p>
              </div>
            )}
          </Marquee>
        </div>
        <div className='max-w-[1700px] mx-auto px-4 md:px-8'>
          <div className='py-4 flex items-center gap-5 2xl:justify-center w-full overflow-x-auto no-scrollbar mt-5'>
            {options.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilterValue?.(item.name);
                  setSelectedFilter(item.name);
                }}
                className={`  py-2 px-4 h-[30px] cursor-pointer flex items-center justify-center hover:bg-[#38271c] hover:text-white transition-all duration-300 text-nowrap text-sm rounded-[4px] shadow-md ${
                  selectedFilter === item.name
                    ? 'bg-[#38271c] text-white '
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
                color='#5e3f225b'
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
            <div className='product_grid w-full min-h-[85vh] md:min-h-full mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 '>
              {products?.map((item) => (
                <Link
                  href={`product/${item.id}`}
                  key={item.id}
                  className='mb-6 relative group'
                >
                  <div className='relative min-h-[400px] lg:min-h-[500px] xl:min-h-[650px] w-[100%] shadow-md rounded-lg '>
                    <Image
                      src={item?.images?.[0] ?? '/placeholder.png'}
                      alt='product_image'
                      fill
                      className={` min-h-[400px] h-[400px] home_img object-cover shadow-md rounded-lg transition-opacity duration-300 ${
                        item.sold_out ? 'brightness-50' : ''
                      } group-hover:opacity-0`}
                    />
                    <Image
                      src={
                        item?.images?.[1] ??
                        item?.images?.[0] ??
                        '/placeholder.png'
                      }
                      alt='product_image_hover'
                      fill
                      className={` min-h-[400px] h-[400px] home_img object-cover shadow-md rounded-lg transition-opacity duration-300 opacity-0 ${
                        item.sold_out ? 'brightness-50' : ''
                      } group-hover:opacity-100`}
                    />
                    {item.sold_out && (
                      <div className='home_img w-[200px] absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center'>
                        <p className=' text-sm text-gray-400 font-medium'>
                          Sold out
                        </p>
                      </div>
                    )}
                    {item.pre_order && (
                      <p className='text-xs absolute top-3 right-3 text-[#3f2a16] font-medium'>
                        [Pre-Order]
                      </p>
                    )}
                  </div>

                  <div className=' text-[#3f2a16]'>
                    <div className=' mt-2'>
                      <p className=' text-sm uppercase font-semibold'>
                        {item?.name}
                      </p>

                      <p className='text-[11px] uppercase mt-[1px]'>
                        {item?.sub_description}
                      </p>
                      <div className='flex items-center gap-1'>
                        {item?.color_blocks?.map((color, index) => (
                          <div
                            key={index}
                            className='w-3 h-3 rounded-[2px]'
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* <p className='text-sm  '>
                      ₦ {Number(item.price).toLocaleString()}
                    </p> */}
                    <button
                      onClick={() => router.push(`product/${item?.id}`)}
                      className='text-xs flex flex-col items-center justify-center mt-2 border border-[#38271c] border-solid rounded-[4px] p-2 h-[30px] hover:bg-[#fafafa56] text-[#3f2a16] transition-all duration-300 cursor-pointer z-[999]'
                    >
                      SELECT
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Footer />
        </div>
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
