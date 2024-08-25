"use client";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import Image from "next/image";
import Link from "next/link";
import Typewriter from "typewriter-effect";
import { ThreeCircles } from "react-loader-spinner";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ErrorModal from "@/components/error-modal/page";
import { useProductContext } from "@/context/product-context";
import { STORAGE_KEYS } from "@/utils/constants";
import { ENUM_PRODUCT_FILTER_LIST } from "@/utils/enum";
import SortInput from "@/components/sort/page";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { CampaignDetailsType } from "@/utils/types";
import { checkAuth } from "@/lib/utils";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { products, setProducts } = useProductContext();
  // const [products, setProducts] = useState<ProductDetailType[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCampaign, setShowCampaign] = useState(true);
  const [filterValue, setFilterValue] = useState<string>(
    ENUM_PRODUCT_FILTER_LIST.ALL
  );
  const router = useRouter();
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetailsType>();

  useEffect(() => {
    const hasSeenCampaign = localStorage.getItem(STORAGE_KEYS.SEEN_CAMPAIGN);
    if (hasSeenCampaign) {
      setShowCampaign(false);
    }
  }, []);

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
        .from("products")
        .select()
        .order("created_at", { ascending: false });
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
    setLoading(true);
    try {
      const { data, error } = await supabase.from("campaign").select();
      if (data) {
        setCampaignDetails(data[0]);
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
    fetchCampaignDetails();
  }, []);

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session !== null) {
      setIsAuthenticated(true);
      localStorage.setItem(
        STORAGE_KEYS.AUTH_TOKEN,
        session?.access_token ?? ""
      );
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session?.user.email ?? "");
      localStorage.setItem(STORAGE_KEYS.USER_ID, session?.user.id ?? "");
      localStorage.setItem(
        STORAGE_KEYS.USER_ROLE,
        session?.user.user_metadata.user_role ?? ""
      );
    }
  };

  useEffect(() => {
    getSession();
  }, []);
  // const refreshSession = async () => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.refreshSession();

  //   if (session !== null) {
  //     localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
  //     localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session.user?.email ?? "");
  //   }
  // };

  const handleCloseCampaign = () => {
    setShowCampaign(false);
    localStorage.setItem(STORAGE_KEYS.SEEN_CAMPAIGN, "true");
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (isAuthenticated === false) {
  //       router.push("/"); // Redirect to signup page if not authenticated
  //     }
  //   }
  // }, [isAuthenticated, router]);

  const authToken =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuth(authToken ?? "");
    }
  }, [authToken]);

  return (
    <Fragment>
      <div className="w-full relative min-h-[100vh] bg-[#dbd9d2] ">
        <Header />
        <div className="hidden md:flex flex-col items-center justify-center w-full h-[85vh] p-4">
          <h2 className="text-4xl font-semibold">
            <Typewriter
              options={{
                strings: ["REPOSITION [ ]", "REPOSITION [ ]"],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className="mt-2 text-sm">Jubilee [Freedom] is here</p>
        </div>

        <SortInput
          options={options}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        {loading ? (
          <div className="grow w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-4">
            <ThreeCircles
              visible={true}
              height={50}
              width={50}
              color="#b4b4b4ad"
              ariaLabel="three-circles-loading"
              wrapperClass="my-4"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="w-full min-h-[85vh] md:min-h-[50vh] flex justify-center items-center p-4 text-sm">
            {" "}
            No Products Available
          </div>
        ) : (
          <div className="product_grid w-full min-h-[85vh] md:min-h-full mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
            {products?.map((item) => (
              <Link href={`product/${item.id}`} key={item.id} className="">
                <div className="relative min-h-[300px] ">
                  <Image
                    src={item?.images[0] ?? "/placeholder.png"}
                    alt="product_image"
                    width="200"
                    height="300"
                    className={` min-h-[300px] home_img object-cover border border-solid border-[#3f2a16] shadow-md ${
                      item.sold_out ? "brightness-50" : ""
                    } `}
                  />
                  {item.sold_out && (
                    <div className="home_img w-[200px] absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center text-center">
                      <p className=" text-sm text-gray-400 font-medium">
                        Sold out
                      </p>
                    </div>
                  )}
                </div>
                <p className="my-2 font-semibold text-[16px]">{item.name}</p>
                <div className="flex gap-2">
                  <p className="text-sm">${item.price}</p>
                  {item.pre_order ? (
                    <p className="text-sm">[Pre-Order]</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
        <Footer />
      </div>
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description="Sorry an error occured while loading the products"
        />
      )}
      {showCampaign && (
        <div
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `linear-gradient(
              to left,
              rgba(39, 37, 37, 0.699),
              rgba(39, 37, 37, 0.651)
            ),
            url('${campaignDetails?.banner_image}')`,
          }}
          className=" fixed inset-0 flex flex-col items-center justify-center p-4"
        >
          <h3 className="text-[#eefcff] text-sm text-center">
            {campaignDetails?.banner_title}
          </h3>
          <p className="text-[#d2dadb] text-xs my-3 text-center">
            {campaignDetails?.banner_subtext}
          </p>

          <button
            onClick={() => router.push("/campaign")}
            className="bg-white p-2 h-[33px] w-[90px] text-xs font-semibold"
          >
            View
          </button>

          <button
            onClick={handleCloseCampaign}
            className="bg-[#ebfaf7d3] rounded-full p-1 w-6 h-6 flex items-center justify-center mt-7"
          >
            <MdClose />
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
