'use client';
import Header from '@/components/header/page';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { ProductDetailType } from '@/utils/types';
import { supabase } from '@/lib/supabase';
import { ThreeCircles } from 'react-loader-spinner';
import SuccessModal from '@/components/success-modal/page';
import ErrorModal from '@/components/error-modal/page';
import Slider from 'react-slick';
import { STORAGE_KEYS } from '@/utils/constants';

const ProductDetails = () => {
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetailType>();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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

  const settings = {
    dots: true,
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
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2] overflow-x-scroll '>
      <Header />
      <Link href='/' className='pt-3 gap-1 flex text-sm items-center p-4'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
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
        <div className='py-6 grid grid-cols-1 md:grid-cols-2 p-3 xs:p-4 '>
          <div className='flex items-center justify-center '>
            <Slider
              {...settings}
              className='w-[270px] sm:w-[290px] h-full md:h-[70vh] box bounce-1 '
            >
              {productDetails?.images.map((item, index) => (
                <div key={index}>
                  <Image
                    src={item ? item : '/placeholder.png'}
                    alt='product_image'
                    width='290'
                    height='290'
                    className={`object-cover border border-[#3f2a16] ${
                      productDetails?.sold_out ? 'brightness-50' : ''
                    }`}
                    loading='lazy'
                  />
                  {productDetails?.sold_out && (
                    <span className=' absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center'>
                      <p className=' text-sm text-gray-400 font-medium'>
                        Sold out
                      </p>
                    </span>
                  )}
                </div>
              ))}
            </Slider>
          </div>

          <div className=' mt-5 md:mt-0 flex flex-col items-center text-sm overflow-y-scroll scroll-smooth md:h-[70vh]'>
            <div className='flex flex-col items-center space-y-3 '>
              <h1 className='uppercase font-medium'>{productDetails?.name}</h1>
              <h3 className='font-semibold'>${productDetails?.price}</h3>
              <Accordion
                type='single'
                collapsible
                className='w-[280px] sm:w-[290px] '
              >
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent>
                    {productDetails?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion
                type='single'
                collapsible
                className='w-[270px] sm:w-[290px] '
              >
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
                      down.
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
                          }  shadow-sm p-2 rounded-sm cursor-pointer`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion
                type='single'
                collapsible
                className=' w-[270px] sm:w-[290px] '
              >
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
                          }   shadow-sm p-2 rounded-sm cursor-pointer`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion
                type='single'
                collapsible
                className='w-[270px] sm:w-[290px] '
              >
                <AccordionItem
                  value='product-details'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-normal'>
                    Delivery and Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    All domestic orders are shipped via all local courier
                    partners and all international orders are shipped via DHL.
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
                * Please select a color and Size before you add to bag
              </p>
            )}
            <button
              disabled={disableBtn}
              onClick={addToBag}
              className='text-xs text-[#f0efef] p-2 border bg-[#523f3fab] mt-7 w-[290px] h-[40px] cursor-pointer'
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <SuccessModal
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
          description='You have added a product to your shopping bag'
          buttonText='View shopping bag'
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
