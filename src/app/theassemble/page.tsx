'use client';

import ErrorModal from '@/components/error-modal/page';
import { FileUploader } from '@/components/file-uploader/page';
import SuccessModal from '@/components/success-modal/page';
import { supabase } from '@/lib/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';
import { ConversionRateType } from '@/utils/types';
import { usePaystackPayment } from 'react-paystack';

type FormDataType = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  birthDate: string;
  sex: string;
  phoneNumber: string;
  maleSize: string;
  femaleSize: string;
  basic1MealADayPlan: string[];
  address: string;
  city: string;
  state: string;
  validId: string[];
  instagramLink: string;
  twitterLink: string;
  snapchatLink: string;
  allergies: string;
  specialNeeds: string;
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactRelationship: string;
  emergencyContactPhoneNumber: string;
  royalAssemblePackage: boolean;
  palacePackage: boolean;
  royalAssembleQuantity: number;
  palaceQuantity: number;
  receiptScreenshot: string[];
};
const TheAssemble = () => {
  const exchangeRateApiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_KEY;
  const [Currencies, setCurrencies] = useState<ConversionRateType>();
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    nickName: '',
    email: '',
    birthDate: '',
    sex: '',
    phoneNumber: '',
    maleSize: '',
    femaleSize: '',
    basic1MealADayPlan: [],
    address: '',
    city: '',
    state: '',
    validId: [],
    instagramLink: '',
    twitterLink: '',
    snapchatLink: '',
    allergies: '',
    specialNeeds: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactRelationship: '',
    emergencyContactPhoneNumber: '',
    royalAssemblePackage: false,
    palacePackage: false,
    royalAssembleQuantity: 0,
    palaceQuantity: 0,
    receiptScreenshot: [],
  });
  const [loading, setLoading] = useState(false);
  const [showMaleSizeDropdown, setShowMaleSizeDropdown] = useState(false);
  const [showFemaleSizeDropdown, setShowFemaleSizeDropdown] = useState(false);
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const [selectedMaleSize, setSelectedMaleSize] = useState('');
  const [selectedFemaleSize, setSelectedFemaleSize] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['FRESH JUICE']);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaystackSuccess, setShowPaystackSuccess] = useState(false);
  const [showPaystackError, setShowPaystackError] = useState(false);
  const router = useRouter();
  const [maxDate, setMaxDate] = useState('');
  const maleSizeOptions = ['M', 'L', 'XL', 'XXL', 'XXXL'];
  const femaleSizeOptions = ['6', '8', '10', '12', '14', '16'];
  const mealOptions = [
    'TUNA PASTA SALAD ',
    'SMOKED SALMON SALAD ',
    'JOLLOF RICE & FISH/CHICKEN ',
    'FRESH JUICE ',
    'SMOKED BEEF SALAD',
  ];

  const isFormValid = () => {
    const requiredFields: (keyof FormDataType)[] = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'city',
      'address',
      'validId',
      'emergencyContactFirstName',
      'emergencyContactLastName',
      'emergencyContactRelationship',
      'emergencyContactPhoneNumber',
      'receiptScreenshot',
    ];

    return (
      requiredFields.every((field) => {
        const value = formData[field];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return typeof value === 'string' && value !== '';
      }) &&
      (formData.royalAssemblePackage || formData.palacePackage)
    );
  };

  const toggleMealSelection = (meal: string) => {
    setSelectedMeals((prevMeals) => {
      if (meal === 'FRESH JUICE ') return prevMeals;
      if (prevMeals.includes(meal)) {
        return prevMeals.filter((m) => m !== meal);
      } else if (prevMeals.length < 3) {
        return [...prevMeals, meal];
      }
      return prevMeals;
    });
  };
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMaxDate(`${year}-${month}-${day}`);
  }, []);

  const handlePackageChange = (
    packageType: 'royalAssemblePackage' | 'palacePackage'
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [packageType]: !prevData[packageType],
    }));
  };
  const royalAssemblePrice = formData.royalAssemblePackage
    ? 350000 * (formData.royalAssembleQuantity ?? 0)
    : 0;

  const palacePackagePrice = formData.palacePackage
    ? 600000 * (formData.palaceQuantity ?? 0)
    : 0;

  const calculateTotalPrice = (): number => {
    const royalAssemblePrice = formData.royalAssemblePackage
      ? 350000 * (formData.royalAssembleQuantity ?? 0)
      : 0;
    const palacePackagePrice = formData.palacePackage
      ? 600000 * (formData.palaceQuantity ?? 0)
      : 0;
    return royalAssemblePrice + palacePackagePrice;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-NG', {
      style: 'currency',
      currency: 'NGN',
    });
  };

  const signUpForTheassemble = async () => {
    const payload = {
      first_name: formData?.firstName,
      last_name: formData?.lastName,
      nick_name: formData?.nickName,
      email: formData?.email,
      birthDate: formData?.birthDate,
      sex: formData?.sex,
      phoneNumber: formData?.phoneNumber,
      maleSize: selectedMaleSize,
      femaleSize: selectedFemaleSize,
      basic1MealADayPlan: selectedMeals,
      address: formData?.address,
      city: formData?.city,
      state: formData?.state,
      validId: formData?.validId,
      instagramLink: formData?.instagramLink,
      twitterLink: formData?.twitterLink,
      snapchatLink: formData?.snapchatLink,
      allergies: formData?.allergies,
      specialNeeds: formData?.specialNeeds,
      emergencyContactFirstName: formData?.emergencyContactFirstName,
      emergencyContactLastName: formData?.emergencyContactLastName,
      emergencyContactRelationship: formData?.emergencyContactRelationship,
      emergencyContactPhoneNumber: formData?.emergencyContactPhoneNumber,
      royalAssemblePackage: formData?.royalAssemblePackage,
      palacePackage: formData?.palacePackage,
      royalAssembleQuantity: formData?.royalAssembleQuantity,
      palaceQuantity: formData?.palaceQuantity,
      receiptScreenshot: formData?.receiptScreenshot,
    };
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('the-assemble')
        .insert(payload);
      if (error !== null) {
        setShowErrorMessage(true);
      } else {
        setShowSuccessMessage(true);
        setFormData({
          firstName: '',
          lastName: '',
          nickName: '',
          email: '',
          birthDate: '',
          sex: '',
          phoneNumber: '',
          maleSize: '',
          femaleSize: '',
          basic1MealADayPlan: [],
          address: '',
          city: '',
          state: '',
          validId: [],
          instagramLink: '',
          twitterLink: '',
          snapchatLink: '',
          allergies: '',
          specialNeeds: '',
          emergencyContactFirstName: '',
          emergencyContactLastName: '',
          emergencyContactRelationship: '',
          emergencyContactPhoneNumber: '',
          royalAssemblePackage: false,
          palacePackage: false,
          royalAssembleQuantity: 0,
          palaceQuantity: 0,
          receiptScreenshot: [],
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
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_email: formData.email,
      phone_number: formData.phoneNumber,
      address: formData.address,
    },
  } as any;

  const initializePayment: any = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.

    if (reference.message === 'Approved') {
      setShowPaystackSuccess(true);
    }
  };

  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
  };

  const handlePaystackPayment = () => {
    if (!formData.email || calculateTotalPrice() <= 0) {
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
    <div className='min-h-[100vh] bg-[#dbd9d2] the_assemble_bg font-light  '>
      <div className='blur-bg p-4'>
        <header>
          <div className='flex gap-1'>
            <h2 className='font-bold text-sm sm:text-lg '>REPOSITION </h2>
            <Image
              src={'/logo.svg'}
              alt='logo'
              width={30}
              height={30}
              className='object-cover'
            />
          </div>
        </header>

        <section className='text-[#311b07]'>
          <h2 className='text-lg sm:text-2xl font-light text-center mt-6'>
            THE ASSEMBLE
          </h2>
          <p className='text-sm text-center mt-2'>REGISTRATION FORM</p>

          <div className='mt-6 flex flex-col m-auto w-full max-w-[1200px] '>
            <div className='flex gap-2'>
              <p className='text-lg'>Personal Information</p>
              <p className='text-red-500'>*</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>First Name</label>
                <input
                  type='text'
                  placeholder='E.g Walter'
                  required
                  value={formData?.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f] '
                />
              </div>
              <div className='w-full'>
                <label>Last Name</label>
                <input
                  type='text'
                  placeholder='E.g Onyeka'
                  required
                  value={formData?.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className='border  border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f] '
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Nick Name</label>
                <input
                  type='text'
                  placeholder='E.g Top G'
                  value={formData?.nickName}
                  onChange={(e) =>
                    setFormData({ ...formData, nickName: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
              <div className='w-full'>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='E.g topg@gmail.com'
                  required
                  value={formData?.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label className=''>Birth Date</label>
                <input
                  type='date'
                  placeholder='please select'
                  value={formData?.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  max={maxDate}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
              <div className='w-full '>
                <label>Sex</label>

                <div className='flex gap-4 mt-4'>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 bg-transparent accent-black mt-1'
                      checked={formData?.sex === 'Male'}
                      onChange={() => setFormData({ ...formData, sex: 'Male' })}
                    />
                    <p>Male</p>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 bg-transparent accent-black mt-1'
                      checked={formData?.sex === 'Female'}
                      onChange={() =>
                        setFormData({ ...formData, sex: 'Female' })
                      }
                    />
                    <p>Female</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full mt-4'>
              <label>Phone Number</label>
              <input
                type='tel'
                placeholder='E.g 08012345678'
                value={formData?.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
              />
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full relative'>
                <label>Male Sizes</label>
                <div
                  onClick={() => setShowMaleSizeDropdown(!showMaleSizeDropdown)}
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 flex justify-between items-center gap-4 cursor-pointer'
                >
                  <p className='text-sm'>
                    {selectedMaleSize
                      ? selectedMaleSize
                      : 'Please select an appropriate size'}
                  </p>
                  <MdOutlineKeyboardArrowDown
                    size={18}
                    className='text-[#3d3e3f] '
                  />
                </div>
                <p className='text-xs text-[#50210b] mt-1'>
                  Note: This selection is for items included in the Reposition
                  care package
                </p>

                {showMaleSizeDropdown && (
                  <div className='bg-[#f1e4d5] rounded-sm p-2 absolute shadow-md text-sm flex flex-col gap-2 z-50 w-[200px]'>
                    {maleSizeOptions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedMaleSize(item);
                          setShowMaleSizeDropdown(false);
                        }}
                        className='py-1 px-2 cursor-pointer hover:bg-[#b4afa4] rounded-sm'
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='w-full relative'>
                <label>Female Sizes</label>
                <div
                  onClick={() =>
                    setShowFemaleSizeDropdown(!showFemaleSizeDropdown)
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 flex justify-between items-center gap-4 cursor-pointer'
                >
                  <p className='text-sm'>
                    {selectedFemaleSize
                      ? selectedFemaleSize
                      : 'Please select an appropriate size'}
                  </p>
                  <MdOutlineKeyboardArrowDown
                    size={18}
                    className='text-[#3d3e3f] '
                  />
                </div>
                <p className='text-xs text-[#50210b] mt-1'>
                  Note: This selection is for items included in the Reposition
                  care package
                </p>

                {showFemaleSizeDropdown && (
                  <div className='bg-[#f1e4d5] rounded-sm p-2 absolute shadow-md text-sm flex flex-col gap-2 z-50 w-[200px]'>
                    {femaleSizeOptions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedFemaleSize(item);
                          setShowFemaleSizeDropdown(false);
                        }}
                        className='py-1 px-2 cursor-pointer hover:bg-[#b4afa4] rounded-sm'
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='w-full relative mt-4'>
              <label>Basic 1-Meal-A-Day Plan</label>
              <div
                onClick={() => setShowMealDropdown(!showMealDropdown)}
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 flex justify-between items-center gap-4 cursor-pointer'
              >
                <p className='text-sm'>
                  {selectedMeals.length > 0
                    ? selectedMeals.join(', ')
                    : 'Please select two meals'}
                </p>
                <MdOutlineKeyboardArrowDown
                  size={18}
                  className='text-[#3d3e3f] '
                />
              </div>
              <p className='text-xs text-[#50210b] mt-1'>
                Note: Fresh juice is compulsory. Please select any two other
                meals. [This selection is for 1-Meal-A-Day Plan to help us
                prepare better]
              </p>

              {showMealDropdown && (
                <div className='bg-[#f1e4d5] rounded-sm p-2 absolute shadow-md text-sm flex flex-col gap-2 z-50 w-full'>
                  {mealOptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => toggleMealSelection(item)}
                      className='py-1 px-2 cursor-pointer hover:bg-[#b4afa4] rounded-sm'
                    >
                      <input
                        type='checkbox'
                        checked={selectedMeals.includes(item)}
                        onChange={() => {}}
                        disabled={item === 'FRESH JUICE '}
                        className='mr-2 accent-black mt-2'
                      />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='flex gap-2 mt-4'>
              <p className='text-lg'>Address</p>
              <p className='text-red-500'>*</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Street Address</label>
                <input
                  type='text'
                  placeholder='E.g 123, Main Street'
                  value={formData?.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f] '
                />
              </div>
              <div className='flex gap-4 w-full'>
                <div className='w-full'>
                  <label>City</label>
                  <input
                    type='text'
                    placeholder='E.g Abuja'
                    required
                    value={formData?.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                  />
                </div>
                <div className='w-full'>
                  <label>State</label>
                  <input
                    type='text'
                    placeholder='E.g FCT'
                    required
                    value={formData?.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                  />
                </div>
              </div>
            </div>
            <div className='w-full mt-4'>
              <label>
                Upload a recent valid ID (NIN, Driver&apos;s License, Int.
                Passport)
              </label>

              <FileUploader
                fileUrls={formData?.validId}
                setFileUrls={(img) =>
                  setFormData({ ...formData, validId: img })
                }
                className=''
                fileType='image'
              />
            </div>

            <div className='w-full mt-4'>
              <label>Social Media Links</label>
            </div>
            <div className='w-full flex flex-col sm:flex-row gap-4'>
              <input
                type='text'
                placeholder='Instagram'
                required
                value={formData?.instagramLink}
                onChange={(e) =>
                  setFormData({ ...formData, instagramLink: e.target.value })
                }
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
              />
              <input
                type='text'
                placeholder='Twitter (X)'
                required
                value={formData?.twitterLink}
                onChange={(e) =>
                  setFormData({ ...formData, twitterLink: e.target.value })
                }
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
              />
              <input
                type='text'
                placeholder='Snapchat'
                required
                value={formData?.snapchatLink}
                onChange={(e) =>
                  setFormData({ ...formData, snapchatLink: e.target.value })
                }
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
              />
            </div>
            <div className='flex gap-2 mt-4'>
              <p className='text-lg'>Medical Information</p>
              <p className='text-red-500'>*</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>
                  Do you have any allergies, medical conditions? if yes, please
                  specify
                </label>
                <textarea
                  placeholder='E.g I am allergic to peanuts'
                  required
                  value={formData?.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent h-[120px] placeholder:text-[#f7e5ce]'
                />
              </div>
              <div className='w-full'>
                <label>
                  Do you require any special needs, care or assistance? if yes,
                  please specify
                </label>
                <textarea
                  placeholder='E.g I use a wheelchair'
                  required
                  value={formData?.specialNeeds}
                  onChange={(e) =>
                    setFormData({ ...formData, specialNeeds: e.target.value })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent h-[120px] placeholder:text-[#f7e5ce]'
                />
              </div>
            </div>

            <div className='flex gap-2 mt-4'>
              <p className='text-lg'>Emergency Contact</p>
              <p className='text-red-500'>*</p>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Contact&apos;s First Name</label>
                <input
                  type='text'
                  placeholder='E.g John'
                  required
                  value={formData?.emergencyContactFirstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactFirstName: e.target.value,
                    })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
              <div className='w-full'>
                <label>Contact&apos;s Last Name</label>
                <input
                  type='text'
                  placeholder='E.g Adewale'
                  required
                  value={formData?.emergencyContactLastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactLastName: e.target.value,
                    })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
              <div className='w-full'>
                <label>Relationship</label>
                <input
                  type='text'
                  placeholder='E.g Brother'
                  required
                  value={formData?.emergencyContactRelationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactRelationship: e.target.value,
                    })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
              </div>
              <div className='w-full'>
                <label>Contact&apos;s Phone Number</label>
                <input
                  type='text'
                  placeholder='E.g 08012345678'
                  required
                  value={formData?.emergencyContactPhoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactPhoneNumber: e.target.value,
                    })
                  }
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
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
                checked={formData?.royalAssemblePackage}
                onChange={() => handlePackageChange('royalAssemblePackage')}
                className='w-5 h-5 bg-transparent accent-black mt-1 cursor-pointer'
              />
              <label>
                <p className='text-lg font-bold'>The Royal Assemble</p>
                <p>
                  Outdoor tent assembly -- (1 daily Healthy Meal/Snack & drink,
                  water, Reposition Welcome and after care package)
                </p>
                <p className='mt-1 font-medium text-lg'>350,000 NGN</p>
                <p className='mt-2'>Quantity</p>
                <input
                  type='number'
                  placeholder='1'
                  value={formData?.royalAssembleQuantity ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      royalAssembleQuantity: e.target.value
                        ? parseInt(e.target.value)
                        : 0,
                    })
                  }
                  min={0}
                  className='border border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
                <p className='mt-2 text-lg'>
                  Total Items: {formatPrice(royalAssemblePrice)}
                </p>
              </label>
            </div>

            <div className='flex gap-4 mt-4 border border-[#3d3e3f] rounded-sm p-2'>
              <input
                type='checkbox'
                checked={formData?.palacePackage}
                onChange={() => handlePackageChange('palacePackage')}
                className='w-5 h-5 bg-transparent accent-black mt-1 cursor-pointer'
              />
              <label>
                <p className='text-lg font-bold'>The Palace</p>
                <p>
                  Private Hut (Re-curated) -- (1 daily Healthy Meal/Snack &
                  drink, water, Reposition Welcome and after care package)
                </p>
                <p className='mt-1 font-medium text-lg'>600,000 NGN</p>
                <p className='mt-2'>Quantity</p>
                <input
                  type='number'
                  placeholder='1'
                  value={formData?.palaceQuantity ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      palaceQuantity: e.target.value
                        ? parseInt(e.target.value)
                        : 0,
                    })
                  }
                  min={0}
                  className='border border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent placeholder:text-[#6d522f]'
                />
                <p className='mt-2 text-lg'>
                  Total Items: {formatPrice(palacePackagePrice)}
                </p>
              </label>
            </div>

            <div className='mt-4 text-lg font-bold'>
              Total : {formatPrice(calculateTotalPrice())}
            </div>
            <div className='mt-4 text-[#f7e6d1] font-bold'>
              <p>BANK: Zenith Bank</p>
              <p>ACCOUNT NAME: Reposition</p>
              <p>ACCOUNT NUMBER: 1311142463</p>
            </div>

            <div className='mt-4 text-white font-bold'>
              <p>OR</p>
              <button
                onClick={handlePaystackPayment}
                // disabled={!formData.email || calculateTotalPrice() <= 0}
                className='flex gap-2 items-center mt-4 cursor-pointer'
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
            <p className='mt-4 text-white text-sm'>
              Limited & Curated Guests Only.
            </p>
            <p className='text-white text-sm'>Payment closes 27.11.2024</p>

            <div className='w-full mt-4'>
              <div className='flex gap-2 '>
                <p className='text-lg'>
                  Please Upload your receipt screenshot for proof of payment
                </p>
                <p className='text-red-500'>*</p>
              </div>

              <FileUploader
                fileUrls={formData?.receiptScreenshot}
                setFileUrls={(img) =>
                  setFormData({ ...formData, receiptScreenshot: img })
                }
                className=''
                fileType='image'
              />
            </div>

            <Accordion type='single' collapsible className='w-full mt-6'>
              <AccordionItem
                value='On-boarding-information'
                className='border-b-[#a1a1a19c]'
              >
                <AccordionTrigger className='text-lg font-bold underline underline-offset-1'>
                  On-Boarding Information
                </AccordionTrigger>
                <AccordionContent>
                  <p className='mt-2 text-[16px] leading-6'>
                    The Assemble is a 3-night camping experience, put together
                    by REPOSITION to help discerning individuals experience a
                    momentarily offline living, where you unplug from the
                    day-to-day routines, and reconnect with nature, people and
                    God. During this time you will be encouraged to observe a
                    digital detox/fast for the duration of the camp-retreat
                    experience, having only 30mins of screen time each day.{' '}
                    <br /> <br /> You will be expected to turn-off or put on
                    airplane mode, and hand-in your phones/digital devices for
                    safe keeping, and pick up for 15mins by 12:30pm, and another
                    15mins by 7:00pm respectively. <br /> You will be provided
                    with many experiences from the moment you&apos;re welcomed
                    to the moment we share goodbyes, to make your camp-retreat
                    experience wholesome and rejuvenating. <br />
                    Couples are encouraged to participate, but are not allow to
                    share a camping tent, as we&apos;d love to have everyone
                    enjoy a moment with themselve as much as they can - to help
                    you reflect, correct, give gratitude and plan for the new
                    year all in a journal. <br /> Your packs will include a
                    specially curated care package and timetable of all
                    activities. <br /> <br />
                    Fully armed private security and Healthcare assistants will
                    be on standby.
                    <br /> Unprescribed/illegal drugs are not allowed throughout
                    The Assemble camp-retreat experience, any type of
                    specialized fast is also encouraged. We&apos;d also like to
                    promote low carb/fatty food intake during this period.
                    <br /> We have carefully curated this experience for you to
                    CHILL, CONNECT, have CONVERSATIONS and to COMMUNE. <br />{' '}
                    Thank you for deciding to share this experience with
                    yourself, as the most intimate moment of the year is almost
                    here..
                    <br /> <br />
                    Come In, You&apos;re Welcome.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type='single' collapsible className='w-full mt-6 '>
              <AccordionItem
                value='informed-consent'
                className='border-b-[#a1a1a19c]'
              >
                <AccordionTrigger className='text-lg font-bold underline underline-offset-1'>
                  Informed Consent and Acknowledgement
                </AccordionTrigger>
                <AccordionContent>
                  <p className='mt-2 text-[16px] leading-6'>
                    I hereby give my consent to participate in any and all
                    activities prepared by REPOSITION - The Assemble during the
                    selected camp-retreat. In exchange for the acceptance of my
                    candidacy by REPOSITION - The Assemble, I assume all risk
                    and hazards incidental to the conduct of the activities, and
                    release, absolve and hold harmless REPOSITION - The Assemble
                    and all its respective officers, agents, and representatives
                    from any and all liability for injuries arising out of
                    traveling to, participating in, or returning from selected
                    retreat/camp sessions. <br /> <br />
                    In case of injury, I hereby waive all claims against
                    REPOSITION - The Assemble including all Directors, Coaches,
                    Speakers and Affiliates, all participants, sponsoring
                    agencies, advertisers; and, if applicable, owners and
                    lessors of premises used to conduct the event. There is a
                    risk of being injured that is inherent in all outdoor or
                    adventure activities. Some of these injuries include but are
                    not limited to, the risk of fractures, paralysis, or death.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className='mt-6'>
              <h3 className='text-lg font-bold underline underline-offset-1'>
                Confirmation
              </h3>
              <p className='mt-2'>
                BY ACKNOWLEDGING AND SUBMITTING BELOW, I AM DELIVERING AN
                ELECTRONIC SIGNATURE THAT WILL HAVE THE SAME EFFECT AS AN
                ORIGINAL MANUAL PAPER SIGNATURE. THE ELECTRONIC SIGNATURE WILL
                BE EQUALLY AS BINDING AS AN ORIGINAL MANUAL PAPER SIGNATURE.
              </p>
            </div>

            <button
              disabled={!isFormValid() || loading}
              onClick={signUpForTheassemble}
              className='border border-[#909192] cursor-pointer bg-[#523f3fab] text-[#e4e0e0] w-full sm:w-[300px] p-2 text-sm mt-6'
            >
              {loading ? 'Loading...' : ' Confirm'}
            </button>
            {!isFormValid() && (
              <p className='text-red-500 text-xs mt-2 mb-6'>
                Please fill all required fields
              </p>
            )}
          </div>
          <div className=' mt-4 text-xs font-semibold text-[#f7e6d1]'>
            <p>Supported By</p>
            <div className='flex gap-3 mt-1'>
              <p>JENDAYA UK</p>
              <p className='italic'>Xpresso Cafe & Bar</p>
              <p>Mr Think Sneakers</p>
            </div>
          </div>
        </section>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='An error occured while trying to confirm your detailss'
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
          description='Please input your email and select a package'
        />
      )}
      {showPaystackSuccess && (
        <SuccessModal
          show={showPaystackSuccess}
          onClose={() => setShowPaystackSuccess(false)}
          title='Payment Successful'
          description='please continue to upload your receipt screenshot and confirm your details'
          buttonText='Continue'
          buttonClick={() => setShowPaystackSuccess(false)}
        />
      )}
    </div>
  );
};

export default TheAssemble;
