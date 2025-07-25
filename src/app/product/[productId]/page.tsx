/* eslint-disable @next/next/no-img-element */
'use client';
import Header from '@/components/header/page';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect, useRef, useState } from 'react';
import { ProductDetailType } from '@/utils/types';
import { supabase } from '@/lib/supabase';
import { ThreeCircles } from 'react-loader-spinner';
import SuccessModal from '@/components/success-modal/page';
import ErrorModal from '@/components/error-modal/page';
import { STORAGE_KEYS } from '@/utils/constants';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';

const ProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetailType>();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const disableBtn = !selectedSize || !selectedColor;
  // const userEmail =
  //   typeof window !== 'undefined'
  //     ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
  //     : '';

  // const userId =
  //   typeof window !== 'undefined'
  //     ? localStorage.getItem(STORAGE_KEYS.USER_ID)
  //     : '';

  const getProductDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.productId)
        .single();
      setProductDetails(data);
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
    getProductDetails();
  }, [params.productId]);

  // const addToBag = async () => {
  //   const payload = {
  //     id: productDetails?.id,
  //     name: productDetails?.name,
  //     price: productDetails?.price,
  //     image: productDetails?.images[0],
  //     color: selectedColor,
  //     size: selectedSize,
  //     weight: productDetails?.weight,
  //   };
  //   setAddToBagLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from('shopping-bag')
  //       .insert(payload);
  //     if (error !== null) {
  //       setShowErrorModal(true);
  //     } else {
  //       setShowSuccessMessage(true);
  //     }
  //   } catch {
  //     setShowErrorModal(true);
  //   } finally {
  //     setAddToBagLoading(false);
  //   }
  // };

  const addToBag = () => {
    if (productDetails?.sold_out) return;
    const payload = {
      id: productDetails?.id,
      name: productDetails?.name,
      price: productDetails?.price,
      image: productDetails?.images[0],
      color: selectedColor,
      size: selectedSize,
      weight: productDetails?.weight,
    };
    const existingBagItemsJSON = localStorage.getItem(STORAGE_KEYS.BAG_ITEMS);
    let existingBagItems = [];
    if (existingBagItemsJSON) {
      existingBagItems = JSON.parse(existingBagItemsJSON);
    }
    existingBagItems.push(payload);
    const updatedBagItemsJSON = JSON.stringify(existingBagItems);
    localStorage.setItem(STORAGE_KEYS.BAG_ITEMS, updatedBagItemsJSON);
    setShowSuccessMessage(true);
  };

  useEffect(() => {
    if (!productDetails) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-index') || '0',
              10
            );
            setCurrentIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const carouselItems =
      carouselRef.current?.querySelectorAll('.carousel-item');
    carouselItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [productDetails]);

  const handleNext = () => {
    if (!productDetails) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % productDetails.images.length
    );
  };

  const handlePrev = () => {
    if (!productDetails) return;
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + productDetails.images.length) %
        productDetails.images.length
    );
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentIndex * carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2] pb-12'>
      <Header />
      <div className='flex w-full justify-between gap-4 p-4 mb-4 max-w-[1700px] mx-auto'>
        <Link href='/' className=' gap-1 flex text-sm items-center '>
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </Link>
        <Link href='/size-chart' className='text-sm border p-2 border-black'>
          Size Chart
        </Link>
      </div>
      {loading ? (
        <div className='grow w-full flex justify-center items-center p-4'>
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
        <div className=' grid grid-cols-1 md:grid-cols-2 p-3 xs:p-4 '>
          <div className='flex flex-col items-center justify-center w-full '>
            <div
              ref={carouselRef}
              className='flex overflow-x-auto scroll-smooth w-full snap-x snap-mandatory no-scrollbar shadow-md relative'
            >
              {productDetails?.images.map((item, index) => (
                <div
                  key={index}
                  className='carousel-item w-[100vw] md:w-[50vw] h-[95vh] flex-shrink-0 snap-center cursor-pointer'
                  data-index={index}
                >
                  <img
                    src={item ? item : '/placeholder.png'}
                    alt='product_image'
                    className={` object-cover w-[99.5%] h-[95vh] object-center transition-all duration-300 ${
                      productDetails?.sold_out ? 'brightness-50' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className='flex items-center justify-between text-[#3f2a16b6] absolute md:top-1/2 -translate-y-1/2 left-0 right-0 w-[100vw] md:w-[50vw] px-6 '>
              <IoIosArrowDropleftCircle
                size={25}
                className='cursor-pointer'
                onClick={handlePrev}
              />
              <IoIosArrowDroprightCircle
                size={25}
                className='cursor-pointer'
                onClick={handleNext}
              />
            </div>
            <div className='transform flex mt-4 justify-center items-center w-full'>
              {productDetails?.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-8 h-3 ${
                    currentIndex === index ? 'bg-[#c7bbb0]' : 'bg-[#523f3fab] '
                  }`}
                />
              ))}
            </div>
          </div>

          <div className=' mt-5 md:mt-0 flex flex-col items-center text-sm overflow-y-scroll scroll-smooth md:h-[80vh] px-8 '>
            <div className='flex flex-col items-center space-y-3 w-full max-w-[600px]'>
              <h1 className='uppercase font-medium text-lg'>
                {productDetails?.name}
              </h1>
              <h3 className='font-semibold'>
                ₦ {Number(productDetails?.price).toLocaleString()}
              </h3>
              <Accordion
                type='single'
                collapsible
                defaultValue='product-details'
                className='w-full '
              >
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c] w-full'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent className='text-base font-semibold'>
                    <div className='flex flex-col gap-2'>
                      {productDetails?.product_details?.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </div>
                    {/* {productDetails?.description} */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Select Size
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col space-y-4'>
                    <div>
                      Follows standard US mens sizing. If between sizes, size
                      down. We have a size chart available at the top of the
                      page for reference.
                    </div>
                    <div className='flex flex-col gap-2'>
                      {productDetails?.sizes.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedSize(item)}
                          className={`${
                            selectedSize === item
                              ? ' bg-[#523f3f79]'
                              : 'bg-[#c7c5c5a1]'
                          }  shadow-sm py-2 px-4 rounded-sm cursor-pointer hover:bg-[#523f3f79]`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Select Colors
                  </AccordionTrigger>
                  <AccordionContent className='flex flex-col space-y-4'>
                    <div>
                      These are the available colors for this product. Please
                      reach out to us if you want a customized color.
                    </div>
                    <div className='flex flex-col gap-2'>
                      {productDetails?.colors.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedColor(item)}
                          className={`${
                            selectedColor === item
                              ? ' bg-[#523f3f79]'
                              : 'bg-[#c7c5c5a1]'
                          }   shadow-sm py-2 px-4 rounded-sm cursor-pointer hover:bg-[#523f3f79]`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Delivery and Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    All domestic and international orders are shipped via DHL.
                    Order processing may take up to 7 days. An email containing
                    the tracking number will be sent to you when the order
                    ships. All packages are trackable. Please note, our standard
                    delivery & return policies do not apply to made-to-order
                    products or items marked as Final Sale. You may be required
                    to pay duties at point of collection depending on your
                    country of residence policy. Shipping subcharges may be
                    applied on orders requiring multiple deliveries. If we
                    anticipate longer delivery times for a specific product,
                    that information will be listed above as well as in checkout
                    and in the order confirmation email. For more information,
                    email:
                    <a
                      href='mailto:nowreposition@gmail.com'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-800 underline'
                    >
                      nowreposition@gmail.com
                    </a>{' '}
                    or{' '}
                    <a
                      href='mailto:help@re-position.co'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-800 underline'
                    >
                      help@re-position.co
                    </a>
                    <div className='my-2 text-sm'>
                      For orders above $600 delivery is free for US, UK and
                      Canada.{' '}
                    </div>
                    <div className=' text-sm '>
                      For orders above $300 within Nigeria, delivery is also
                      free.{' '}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {disableBtn && (
              <p className='text-xs text-red-500 mt-2'>
                * Please select a color and Size before you add to cart
              </p>
            )}
            <button
              disabled={disableBtn}
              onClick={addToBag}
              className='text-xs text-[#f0efef] p-2 border bg-[#523f3fab] mt-7 w-[290px] h-[40px] cursor-pointer hover:scale-105 transition-all duration-300'
            >
              ADD TO CART
            </button>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <SuccessModal
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
          description={`You have added ${productDetails?.name} to your shopping cart`}
          buttonText='View Cart'
          buttonClick={() => router.push('/bag')}
          title='Product Added'
        />
      )}

      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description='Please check your connection or this item is already in your shopping bag.'
        />
      )}
    </div>
  );
};

export default ProductDetails;
