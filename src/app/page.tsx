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
import { BsHandbag } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { CgMenuRight } from 'react-icons/cg';
import UpdatePasswordModal from '@/components/update-password-modal/page';
import SuccessModal from '@/components/success-modal/page';
import MobileMenu from '@/components/mobile-menu/page';
import TeaCoffeeModal from '@/components/tea-coffee-modal/page';
import LanguageSelector from '@/components/language-dropdown/page';
import BeverageConfirmationModal from '@/components/beverage-confirmation-modal/page';
import CurrencySelector from '@/components/currency-selector/page';

const Home = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { products, setProducts } = useProductContext();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [filterValue, setFilterValue] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
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
  const [showBeverageConfirmationModal, setShowBeverageConfirmationModal] =
    useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const beverage = localStorage.getItem(STORAGE_KEYS.BEVERAGE_SELECTED);

      // Only show modal if user hasn't selected a beverage preference
      if (!beverage) {
        // Show modal after 7 seconds
        const timer = setTimeout(() => {
          setShowTeaCoffeeModal(true);
        }, 7000);

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('products')
        .select()
        .order('created_at', { ascending: false });
      if (data !== null) {
        if (filterValue !== ENUM_PRODUCT_FILTER_LIST.ALL) {
          data = data.filter(
            (product: any) => product.category === filterValue
          );
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

  // const fetchCampaignDetails = async () => {
  //   setCampaignLoading(true);
  //   try {
  //     const { data, error } = await supabase.from('campaign').select();
  //     if (data) {
  //       setCampaignDetails(data[0]);
  //     }

  //     if (error) {
  //       setShowErrorModal(true);
  //     }
  //   } catch (err: any) {
  //     setShowErrorModal(true);
  //   } finally {
  //     setCampaignLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCampaignDetails();
  // }, []);

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
      <div className='w-full relative min-h-[100vh] bg-[#eee1d3] pb-10'>
        <div className=''>
          <div className='flex flex-col items-center  w-full'>
            <div className='relative w-full'>
              <div className='relative'>
                <div className='w-full border border-[#3f2a16] overflow-hidden h-[100vh] campaign_video'>
                  <video
                    width='100%'
                    height='100%'
                    src={
                      'https://res.cloudinary.com/dggsagtrj/video/upload/v1754081413/Reposition_see_eir8dp.mp4'
                    }
                    controls={false}
                    loop={true}
                    autoPlay={true}
                    muted={true}
                    playsInline={true}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    className='w-full h-full object-cover z-[-1] pointer-events-none'
                    poster='/poster-img.png'
                    style={{
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      userSelect: 'none',
                      touchAction: 'none',
                    }}
                  />
                  <source
                    src={
                      'https://res.cloudinary.com/dggsagtrj/video/upload/v1754081413/Reposition_see_eir8dp.mp4'
                    }
                    type='video/mp4'
                  />
                </div>

                <div className='absolute bottom-0 p-8 text-white '>
                  <h2 className='text-xl sm:text-3xl mt-6'>
                    Experience Freedom
                  </h2>
                  <div
                    onClick={() => router.push('/shop')}
                    className=' text-base sm:text-lg flex flex-col items-center gap-2 mt-3 border border-[#38271c] border-solid rounded-[4px] p-2 w-[200px] sm:w-[280px] hover:bg-[#fafafa56] hover:text-[#3f2a16] transition-all duration-300 cursor-pointer'
                  >
                    STEP IN
                  </div>
                </div>
              </div>

              <nav
                className={`absolute top-0 flex items-center justify-between w-full p-4 md:px-8 text-white  hover:text-[#3f2a16] cursor-pointer bg-[#3f2a162f]`}
              >
                {/* <div className='gap-5 hidden lg:flex'>
                  <p
                    className='text-[16px] md:text-lg font-semibold cursor-pointer hidden lg:flex'
                    onClick={() => router.push('/shop')}
                  >
                    Shop
                  </p>
                  <p
                    className='text-[16px] md:text-lg font-semibold cursor-pointer hidden lg:flex'
                    onClick={() => router.push('/our-story')}
                  >
                    Our Story
                  </p>

                  <p
                    className='text-[16px] md:text-lg font-semibold cursor-pointer hidden lg:flex'
                    onClick={() => router.push('/assemble')}
                  >
                    Join Assemble
                  </p>
                  <p
                    onClick={() => router.push('/our-impact')}
                    className='text-[16px] md:text-lg font-semibold cursor-pointer hidden lg:flex'
                  >
                    Our Impact
                  </p>
                </div> */}

                <div className='mr-2 '>
                  <h2 className='font-bold text-sm sm:text-xl md:text-3xl daikon '>
                    REPOSITION{' '}
                  </h2>
                </div>

                <div className='flex gap-3'>
                  {/* {userRole === 'ADMIN' && (
                    <MdOutlineInventory
                      size={24}
                      onClick={() => router.push('/manage-products')}
                      className='cursor-pointer hidden lg:flex'
                    />
                  )} */}
                  {/* <GoPerson
                    size={26}
                    onClick={() => {
                      if (token) {
                        setShowDropdown(!showDropdown);
                      } else {
                        router.push('/login');
                      }
                    }}
                    className='cursor-pointer hidden lg:flex'
                  /> */}
                  <div className='relative'>
                    <BsHandbag
                      size={20}
                      onClick={() => router.push('/bag')}
                      className='cursor-pointer '
                    />
                    <span
                      onClick={() => router.push('/bag')}
                      className={`text-[9px] absolute top-[7px] ${
                        scroll ? ' ' : ' '
                      }  right-[2px]  rounded-full p-2 w-4 h-4  flex items-center justify-center cursor-pointer`}
                    >
                      {bagItems.length ?? '0'}
                    </span>
                  </div>
                  <LanguageSelector />
                  <CurrencySelector />
                  <button
                    aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
                    aria-pressed={showMobileMenu}
                    onClick={() => setShowMobileMenu((prev) => !prev)}
                    className='relative w-6 h-6 '
                  >
                    <CgMenuRight
                      size={20}
                      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                        showMobileMenu
                          ? 'opacity-0 rotate-90 scale-75'
                          : 'opacity-100 rotate-0 scale-100'
                      }`}
                    />
                    <MdClose
                      size={20}
                      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                        showMobileMenu
                          ? 'opacity-100 rotate-0 scale-100'
                          : 'opacity-0 -rotate-90 scale-75'
                      }`}
                    />
                  </button>
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

              <div
                id={`${scroll ? 'sticky' : ''}`}
                className={` ${
                  scroll
                    ? 'flex items-center justify-between gap-4 p-4 md:p-8 text-[#3f2a16] transition-all slide-in-from-top duration-500 cursor-pointer backdrop-blur-sm fixed left-0 top-0 w-full z-[999]'
                    : ' hidden '
                } `}
              >
                <div className='relative'>
                  <BsHandbag
                    size={23}
                    onClick={() => router.push('/bag')}
                    className='cursor-pointer '
                  />
                  <span
                    onClick={() => router.push('/bag')}
                    className={`text-[10px] absolute top-[8px] ${
                      scroll ? ' ' : ' '
                    }  right-[4px]  rounded-full p-2 w-4 h-4  flex items-center justify-center cursor-pointer`}
                  >
                    {bagItems.length ?? '0'}
                  </span>
                </div>
                <h2 className='font-bold text-sm sm:text-lg md:text-xl daikon '>
                  REPOSITION
                </h2>
                <div>
                  <button
                    aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
                    aria-pressed={showMobileMenu}
                    onClick={() => setShowMobileMenu((prev) => !prev)}
                    className='relative w-6 h-6'
                  >
                    <CgMenuRight
                      size={20}
                      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                        showMobileMenu
                          ? 'opacity-0 rotate-90 scale-75'
                          : 'opacity-100 rotate-0 scale-100'
                      }`}
                    />
                    <MdClose
                      size={20}
                      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${
                        showMobileMenu
                          ? 'opacity-100 rotate-0 scale-100'
                          : 'opacity-0 -rotate-90 scale-75'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='w-full sm:h-[100vh] flex flex-col sm:flex-row'>
              <img
                src='/home-img.png'
                alt='home-img'
                className='w-full sm:w-[50%] h-full object-cover'
                // onClick={() =>
                //   router.push('/product/e0983685-5b86-4666-bae9-7a90e48e156c')
                // }
              />
              <img
                src='/home-img1.png'
                alt='home-img'
                className='w-full sm:w-[50%] h-full object-cover'
              />
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
            <div className='max-w-[1700px] mx-auto px-4'>
              <div
                ref={scrollContainerRef}
                className='flex gap-2 mdLg:gap-0 overflow-x-auto no-scrollbar pl-4 pr-4 mt-8'
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
                    className='lg:pl-4 relative group'
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className='relative w-[330px] h-[500px] md:w-[500px] md:h-[650px]'>
                      <Image
                        src={item?.images?.[0] ?? '/placeholder.png'}
                        alt='product_image'
                        fill
                        className={` object-cover shadow-lg rounded-lg transition-opacity duration-300 ${
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
                        className={` object-cover shadow-lg rounded-lg transition-opacity duration-300 opacity-0 ${
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

                    <div className=' text-[#3f2a16] '>
                      <div className=' mt-2'>
                        <p className=' text-sm uppercase font-semibold'>
                          {item.name}
                        </p>
                        <p className='text-[11px] uppercase mt-[1px]'>
                          {item.sub_description}
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

                      {/* <p className='text-sm md:text-base '>
                        ₦ {Number(item.price).toLocaleString()}
                      </p> */}
                      <button
                        onClick={() => router.push(`product/${item.id}`)}
                        className='text-xs flex flex-col items-center justify-center  mt-2 border border-[#38271c] border-solid rounded-[4px] p-2  hover:bg-[#fafafa56] text-[#3f2a16] transition-all duration-300 cursor-pointer z-[999] h-[30px]'
                      >
                        SELECT
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* <div className='flex items-center justify-end gap-2 mt-4'>
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
              </div> */}
              <div className='flex items-center justify-center mt-4 mb-8'>
                <button
                  onClick={() => router.push('/shop')}
                  className='cursor-pointer text-xs transition-all duration-300 bg-[#38271c] text-[#F5F5DC] hover:bg-[#38271cbe] px-4 py-2 w-[180px] border border-solid border-[#3f2a16] rounded-[4px]'
                >
                  SELECT ALL
                </button>
              </div>
            </div>
          )}

          <div className='max-w-[1700px] mx-auto px-4'>
            <h3 className='mdLg:text-base text-sm font-semibold mb-4'>
              ÙDÓ: Private Viewing Experience
            </h3>
            <div className='text-sm'>
              <p>
                In honoring our Assemble community, we made our first appearance
                in Lagos and staged a 360° experience, our way of bringing the
                Ùdó Collection to life. More specifically, we created a space
                where men, without alcohol or loud music, could exist in a
                peaceful and intentional way. <br />
                <br />
                As Reposition’s Lagos debut, Ùdó was presented as a private
                experience in collaboration with our friends Socialiaise Studio,
                Okunriin, Daniel Uwaga, and Happy Coffee. We offered a live Ùdó
                try-on and photo experience, a self-care bay, and thoughtfully
                curated food, drinks, and music. We were warmly welcomed by our
                Lagos team, and there was no better venue than the Japandi,
                family-inspired Socialiaise Studio in Ikoyi, Lagos.
                <br />
                <br />
                We opened with music from DJ Sketch and networking games hosted
                by Xara to make sure our Lagos guests settled in, connected, and
                enjoyed their time together.
                <br />
                <br />
                Planning this was rewarding. We plan to explore more cities, and
                hope to return to Lagos in the coming months to deepen
                conversations, collaborations, and tradition.
              </p>
            </div>
          </div>

          <div className=' grid grid-cols-1 lg:grid-cols-2 mt-16 mb-8'>
            <div className='w-full h-[500px] md:h-[900px] relative'>
              <video
                src='/videos/assemble1.mp4'
                controls={false}
                loop={true}
                autoPlay={true}
                muted={true}
                playsInline={true}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                className='w-full h-full object-cover z-[-1] pointer-events-none'
                poster='/assemble-poster1.png'
                style={{
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              />
              <source src='/videos/assemble1.mp4' type='video/mp4' />
              {/* <div className='flex items-center justify-center'>
                <div className='absolute top-3  p-2'>
                  <h4 className=' text-sm  max-w-[450px] text-white mb-4 text-center font-semibold '>
                    Step into Assemble <br />
                    To experience special offers, early access to releases,
                    <br /> event access, free delivery and more!
                  </h4>
                </div>
              </div> */}
              <div className='w-full absolute bottom-2 flex items-center justify-center mt-4 p-2'>
                <div
                  onClick={() => router.push('/assemble')}
                  className=' text-sm font-medium flex  items-center justify-center  border border-white border-solid rounded-[4px] p-2 w-[200px] h-[34px] hover:bg-[#fafafa56] hover:text-[#3f2a16] text-white transition-all duration-300 cursor-pointer '
                >
                  ENTER
                </div>
              </div>
            </div>
            <div className='w-full h-[500px] md:h-[900px]'>
              <video
                src='/videos/assemble2.mp4'
                controls={false}
                loop={true}
                autoPlay={true}
                muted={true}
                playsInline={true}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                className='w-full h-full object-cover z-[-1] pointer-events-none'
                poster='/assemble-poster2.png'
                style={{
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              />
              <source src='/videos/assemble2.mp4' type='video/mp4' />
            </div>
          </div>

          <Footer />
        </div>
        {/* <BottomNav /> */}
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
          showConfirmationModal={() => {
            setShowBeverageConfirmationModal(true);
            setShowTeaCoffeeModal(false);
          }}
        />
      )}
      {showBeverageConfirmationModal && (
        <BeverageConfirmationModal
          show={showBeverageConfirmationModal}
          onClose={() => setShowBeverageConfirmationModal(false)}
        />
      )}

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
