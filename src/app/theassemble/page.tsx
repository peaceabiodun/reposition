'use client';

import { FileUploader } from '@/components/file-uploader/page';
import Image from 'next/image';
import { useState } from 'react';

type FormDataType = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  birthDate: string;
  sex: string;
  phoneNumber: string;
  size: string;
  basic1MealADayPlan: string;
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
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    nickName: '',
    email: '',
    birthDate: '',
    sex: '',
    phoneNumber: '',
    size: '',
    basic1MealADayPlan: '',
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
  return (
    <div className='min-h-[100vh] bg-[#dbd9d2] font-light p-4'>
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

      <section>
        <h2 className='text-lg sm:text-2xl font-light text-center mt-6'>
          THE ASSEMBLE
        </h2>
        <p className='text-sm text-center mt-2'>REGISTRATION FORM</p>

        <div className='mt-6 flex flex-col m-auto w-full max-w-[1200px]'>
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
              />
            </div>
            <div className='w-full '>
              <label>Sex</label>

              <div className='flex gap-4 mt-4'>
                <div className='flex gap-2'>
                  <input
                    type='radio'
                    className='w-4 h-4 bg-transparent accent-black'
                    checked={formData?.sex === 'Male'}
                    onChange={() => setFormData({ ...formData, sex: 'Male' })}
                  />
                  <p>Male</p>
                </div>
                <div className='flex gap-2'>
                  <input
                    type='radio'
                    className='w-4 h-4 bg-transparent accent-black'
                    checked={formData?.sex === 'Female'}
                    onChange={() => setFormData({ ...formData, sex: 'Female' })}
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
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
            <div className='w-full'>
              <label>Size</label>
              <input
                type='text'
                placeholder='Please select'
                required
                value={formData?.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
              />
              <p className='text-xs text-[#50210b] mt-1'>
                Note: This selection is for items included in the Reposition
                care package
              </p>
            </div>

            <div className='w-full'>
              <label>Basic 1-Meal-A-Day Plan</label>
              <input
                type='text'
                placeholder='Please select'
                required
                value={formData?.basic1MealADayPlan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basic1MealADayPlan: e.target.value,
                  })
                }
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
              />
              <p className='text-xs text-[#50210b] mt-1'>
                Note: This selection is for 1-Meal-A-Day Plan to help us prepare
                better
              </p>
            </div>
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                  className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
              setFileUrls={(img) => setFormData({ ...formData, validId: img })}
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
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
            />
            <input
              type='text'
              placeholder='Twitter (X)'
              required
              value={formData?.twitterLink}
              onChange={(e) =>
                setFormData({ ...formData, twitterLink: e.target.value })
              }
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
            />
            <input
              type='text'
              placeholder='Snapchat'
              required
              value={formData?.snapchatLink}
              onChange={(e) =>
                setFormData({ ...formData, snapchatLink: e.target.value })
              }
              className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent h-[120px] '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent h-[120px] '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
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
                className='border border-[#3d3e3f] rounded-sm w-full p-2 mt-2 outline-none bg-transparent '
              />
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            <p className='text-lg'>Package Options</p>
            <p className='text-red-500'>*</p>
          </div>

          <div className='flex gap-4 mt-4 border border-[#3d3e3f] rounded-sm p-2'>
            <input
              type='radio'
              checked={formData?.royalAssemblePackage}
              onChange={() =>
                setFormData({ ...formData, royalAssemblePackage: true })
              }
              className='w-5 h-5 bg-transparent accent-black'
            />
            <label>
              <p className='text-lg font-bold'>The Royal Assemble</p>
              <p>
                Outdoor tent assembly -- (1 daily Healthy Meal/Snack & drink,
                water, Reposition Welcome and after care package)
              </p>
              <p className='mt-1 font-medium text-lg'>300,000 NGN</p>
              <p className='mt-2'>Quantity</p>
              <input
                type='number'
                placeholder='1'
                value={formData?.royalAssembleQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = parseInt(value, 10);
                  setFormData({
                    ...formData,
                    royalAssembleQuantity: isNaN(parsedValue) ? 0 : parsedValue,
                  });
                }}
                className='border border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent '
              />
              <p className='mt-2 text-lg'>Total Items: 0.00 NGN</p>
            </label>
          </div>

          <div className='flex gap-4 mt-4 border border-[#3d3e3f] rounded-sm p-2'>
            <input
              type='radio'
              checked={formData?.palacePackage}
              onChange={() => setFormData({ ...formData, palacePackage: true })}
              className='w-5 h-5 bg-transparent accent-black'
            />
            <label>
              <p className='text-lg font-bold'>The Palace</p>
              <p>
                Private Hut (Re-curated) -- (1 daily Healthy Meal/Snack & drink,
                water, Reposition Welcome and after care package)
              </p>
              <p className='mt-1 font-medium text-lg'>550,000 NGN</p>
              <p className='mt-2'>Quantity</p>
              <input
                type='number'
                placeholder='1'
                value={formData?.palaceQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = parseInt(value, 10);
                  setFormData({
                    ...formData,
                    palaceQuantity: isNaN(parsedValue) ? 0 : parsedValue,
                  });
                }}
                className='border border-[#3d3e3f] rounded-sm w-[100px] p-2 mt-2 outline-none bg-transparent '
              />
              <p className='mt-2 text-lg'>Total Items: 0.00 NGN</p>
            </label>
          </div>

          <div className='mt-4 text-lg font-bold'>Total : 0.00 NGN</div>
          <div className='mt-4'>
            <p>BANK: Zenith Bank</p>
            <p>ACCOUNT NAME: Reposition</p>
            <p>ACCOUNT NUMBER: 1311142463</p>
          </div>

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

          <div className='mt-6'>
            <h3 className='text-lg font-bold underline underline-offset-1'>
              On-Boarding Information
            </h3>

            <p className='mt-2'>
              The Assemble is a 3-night camping experience, put together by
              REPOSITION to help discerning individuals experience a momentarily
              offline living, where you unplug from the day-to-day routines, and
              reconnect with nature, people and God. During this time you will
              be encouraged to observe a digital detox/fast for the duration of
              the camp-retreat experience, having only 20mins of screen time
              each day. <br /> <br /> You will be expected to turn-off or put on
              airplane mode, and hand-in your phones/digital devices for safe
              keeping, and pick up for 10mins by 12:30pm, and another 10mins by
              7:00pm respectively. <br /> You will be provided with many
              experiences from the moment you&apos;re welcomed to the moment we
              share goodbyes, to make your camp-retreat experience wholesome and
              rejuvenating. Couples are encouraged to participate, but are not
              allow to share a camping tent, as we&apos;d love to have everyone
              enjoy a moment with themselve as much as they can - to help you
              reflect, correct, give gratitude and plan for the new year all in
              a journal. <br /> Your packs will include a specially curated care
              package and timetable of all activities. <br /> <br />
              Fully armed private security and Healthcare assistants will be on
              standby.
              <br /> Unprescribed/illegal drugs are not allowed throughout The
              Assemble camp-retreat experience, any type of specialized fast is
              also encouraged. We&apos;d also like to promote low carb/fatty
              food intake during this period.
              <br /> We have carefully curated this experience for you to CHILL,
              CONNECT, have CONVERSATIONS and to COMMUNE. Thank you for deciding
              to share this experience with yourself, as the most intimate
              moment of the year is almost here..
              <br /> <br />
              Come In, You&apos;re Welcome.
            </p>
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-bold underline underline-offset-1'>
              Informed Consent and Acknowledgement
            </h3>
            <p className='mt-2'>
              I hereby give my consent to participate in any and all activities
              prepared by REPOSITION - The Assemble during the selected
              camp-retreat. In exchange for the acceptance of my candidacy by
              REPOSITION - The Assemble, I assume all risk and hazards
              incidental to the conduct of the activities, and release, absolve
              and hold harmless REPOSITION - The Assemble and all its respective
              officers, agents, and representatives from any and all liability
              for iniuries arisina out of travelina to. participating in, or
              returning from selected retreat/camp sessions. <br /> <br />
              In case of injury, I hereby waive all claims against REPOSITION -
              The Assemble including all Directors, Coaches, Speakers and
              Affiliates, all participants, sponsoring agencies, advertisers;
              and, if applicable, owners and lessors of premises used to conduct
              the event. There is a risk of being injured that is inherent in
              all outdoor or adventure activities. Some of these injuries
              include but are not limited to, the risk of fractures, paralysis,
              or death.
            </p>
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-bold underline underline-offset-1'>
              Confirmation
            </h3>
            <p>
              BY ACKNOWLEDGING AND SUBMITTING BELOW, I AM DELIVERING AN
              ELECTRONIC SIGNATURE THAT WILL HAVE THE SAME EFFECT AS AN ORIGINAL
              MANUAL PAPER SIGNATURE. THE ELECTRONIC SIGNATURE WILL BE EQUALLY
              AS BINDING AS AN ORIGINAL MANUAL PAPER SIGNATURE.
            </p>
          </div>

          <button className='border border-[#909192] cursor-pointer bg-[#523f3fab] text-[#e4e0e0] w-full sm:w-[300px] p-2 text-sm my-6'>
            {loading ? 'Loading...' : ' Confirm'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default TheAssemble;
