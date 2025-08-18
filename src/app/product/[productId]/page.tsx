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
      color_blocks: productDetails?.color_blocks,
      sub_description: productDetails?.sub_description,
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
    <div className='w-full h-full min-h-[100vh] bg-[#C4BAAF] pb-12'>
      <Header />
      <div className=' w-full  p-4 mb-4 max-w-[1700px] mx-auto'>
        <div
          onClick={() => router.back()}
          className=' gap-1 flex text-sm items-center '
        >
          <MdOutlineArrowBackIosNew size={20} />
          Back
        </div>
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
              className='flex overflow-x-auto scroll-smooth w-full snap-x snap-mandatory no-scrollbar shadow-xl relative rounded-lg'
            >
              {productDetails?.images.map((item, index) => (
                <div
                  key={index}
                  className='carousel-item w-[100vw] md:w-[50vw] h-[95vh] flex-shrink-0 snap-center cursor-pointer rounded-lg '
                  data-index={index}
                >
                  <img
                    src={item ? item : '/placeholder.png'}
                    alt='product_image'
                    className={` object-cover w-[99.5%] h-[95vh] object-center transition-all duration-300 rounded-lg shadow-xl ${
                      productDetails?.sold_out ? 'brightness-50' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className='flex items-center justify-between text-[#3f2a1659] absolute md:top-1/2 -translate-y-1/2 left-0 right-0 w-[100vw] md:w-[50vw] px-6 '>
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
                  className={`w-8 h-1 ${
                    currentIndex === index ? 'bg-[#c7bbb0]' : 'bg-[#523f3fab] '
                  }`}
                />
              ))}
            </div>
          </div>

          <div className=' mt-5 md:mt-0 flex flex-col items-center text-sm overflow-y-scroll scroll-smooth scrollable-div md:h-[80vh] px-8 '>
            <div className='flex flex-col space-y-4 w-full max-w-[600px]'>
              <div>
                <h2 className='uppercase font-medium text-lg'>
                  {productDetails?.name}
                </h2>
                <p className='text-[11px] uppercase mt-[1px]'>
                  {productDetails?.sub_description}
                </p>
                <div className='flex items-center gap-1'>
                  {productDetails?.color_blocks?.map((color, index) => (
                    <div
                      key={index}
                      className='w-3 h-3 rounded-[2px]'
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <h3 className='font-semibold mt-1'>
                  ₦ {Number(productDetails?.price).toLocaleString()}
                </h3>
              </div>

              <div>
                <p className='text-sm mb-2 font-semibold'>Color</p>
                <div className='flex flex-wrap gap-2'>
                  {productDetails?.colors.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(item)}
                      className={`${
                        selectedColor === item
                          ? ' bg-[#38271c] text-white'
                          : 'border border-[#38271c] text-[#38271c]'
                      }   shadow-sm py-2 px-4  cursor-pointer hover:bg-[#38271c] hover:text-white transition-all duration-300 rounded-[4px] `}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className='text-sm mb-2 font-semibold'>Size</p>
                <div className='flex flex-wrap gap-2'>
                  {productDetails?.sizes.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedSize(item)}
                      className={`${
                        selectedSize === item
                          ? ' bg-[#38271c] text-white'
                          : 'border border-[#38271c] text-[#38271c]'
                      }  shadow-sm py-2 px-4 cursor-pointer hover:bg-[#38271c] hover:text-white transition-all duration-300 rounded-[4px]`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <p
                  onClick={() => router.push('/size-chart')}
                  className='text-xs mt-2 underline underline-offset-2 cursor-pointer font-medium'
                >
                  Open size chart
                </p>
              </div>
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
                  <AccordionTrigger className=' hover:no-underline font-semibold'>
                    Creator&apos;s Note
                  </AccordionTrigger>
                  <AccordionContent className='text-sm font-medium'>
                    <ul className='flex flex-col gap-2'>
                      {productDetails?.product_details?.map((item, index) => (
                        <li key={index} className='list-disc list-inside'>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {/* {productDetails?.description} */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='shipping-delivery'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-semibold'>
                    Shipping and Delivery
                  </AccordionTrigger>
                  <AccordionContent>
                    Reposition wants to guarantee professional handling of your
                    purchase. So we ship via DHL for all our international
                    orders. <br />
                    <br />
                    Domestic shipping will be handled by reliable last-mile
                    delivery partners.
                    <br /> Order processing may take up to 7 days. You will
                    receive a delivery email from our verified email containing
                    your tracking number when your order is shipped.
                    <br /> <br /> Your package will be trackable in real time.
                    <br />
                    Please kindly note, our standard delivery & return policies
                    do not apply to made-to-order products or items marked as
                    Final Sale.
                    <br />
                    <br /> You may be required to pay duties at point of
                    collection depending on your country’s policy where you are
                    residence.
                    <br />
                    <br /> Shipping subcharges may be applied on orders
                    requiring multiple deliveries. If we anticipate longer
                    delivery times for a specific product, we will notify you in
                    good time via email.
                    <br />
                    <br /> For more information,
                    <br /> email:
                    <a
                      href='mailto:welcome@re-position.co'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-800 underline ml-1'
                    >
                      welcome@re-position.co
                    </a>{' '}
                    <br />
                    <br />
                    For orders above $950 delivery is free for US, UK and Canada
                    for Assemble Members.
                    <br /> For orders above $450 within West Africa, delivery is
                    also free for Assemble Members.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='exchange-policy'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-semibold'>
                    Exchange Policy
                  </AccordionTrigger>

                  <AccordionContent className='text-sm'>
                    Reposition is committed to delivering exceptional tailored
                    experience, we do this by ensuring you’re completely
                    satisfied with your purchase.
                    <br /> We are aware that sometimes an exchange may be
                    necessary, and we’re here to make the process smooth for
                    you. <br /> <br />
                    <p className='font-medium'>1. Eligibility</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Items should be returned within 14 days of delivery.
                      </li>
                      <li>
                        Products should be new, unworn, unwashed, and in their
                        original condition with all tags and packaging intact.
                      </li>
                      <li>
                        Items showing signs of wear, damage, or missing tags are
                        not eligible.
                      </li>
                      <li>Final Sale items cannot be exchanged.</li>
                    </ul>
                    <p className='font-medium mt-2'>2. How to Exchange</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Email customer relations team at
                        <a
                          href='mailto:welcome@re-position.co'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-800 underline mx-1'
                        >
                          welcome@re-position.co
                        </a>
                        with your order number and details of the item you wish
                        to exchange.
                      </li>
                      <li>
                        Approval & Instructions – Once approved, you’ll receive
                        return instructions. Please pack items securely to
                        prevent damage in transit.
                      </li>
                      <li>
                        Shipping Costs – Return shipping will be covered by the
                        customer, except if the item is incorrect or defective
                        upon arrival.
                      </li>
                      <li>
                        Quality Check – Once received, our Quality Control team
                        will inspect your item. If approved, we’ll dispatch your
                        exchange within 5–7 business days. Items failing
                        inspection will be returned to you.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>3. Size or Style Changes</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        To request a different size or style, kindly specify
                        your preference in your exchange request.
                      </li>
                      <li>
                        Size or Style availability will be confirmed before
                        finalizing the exchange.
                      </li>
                      <li>
                        If the requested item is unavailable, we’ll offer
                        alternatives or a refund.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>
                      4. International Exchanges
                    </p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Additional shipping fees and longer delivery times may
                        apply.
                      </li>
                      <li>
                        Any applicable customs duties are the customer’s
                        responsibility.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type='single' collapsible className='w-full '>
                <AccordionItem
                  value='return-policy'
                  className='border-b-[#a1a1a19c]'
                >
                  <AccordionTrigger className=' hover:no-underline font-semibold'>
                    Return Policy
                  </AccordionTrigger>

                  <AccordionContent className='text-sm'>
                    We want you to be at ease, therefore we are by our phones
                    just incase you need help, even when you make a mistake with
                    your purchase.
                    <br /> <br />
                    <p className='font-medium'>1. Refund Eligibility</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Items must meet our return standards and pass inspection
                        to qualify for a refund.
                      </li>
                      <li>
                        Refunds are issued to the original payment method.
                      </li>
                      <li>
                        Items that don’t meet the conditions will be returned to
                        you.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>
                      2. How Refunds Are Processed
                    </p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Inspection – Once we receive your item, our Quality
                        Control team will verify its condition.
                      </li>
                      <li>
                        Timeline – Approved refunds are processed within 5–7
                        business days; banks may take an additional 7–10 days to
                        post funds.
                      </li>
                      <li>
                        You’ll receive a confirmation email once your refund is
                        issued.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>3. Non-Refundable Items</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>Shipping fees, customs duties, and local taxes.</li>
                      <li>
                        Gift cards, Final Sale items, and personalized products.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>
                      4. Faulty or Incorrect Items
                    </p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Notify us within 48 hours at
                        <a
                          href='mailto:welcome@re-position.co'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-800 underline mx-1'
                        >
                          welcome@re-position.co
                        </a>
                        with photos and details.
                      </li>
                      <li>
                        Approved cases receive a full refund, including original
                        shipping costs.
                      </li>
                    </ul>
                    <p className='font-medium mt-2'>5. Cancellations</p>
                    <ul className='list-disc list-inside mt-1 space-y-1 ml-3'>
                      <li>
                        Orders can be canceled within 24 hours for a full
                        refund.
                      </li>
                    </ul>
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
              className='text-xs text-[#f0efef] p-2 bg-[#38271c] mt-7 w-[290px] h-[40px] cursor-pointer hover:scale-105 transition-all duration-300 rounded-[4px]'
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
          description={`You have added ${productDetails?.name} to your Bag`}
          buttonText='View Bag'
          buttonClick={() => router.push('/bag')}
          title='Product Added'
        />
      )}

      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description='Please check your connection or this item is already in your Bag.'
        />
      )}
    </div>
  );
};

export default ProductDetails;
