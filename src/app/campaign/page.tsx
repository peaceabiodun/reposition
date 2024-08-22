"use client";

import Header from "@/components/header/page";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { Fragment, useEffect, useState } from "react";
import EditCampaign from "@/components/edit-campaign-modal/page";
import { STORAGE_KEYS } from "@/utils/constants";
import ReactPlayer from "react-player";
import { supabase } from "@/lib/supabase";
import { CampaignDetailsType } from "@/utils/types";
import ErrorModal from "@/components/error-modal/page";
import { ThreeCircles } from "react-loader-spinner";

const CampaignPage = () => {
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetailsType>();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const userRole =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.USER_ROLE)
      : "";

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

  return (
    <Fragment>
      <div className="bg-[#f8d3c98a] h-full min-h-screen">
        <Header />
        <div className="p-4 gap-1 flex justify-between text-sm items-center">
          <Link href="/home" className=" gap-1 flex text-sm items-center">
            <MdOutlineArrowBackIosNew size={20} />
            Back
          </Link>
          {userRole === "ADMIN" && (
            <button
              onClick={() => setShowEditCampaignModal(true)}
              className="border border-[#3d3e3f]  p-2 text-xs md:text-sm"
            >
              Edit Campaign
            </button>
          )}
        </div>

        {loading ? (
          <div className="grow w-full flex justify-center items-center p-4">
            <ThreeCircles
              visible={true}
              height={50}
              width={50}
              color="#b4b4b4ad"
              ariaLabel="three-circles-loading"
              wrapperClass="my-4"
            />
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-center mt-6">
              <Typewriter
                options={{
                  strings: [
                    "NEW DROP | Summer '24",
                    `${campaignDetails?.campaign_title}`,
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h2>

            <div className="my-6 flex flex-col items-center justify-center ">
              <div className="w-full sm:h-[600px] ">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={campaignDetails?.campaign_video}
                  controls={true}
                  playing={true}
                  loop={true}
                />
                {/* <video width='100%' height='500px' autoPlay src='/video1.mp4' /> */}
              </div>

              <div className="text-[#704e21] text-sm md:text-[16px] font-semibold flex flex-col items-center gap-2 mt-3">
                <p>{campaignDetails?.campaign_subtext}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {showEditCampaignModal && (
        <EditCampaign
          show={showEditCampaignModal}
          onClose={() => setShowEditCampaignModal(false)}
          campaignDetails={campaignDetails}
          refetch={fetchCampaignDetails}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          description="An error occured, please check your connection"
        />
      )}
    </Fragment>
  );
};

export default CampaignPage;
