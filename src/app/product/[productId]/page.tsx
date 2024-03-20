'use client';
import Header from '@/components/header/page';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ProductDetails = () => {
  const router = useRouter();
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2] '>
      <Header />
      <Link
        href='/'
        className='pt-3 gap-1 flex text-sm items-center p-3 xs:p-4'
      >
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <div className='py-6 grid grid-cols-1 md:grid-cols-2 p-3 xs:p-4 '>
        <div className='flex items-center justify-center'>
          <Image
            src={'/img1.jpg'}
            alt='product_image'
            width='290'
            height='290'
            className='object-cover'
          />
        </div>

        <div className=' mt-3 md:mt-0 flex flex-col items-center md:justify-center text-sm'>
          <div className='flex flex-col items-center space-y-3  '>
            <h1 className='uppercase font-medium'>Reposition White Jacket</h1>
            <h3 className='font-semibold'>$75</h3>
            <Accordion type='single' collapsible className=' w-[290px]'>
              <AccordionItem
                value='product-details'
                className='border-b-[#a1a1a19c]'
              >
                <AccordionTrigger className=' hover:no-underline font-normal'>
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  white jacket made of cotton and fine fabric with ... There are
                  many variations of passages of Lorem Ipsum available, but the
                  majority have suffered alteration in some form, by injected
                  humour, or randomised words which dont look even slightly
                  believable. If you are going to use a passage of Lorem Ipsum,
                  you need to be sure there isnt anything embarrassing hidden in
                  the middle of text
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type='single' collapsible className=' w-[290px]'>
              <AccordionItem
                value='product-details'
                className='border-b-[#a1a1a19c]'
              >
                <AccordionTrigger className=' hover:no-underline font-normal'>
                  Select Size
                </AccordionTrigger>
                <AccordionContent>
                  Follows standard US mens sizing. If between sizes, size down.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type='single' collapsible className=' w-[290px]'>
              <AccordionItem
                value='product-details'
                className='border-b-[#a1a1a19c]'
              >
                <AccordionTrigger className=' hover:no-underline font-normal'>
                  Delivery and Returns
                </AccordionTrigger>
                <AccordionContent>
                  All domestic orders are shipped via UPS and all international
                  orders are shipped via DHL. Order processing may take up to 7
                  days. An email containing the tracking number will be sent to
                  you when the order ships. All packages are insured and
                  trackable. Please note, our standard delivery & return
                  policies do not apply to made-to-order products or items
                  marked as Final Sale. Shipping surcharges may be applied on
                  orders requiring multiple deliveries. If we anticipate longer
                  delivery times for a specific product, that information will
                  be listed above as well as in checkout and in the order
                  confirmation email. For more information, call 00000000000
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <button
            onClick={() => router.push('/bag')}
            className='text-sm p-1 border border-[#3d3e3f] mt-7 w-[290px] h-[40px]'
          >
            ADD TO BAG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
