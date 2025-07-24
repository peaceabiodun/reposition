/* eslint-disable @next/next/no-img-element */
'use client';
import Footer from '@/components/footer/page';
import Image from 'next/image';
import Link from 'next/link';
import { ThreeCircles } from 'react-loader-spinner';
import { Fragment, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ErrorModal from '@/components/error-modal/page';
import { useProductContext } from '@/context/product-context';
import { STORAGE_KEYS } from '@/utils/constants';
import { ENUM_PRODUCT_FILTER_LIST } from '@/utils/enum';
import { useRouter } from 'next/navigation';
import { CampaignDetailsType, ShoppingBagType } from '@/utils/types';
import ReactPlayer from 'react-player';
import { BsCart2 } from 'react-icons/bs';
import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdMenuOpen,
} from 'react-icons/md';
import { TbShirt, TbWorld } from 'react-icons/tb';
import { GoPerson } from 'react-icons/go';
import UpdatePasswordModal from '@/components/update-password-modal/page';
import SuccessModal from '@/components/success-modal/page';
import MobileMenu from '@/components/mobile-menu/page';
import TeaCoffeeModal from '@/components/tea-coffee-modal/page';
import LanguageSelector from '@/components/language-dropdown/page';

const Home = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
  const [isStartDisabled, setIsStartDisabled] = useState(true);
  const [isEndDisabled, setIsEndDisabled] = useState(false);
  const [activeButton, setActiveButton] = useState<'left' | 'right'>('right');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTeaCoffeeModal, setShowTeaCoffeeModal] = useState(false);

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    // Prevent scrolling if disabled
    if (direction === 'left' && isStartDisabled) return;
    if (direction === 'right' && isEndDisabled) return;

    setActiveButton(direction);

    // Update current index and disabled states
    if (direction === 'right' && currentIndex < products.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsStartDisabled(false);
      setIsEndDisabled(newIndex === products.length - 1);
    } else if (direction === 'left' && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setIsEndDisabled(false);
      setIsStartDisabled(newIndex === 0);
    }

    // Get container width to determine if we're on mobile
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const isMobile = containerWidth < 768; // Standard mobile breakpoint

    // Adjust scroll amount based on screen size
    const cardWidth = isMobile ? 350 : 647; // Mobile card width vs desktop card width
    const gap = isMobile ? 32 : 32; // Gap between cards
    const scrollAmount = isMobile ? cardWidth + gap : cardWidth + gap;

    const newScrollPosition =
      scrollContainerRef.current.scrollLeft +
      (direction === 'right' ? scrollAmount : -scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEvent = () => {
      const containerWidth = container.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const isMobile = containerWidth < 768;

      // Calculate card width and gap based on screen size
      const cardWidth = isMobile ? 350 : 647;
      const gap = 32;

      // Calculate which card is most visible
      const newIndex = Math.round(scrollPosition / (cardWidth + gap));

      // Update states
      setCurrentIndex(newIndex);
      setIsStartDisabled(newIndex === 0);
      setIsEndDisabled(newIndex === products.length - 1);
      setActiveButton(newIndex > currentIndex ? 'right' : 'left');
    };

    container.addEventListener('scroll', handleScrollEvent);
    return () => container.removeEventListener('scroll', handleScrollEvent);
  }, [products.length, currentIndex]);
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
      <div className='w-full relative min-h-[100vh] bg-[#dbd9d2] '>
        <div className=''>
          {/* <Header /> */}
          <div className='flex flex-col items-center  w-full'>
            {campaignLoading ? (
              <div className='w-full flex justify-center items-center p-4'>
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
                <div className=''>
                  <div className='w-full border border-[#3f2a16] overflow-hidden h-[100vh] campaign_video'>
                    <video
                      width='100%'
                      height='100%'
                      src={campaignDetails?.campaign_video[0] ?? ''}
                      controls={false}
                      loop={true}
                      autoPlay={true}
                      muted={true}
                      className='w-full h-full object-cover'
                    />
                    <source
                      src={campaignDetails?.campaign_video[0] ?? ''}
                      type='video/mp4'
                    />
                  </div>
                </div>

                <nav className='absolute top-0 flex items-center justify-between w-full p-4 md:p-8 text-white hover:bg-[#fafafa41] hover:text-[#3f2a16] transition-all slide-in-from-top duration-500 cursor-pointer'>
                  <div className='gap-8 hidden sm:flex'>
                    <p
                      className='text-[16px] md:text-lg font-semibold cursor-pointer hidden md:flex'
                      onClick={() => router.push('/shop')}
                    >
                      Shop
                    </p>
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

                  <div className='mr-16 '>
                    <h2 className='font-bold text-sm sm:text-lg md:text-xl  '>
                      REPOSITION{' '}
                    </h2>
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
                      <BsCart2
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
                        }  right-[4px]  rounded-full p-2 w-4 h-4  flex items-center justify-center cursor-pointer`}
                      >
                        {bagItems.length ?? '0'}
                      </span>
                    </div>
                    <LanguageSelector />
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

          <div className='relative'>
            <div className='w-full sm:h-[100vh] flex flex-col sm:flex-row'>
              <img
                src='/home-img.png'
                alt='home-img'
                className='w-full sm:w-[50%] h-full object-cover'
              />
              <img
                src='/home-img1.png'
                alt='home-img'
                className='w-full sm:w-[50%] h-full object-cover'
              />
            </div>
            <div className='absolute top-0 p-8 text-white '>
              <h2 className='text-xl sm:text-3xl mt-6'>Experience Freedom</h2>
              <div
                onClick={() => router.push('/shop')}
                className=' text-base sm:text-lg flex flex-col items-center gap-2 mt-3 border border-white p-2 w-[200px] sm:w-[280px] hover:bg-[#fafafa56] hover:text-[#3f2a16] transition-all duration-300 cursor-pointer'
              >
                {/* <p>{campaignDetails?.campaign_subtext}</p> */}
                Shop The Collection
              </div>
            </div>
          </div>

          {loading ? (
            <div className='grow w-full flex justify-center items-center p-4 h-[40vh]'>
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
            <div className='w-full flex justify-center items-center p-4 text-sm h-[40vh]'>
              {' '}
              No Products Available
            </div>
          ) : (
            <div className='max-w-[1700px] mx-auto'>
              <div
                ref={scrollContainerRef}
                className='flex md:gap-5 gap-3 overflow-x-auto no-scrollbar pl-4 pr-4 mt-8'
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                }}
              >
                {products?.slice(0, 7).map((item) => (
                  <Link
                    href={`product/${item.id}`}
                    key={item.id}
                    className='lg:pl-4 relative'
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className='relative w-[330px] h-[500px] md:w-[500px] md:h-[650px]'>
                      <Image
                        src={item?.images[0] ?? '/placeholder.png'}
                        alt='product_image'
                        fill
                        className={` object-cover shadow-md ${
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

                    <div className='absolute bottom-5 text-[#3f2a16] pl-5'>
                      <div className='flex items-center gap-2 mt-2'>
                        <p className=' text-xl font-medium'>{item.name}</p>
                        {item.pre_order ? (
                          <p className='text-sm'>[Pre-Order]</p>
                        ) : null}
                      </div>

                      <p className='text-base font-medium'>
                        ₦ {Number(item.price).toLocaleString()}
                      </p>
                      <button
                        onClick={() => router.push(`product/${item.id}`)}
                        className='text-sm flex flex-col items-center gap-2 mt-3 border border-white p-2 w-[200px] hover:bg-[#fafafa56] hover:text-[#3f2a16] text-white transition-all duration-300 cursor-pointer z-[999]'
                      >
                        Buy Now
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              <div className='flex items-center justify-end gap-2 mt-4'>
                <button disabled={isStartDisabled} className='cursor-pointer'>
                  <MdArrowCircleLeft
                    size={30}
                    onClick={() => handleScroll('left')}
                    aria-label='Scroll left'
                    className='text-[#3f2a1680]'
                  />
                </button>
                <button disabled={isEndDisabled} className='cursor-pointer'>
                  <MdArrowCircleRight
                    size={30}
                    onClick={() => handleScroll('right')}
                    aria-label='Scroll right'
                    className='text-[#3f2a1680]'
                  />
                </button>
              </div>
              <div className='flex items-center justify-center mt-4'>
                <button
                  onClick={() => router.push('/shop')}
                  className='cursor-pointer hover:bg-[#3f2a164d] text-[#3f2a16ef] px-4 py-2 w-[300px] border border-solid border-[#3f2a16]'
                >
                  Shop The Collection
                </button>
              </div>
            </div>
          )}
          <div className=' grid grid-cols-1 lg:grid-cols-2 my-8'>
            <div className='w-full h-[300px] md:h-[600px] relative'>
              <img
                src='/img2.png'
                alt='assemble'
                className='w-full h-full object-cover'
              />
              <div
                onClick={() => router.push('/theassemble')}
                className=' text-base sm:text-lg flex flex-col items-center gap-2 mt-3 border border-white p-2 w-[200px] sm:w-[280px] hover:bg-[#fafafa56] hover:text-[#3f2a16] text-white transition-all duration-300 cursor-pointer absolute bottom-5 left-5'
              >
                Join The Assemble
              </div>
            </div>
            <div className='w-full h-[300px] md:h-[600px]'>
              <img
                src='/img1.png'
                alt='assemble'
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          <div className='flex flex-col items-center justify-center gap-4 mb-10 p-4'>
            <h4 className='text-center text-sm md:text-lg max-w-[450px]'>
              Click to join the Reposition community &quot;The Assemble&quot; &
              enjoy discounts, early access, personalized event access, free
              delivery and more!
            </h4>
            <button
              onClick={() => router.push('/theassemble')}
              className='cursor-pointer hover:bg-[#3f2a164d] text-[#3f2a16ef] px-4 py-2  sm:w-[300px] border border-solid border-[#3f2a16]'
            >
              Join The Assemble
            </button>
          </div>
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
      {showTeaCoffeeModal && (
        <TeaCoffeeModal
          show={showTeaCoffeeModal}
          onClose={() => setShowTeaCoffeeModal(false)}
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
