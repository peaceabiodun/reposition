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
import { STORAGE_KEYS } from '@/utils/constants';
import { ENUM_PRODUCT_FILTER_LIST } from '@/utils/enum';
import SortInput from '@/components/sort/page';
import { useRouter } from 'next/navigation';
import { CampaignDetailsType, ShoppingBagType } from '@/utils/types';
import ReactPlayer from 'react-player';
import { IoIosBasket } from 'react-icons/io';
import { MdMenuOpen } from 'react-icons/md';
import { TbShirt } from 'react-icons/tb';
import { GoPerson } from 'react-icons/go';
import UpdatePasswordModal from '@/components/update-password-modal/page';
import SuccessModal from '@/components/success-modal/page';
import MobileMenu from '@/components/mobile-menu/page';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const { products, setProducts } = useProductContext();
  const [showErrorModal, setShowErrorModal] = useState(false);
  //const [showCampaign, setShowCampaign] = useState(true);
  const [filterValue, setFilterValue] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetailsType>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [token, setToken] = useState('');
  const [scroll, setScroll] = useState(false);
  const [bagItems, setBagItems] = useState<ShoppingBagType[]>([]);
  const [email, setEmail] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // useEffect(() => {
  //   const hasSeenCampaign = localStorage.getItem(STORAGE_KEYS.SEEN_CAMPAIGN);
  //   if (hasSeenCampaign) {
  //     setShowCampaign(false);
  //   }
  // }, []);

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

  const fetchCampaignDetails = async () => {
    setCampaignLoading(true);
    try {
      const { data, error } = await supabase.from('campaign').select();
      if (data) {
        setCampaignDetails(data[0]);
      }

      if (error) {
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setShowErrorModal(true);
    } finally {
      setCampaignLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, []);

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session !== null) {
      localStorage.setItem(
        STORAGE_KEYS.AUTH_TOKEN,
        session?.access_token ?? ''
      );
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session?.user.email ?? '');
      localStorage.setItem(STORAGE_KEYS.USER_ID, session?.user.id ?? '');
      localStorage.setItem(
        STORAGE_KEYS.USER_ROLE,
        session?.user.user_metadata.user_role ?? ''
      );
    }
  };

  useEffect(() => {
    getSession();
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 20);
    });
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) ?? '';
      setEmail(email ?? '');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? '';
      setToken(authToken ?? '');
    }
  }, []);

  const userRole =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      : '';

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setToken('');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      setShowLogoutModal(false);
      setShowDropdown(false);
      router.refresh();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingBagItemsJSON = localStorage.getItem(STORAGE_KEYS.BAG_ITEMS);
    if (existingBagItemsJSON) {
      const existingBagItems = JSON.parse(existingBagItemsJSON);
      setBagItems(existingBagItems ?? []);
      localStorage.setItem(
        STORAGE_KEYS.CART_LENGTH,
        (existingBagItems?.length ?? 0).toString()
      );
    }
  }, []);
  //check to get the user role and redirect to the appropriate page
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     await getSession();
  //     const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  //     if (!authToken) {
  //       router.push('/login');
  //     }
  //   };
  //   checkAuth();
  // }, [router]);

  // const refreshSession = async () => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.refreshSession();

  //   if (session !== null) {
  //     localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
  //     localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session.user?.email ?? '');
  //   }
  // };

  // const handleCloseCampaign = () => {
  //   setShowCampaign(false);
  //   localStorage.setItem(STORAGE_KEYS.SEEN_CAMPAIGN, 'true');
  // };
  return (
    <Fragment>
      <div className='w-full relative min-h-[100vh] bg-[#dbd9d2] font-light '>
        <div className='max-w-[1700px] mx-auto'>
          {/* <Header /> */}
          <div className='flex flex-col items-center  w-full p-4'>
            {campaignLoading ? (
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
              <div className='relative w-full'>
                <div className=' mt-3'>
                  <div className='w-full border border-[#3f2a16] overflow-hidden h-[50vh] md:h-[90vh] campaign_video rounded-[16px]'>
                    <ReactPlayer
                      width='100%'
                      height='100%'
                      url={campaignDetails?.campaign_video}
                      controls={false}
                      playing={true}
                      loop={true}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className='absolute bottom-0 p-8 text-white '>
                    <h2 className='text-xl sm:text-3xl mt-6'>
                      <Typewriter
                        options={{
                          strings: [
                            'Experience Freedom',
                            `${campaignDetails?.campaign_title}`,
                          ],
                          autoStart: true,
                          loop: true,
                        }}
                      />
                    </h2>
                    <div className=' text-base sm:text-lg flex flex-col items-center gap-2 mt-3 border border-white rounded-lg p-2 sm:w-[280px]'>
                      {/* <p>{campaignDetails?.campaign_subtext}</p> */}
                      Shop the Collection
                    </div>
                  </div>
                </div>

                <nav className='absolute top-0 flex justify-between w-full p-8 text-white'>
                  <div className='gap-8 hidden sm:flex'>
                    <p
                      className='text-[16px] md:text-lg font-semibold cursor-pointer hidden sm:flex'
                      onClick={() => router.push('/we-are')}
                    >
                      We Are
                    </p>
                    <p
                      className='text-[16px] md:text-lg font-semibold cursor-pointer hidden sm:flex'
                      onClick={() => router.push('/theassemble')}
                    >
                      Join The Assemble
                    </p>
                  </div>

                  <div className='flex gap-1'>
                    <h2 className='font-bold text-sm sm:text-lg md:text-xl text-[#fafafa]'>
                      REPOSITION{' '}
                    </h2>
                    <Image
                      src={'/logo.svg'}
                      alt='logo'
                      width={30}
                      height={30}
                      className='object-cover invert'
                    />
                  </div>

                  <div className='flex gap-3'>
                    {userRole === 'ADMIN' && (
                      <TbShirt
                        size={26}
                        onClick={() => router.push('/manage-products')}
                        className='cursor-pointer hidden sm:flex'
                      />
                    )}
                    <GoPerson
                      size={26}
                      onClick={() => {
                        if (token) {
                          setShowDropdown(!showDropdown);
                        } else {
                          router.push('/login');
                        }
                      }}
                      className='cursor-pointer hidden sm:flex'
                    />
                    <div className='relative'>
                      <IoIosBasket
                        size={26}
                        onClick={() => router.push('/bag')}
                        className='cursor-pointer '
                      />
                      <span
                        onClick={() => router.push('/bag')}
                        className={`text-[10px] absolute bg-[#3f2a16] text-white ${
                          scroll
                            ? 'top-[-8px] right-[0px]'
                            : 'top-[-8px] right-[0px]'
                        }  right-[4px] rounded-full p-2 w-4 h-4  flex items-center justify-center cursor-pointer`}
                      >
                        {bagItems.length ?? '0'}
                      </span>
                    </div>
                    <MdMenuOpen
                      size={26}
                      className='cursor-pointer sm:hidden'
                      onClick={() => setShowMobileMenu(true)}
                    />
                  </div>
                  {showDropdown && (
                    <div className='backdrop-blur-md rounded-sm p-2 absolute right-2 top-16 shadow-md text-xs sm:text-sm flex flex-col gap-2 z-[999]'>
                      <div
                        onClick={() => setShowUpdatePasswordModal(true)}
                        className='hover:border border-white rounded-md p-2 cursor-pointer'
                      >
                        Update password
                      </div>

                      <div
                        onClick={() => setShowLogoutModal(true)}
                        className=' hover:border border-white rounded-md p-2 cursor-pointer'
                      >
                        Logout
                      </div>
                    </div>
                  )}
                </nav>
              </div>
            )}
          </div>

          <div className='flex items-center gap-6 mt-4 w-full justify-between'>
            <SortInput
              options={options}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
            />
            <button
              onClick={() => router.push('/bag')}
              className='border border-[#3f2a16] p-2 text-sm h-[36px] w-[100px] mr-4 flex items-center justify-center gap-1 hover:scale-105 transition-all duration-300 cursor-pointer'
            >
              Basket
              <IoIosBasket size={18} />
            </button>
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
            <div className='product_grid w-full min-h-[85vh] md:min-h-full mt-5 grid grid-cols-2 md:grid-cols-3 p-4'>
              {products?.map((item) => (
                <Link
                  href={`product/${item.id}`}
                  key={item.id}
                  className='mb-4'
                >
                  <div className='relative min-h-[400px] lg:min-h-[500px] xl:min-h-[650px] w-[100%] hover:scale-105 transition-all duration-300 '>
                    <Image
                      src={item?.images[0] ?? '/placeholder.png'}
                      alt='product_image'
                      fill
                      className={` min-h-[400px] h-[400px] home_img object-cover border border-solid border-[#3f2a16] shadow-md ${
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

                  <div className='flex items-center gap-2 font-light mt-2'>
                    <p className='text-base sm:text-lg font-medium'>
                      ₦ {Number(item.price).toLocaleString()}
                    </p>
                    {item.pre_order ? (
                      <p className='text-sm'>[Pre-Order]</p>
                    ) : null}
                  </div>
                  <p className=' font-light text-base'>{item.name}</p>
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
      {/* {showCampaign && (
        <div
          style={{
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `linear-gradient(
              to left,
              rgba(39, 37, 37, 0.699),
              rgba(39, 37, 37, 0.651)
            ),
            url('${campaignDetails?.banner_image}')`,
          }}
          className=' fixed inset-0 flex flex-col items-center justify-center p-4'
        >
          <h3 className='text-[#eefcff] text-sm text-center'>
            {campaignDetails?.banner_title}
          </h3>
          <p className='text-[#d2dadb] text-xs my-3 text-center'>
            {campaignDetails?.banner_subtext}
          </p>

          <button
            onClick={() => router.push('/campaign')}
            className='bg-white p-2 h-[33px] w-[90px] text-xs font-light'
          >
            View
          </button>

          <button
            onClick={handleCloseCampaign}
            className='bg-[#ebfaf7d3] rounded-full p-1 w-6 h-6 flex items-center justify-center mt-7'
          >
            <MdClose />
          </button>
        </div>
      )} */}
      {showUpdatePasswordModal && (
        <UpdatePasswordModal
          show={showUpdatePasswordModal}
          onClose={() => setShowUpdatePasswordModal(false)}
          email={email}
        />
      )}

      {showLogoutModal && (
        <SuccessModal
          show={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title='Are you sure you want to Logout ?'
          buttonText='Logout'
          buttonClick={logout}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title='Email sent!'
          description='Check your email for the reset link'
        />
      )}
      {showMobileMenu && (
        <MobileMenu
          show={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </Fragment>
  );
};

export default Home;
