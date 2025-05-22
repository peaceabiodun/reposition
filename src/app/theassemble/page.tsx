'use client';

import ErrorModal from '@/components/error-modal/page';
import SuccessModal from '@/components/success-modal/page';
import { supabase } from '@/lib/supabase';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

type FormDataType = {
  firstName: string;
  email: string;
  phoneNumber: string;
  reverePackage: boolean;
  privePackage: boolean;
  revereQuantity: number;
  priveQuantity: number;
};
const TheAssemble = () => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    email: '',
    phoneNumber: '',
    reverePackage: false,
    privePackage: false,
    revereQuantity: 0,
    priveQuantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaystackError, setShowPaystackError] = useState(false);
  const router = useRouter();

  const handlePackageChange = (
    packageType: 'reverePackage' | 'privePackage'
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [packageType]: !prevData[packageType],
    }));
  };
  const reverePackagePrice = formData.reverePackage
    ? 10000 * (formData.revereQuantity ?? 0)
    : 0;

  const privePackagePrice = formData.privePackage
    ? 30000 * (formData.priveQuantity ?? 0)
    : 0;

  const calculateTotalPrice = (): number => {
    return reverePackagePrice + privePackagePrice;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
    });
  };

  const signUpForTheassemble = async () => {
    const payload = {
      full_name: formData?.firstName,
      email: formData?.email,
      phone_number: formData?.phoneNumber,
      revere_package: formData?.reverePackage,
      prive_package: formData?.privePackage,
      revere_package_qty: formData?.revereQuantity,
      prive_package_qty: formData?.priveQuantity,
    };
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('the-assemble-new')
        .insert(payload);
      if (error !== null) {
        setShowErrorMessage(true);
      } else {
        setShowSuccessMessage(true);
        setFormData({
          firstName: '',
          email: '',
          phoneNumber: '',
          reverePackage: false,
          privePackage: false,
          revereQuantity: 0,
          priveQuantity: 0,
        });
      }
    } catch (err: any) {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: Math.round(calculateTotalPrice() * 100),
    // Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    Currency: 'NGN',
    metadata: {
      payment_type: 'assemble',
      first_name: formData.firstName,
      user_email: formData.email,
      phone_number: formData.phoneNumber,
    },
  } as any;

  const initializePayment: any = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log('Payment successful:', reference);
    if (reference.message === 'Approved') {
      signUpForTheassemble();
    }
  };

  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
  };

  const handlePaystackPayment = () => {
    if (
      !formData.email ||
      calculateTotalPrice() <= 0 ||
      !formData.firstName ||
      !formData.phoneNumber
    ) {
      setShowPaystackError(true);
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      setShowPaystackError(true);
      return;
    }

    initializePayment({ onSuccess, onClose });
  };

  return (
    <div className='min-h-[100vh] bg-[#dbd9d2] the_assemble_bg   '>
      <div className='blur-bg p-4'>
        <header>
          <div className='flex gap-1'>
            <h2 className='font-bold text-sm sm:text-lg '>REPOSITION </h2>
            <Image
              src={'/logo.svg'}
              alt='logo'
              width={30}
              height={30}
              className='object-cover '
            />
          </div>
        </header>

        <section className='text-[#000000] mb-10'>
          <h2 className='text-lg sm:text-2xl font-bold text-center mt-6'>
            THE ASSEMBLE
          </h2>
          <p className='text-sm text-center mt-2 font-medium'>
            MEMBERSHIP FORM
          </p>
          {/* <CountdownTimer /> */}
          <div className='mt-6 flex flex-col m-auto w-full max-w-[1200px] '>
            <div className='flex gap-2'>
              <p className='text-lg'>Personal Information</p>
              <p className='text-red-500'>*</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Full Name</label>
                <input
                  type='text'
                  placeholder='Enter your full name'
                  required
                  value={formData?.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#000000] '
                />
              </div>
              <div className='w-full'>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  required
                  value={formData?.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#000000]'
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Phone Number</label>
                <input
                  type='tel'
                  placeholder='Enter your phone number'
                  value={formData?.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#000000]'
                />
              </div>
            </div>

            <div className='flex gap-2 mt-4'>
              <p className='text-lg'>Package Options</p>
              <p className='text-red-500'>*</p>
            </div>

            <div className='flex gap-4 mt-4 border border-[#3d3e3f] rounded-sm p-2'>
              <input
                type='checkbox'
                checked={formData?.reverePackage}
                onChange={() => handlePackageChange('reverePackage')}
                className='w-5 h-5 bg-transparent accent-black mt-1 cursor-pointer'
              />
              <div>
                <p className='text-lg font-bold'>Respect [10,000pts]</p>
                <ul className='list-disc list-inside'>
                  <li> One house mocktail</li>
                  <li>
                    One-time monthly discounts on coffee/pastries at The
                    Assemble partner venues
                  </li>
                  <li>45mins early access on Reposition collection drops</li>
                  <li>
                    Special codes to redeem discounts on Select Reposition & TOT
                    purchase
                  </li>
                  <li>
                    Access to personalized event content and first-reserve
                    access for next event
                  </li>
                </ul>
                <p className='mt-1 font-bold text-lg'>10,000 NGN</p>
                <div className='flex gap-2 items-center'>
                  <p className='mt-2'>Quantity</p>
                  <input
                    type='number'
                    placeholder='1'
                    value={formData?.revereQuantity ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        revereQuantity: e.target.value
                          ? parseInt(e.target.value)
                          : 0,
                      })
                    }
                    min={0}
                    className='border border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#000000]'
                  />
                </div>
                <p className='mt-2 text-lg'>
                  Total Items: {formatPrice(reverePackagePrice)}
                </p>
              </div>
            </div>

            <div className='flex gap-4 mt-4 border border-[#3d3e3f] rounded-sm p-2'>
              <input
                type='checkbox'
                checked={formData?.privePackage}
                onChange={() => handlePackageChange('privePackage')}
                className='w-5 h-5 bg-transparent accent-black mt-1 cursor-pointer'
              />
              <label>
                <p className='text-lg font-bold'>Private [30,000pts]</p>
                <ul className='list-disc list-inside'>
                  <li>One house mocktail </li>
                  <li>
                    Three-time monthly discount on coffee/pastries at The
                    Assemble partner venues
                  </li>
                  <li>60min early access on Reposition collection drops</li>
                  <li>
                    Special codes to redeem discounts on Reposition & TOT
                    purchase
                  </li>
                  <li>
                    Access to request removal of publicly displayed personal
                    content, or email personalized event content, and
                    first-reserve access for next event
                  </li>
                  <li>Christmas gifting</li>
                  <li className='text-white lg:text-[#000000]'>Brand item exclusive </li>
                  <li className='text-white lg:text-[#000000]'>
                    Exclusive invitation to attend private retreats and jazz
                    events
                  </li>
                  <li className='text-white lg:text-[#000000]'>Request name customization for Reposition purchase</li>
                  <li className='text-white lg:text-[#000000]'>
                    Invitation to support an annual Down-Syndromn outreach
                    initiative
                  </li>
                </ul>
                <p className='mt-1 font-bold text-lg text-white lg:text-[#000000]'>
                  30,000 NGN
                </p>
                <div className='flex gap-2 items-center'>
                  <p className='mt-2 text-white lg:text-[#000000]'>Quantity</p>
                  <input
                    type='number'
                    placeholder='1'
                    value={formData?.priveQuantity ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priveQuantity: e.target.value
                          ? parseInt(e.target.value)
                          : 0,
                      })
                    }
                    min={0}
                    className='border border-white md:border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#000000] text-white lg:text-[#000000]'
                  />
                </div>
                <p className='mt-2 text-lg text-white lg:text-[#000000]'>
                  Total Items: {formatPrice(privePackagePrice)}
                </p>
              </label>
            </div>

            <div className='mt-4 text-lg font-bold text-[#ffffff] lg:text-[#000000]'>
              Total : {formatPrice(calculateTotalPrice())}
            </div>

  
            <div className='mt-4 text-white font-bold'>
              <button
                // onClick={handlePaystackPayment}
                // disabled={!formData.email || calculateTotalPrice() <= 0}
                className='flex gap-2 items-center  cursor-pointer'
              >
                <Image
                  src={'/paystack.png'}
                  alt='paystack'
                  width={30}
                  height={30}
                  className='rounded-md'
                />
                <Image
                  alt='master-card'
                  src={'/master-card-icon.svg'}
                  width={35}
                  height={35}
                />
                <Image
                  alt='visa-card'
                  src={'/visa-icon.svg'}
                  width={35}
                  height={35}
                />

                <Image
                  alt='bank-transfer'
                  src={'/bank-transfer-icon.svg'}
                  width={35}
                  height={35}
                />
              </button>
            </div>
            <p className='mt-2 text-white text-xs'>Transcation fees apply</p>
           
            <button
              disabled={loading}
              onClick={handlePaystackPayment}
              className='border border-[#909192] cursor-pointer bg-[#523f3fab] text-[#e4e0e0] w-full sm:w-[300px] p-2 text-sm mt-6'
            >
              {loading ? 'Loading...' : 'Join'}
            </button>
            {!formData.firstName ||
              !formData.email ||
              (!formData.phoneNumber && (
                <p className='text-red-500 text-xs mt-2 mb-6'>
                  Please fill all required fields
                </p>
              ))}
          </div>
        </section>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='An error occured while trying to confirm your details'
        />
      )}
      {showSuccessMessage && (
        <SuccessModal
          show={showSuccessMessage}
          onClose={() => setShowSuccessMessage(false)}
          title='Your details have been successfully submitted'
          description=" Come In, You're Welcome."
          buttonText='Back to home'
          buttonClick={() => router.push('/')}
        />
      )}
      {showPaystackError && (
        <ErrorModal
          show={showPaystackError}
          onClose={() => setShowPaystackError(false)}
          description='Please input your contact details and select a package'
        />
      )}
    </div>
  );
};

export default TheAssemble;
