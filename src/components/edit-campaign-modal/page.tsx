import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { supabase } from '@/lib/supabase';
import ErrorModal from '../error-modal/page';
import { CampaignDetailsType } from '@/utils/types';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
  campaignDetails: CampaignDetailsType | undefined;
  refetch?: () => void;
};

type CampaignFormDataType = {
  banner_image: string[];
  banner_title: string;
  banner_subtext: string;
  campaign_title: string;
  campaign_subtext: string;
  campaign_video: string[];
};
const EditCampaign = ({
  show,
  onClose,
  campaignDetails,
  refetch,
}: EditModalProps) => {
  const [formData, setFormData] = useState({} as CampaignFormDataType);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (campaignDetails) {
      setFormData({
        banner_image: campaignDetails.banner_image,
        banner_title: campaignDetails.banner_title,
        banner_subtext: campaignDetails.banner_subtext,
        campaign_title: campaignDetails.campaign_title,
        campaign_subtext: campaignDetails.campaign_subtext,
        campaign_video: campaignDetails.campaign_video,
      });
    }
  }, [campaignDetails]);

  const uploadSingleFile = async (
    file: File,
    fileType: 'image' | 'video'
  ): Promise<string> => {
    const contentType = fileType === 'image' ? 'image/jpeg' : 'video/mp4';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(file.name, file, {
        contentType,
      });

    if (error) {
      console.error('Error uploading file:', error.message);
      setShowErrorMessage(true);
      throw error;
    }

    const { data: UrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data?.path);

    return UrlData?.publicUrl;
  };

  const onBannerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: inputFiles } = e.target;
    if (inputFiles?.length) {
      setBannerFile(inputFiles[0]);
      setBannerPreview(URL.createObjectURL(inputFiles[0]));
    }
  };

  const onVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: inputFiles } = e.target;
    if (inputFiles?.length) {
      setVideoFile(inputFiles[0]);
      setVideoPreview(URL.createObjectURL(inputFiles[0]));
    }
  };

  const editCampaignDetails = async () => {
    setLoading(true);

    try {
      //const { data, error } = await supabase.from('campaign').insert(payload);
      let bannerImageUrl = formData.banner_image[0];
      let campaignVideoUrl = formData.campaign_video[0];

      if (bannerFile) {
        bannerImageUrl = await uploadSingleFile(bannerFile, 'image');
      }

      if (videoFile) {
        campaignVideoUrl = await uploadSingleFile(videoFile, 'video');
      }
      const payload = {
        ...formData,
        banner_image: [bannerImageUrl],
        campaign_video: [campaignVideoUrl],
      };
      const { data, error } = await supabase
        .from('campaign')
        .update(payload)
        .eq('id', campaignDetails?.id);

      onClose();
      refetch?.();
    } catch {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const bannerFileUploadRef = useRef<HTMLInputElement | null>(null);
  const videoFileUploadRef = useRef<HTMLInputElement | null>(null);

  return (
    <LocalSideModal
      isOpen={show}
      onRequestClose={onClose}
      title='Edit Campaign Details'
    >
      <div className='text-sm mt-4'>
        <div className='my-2'>
          <p className='mb-2'>Campaign Banner Image (1 image)</p>
          <div className=' '>
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt='banner-img'
                className='w-full h-[175px] rounded-lg object-cover'
              />
            ) : (
              <img
                src={formData?.banner_image ? formData?.banner_image[0] : ''}
                alt='banner-img'
                className='w-full h-[175px] rounded-lg object-cover'
              />
            )}
          </div>
          <div className='mt-2 text-sm'>
            <p onClick={() => bannerFileUploadRef?.current?.click()}>
              Edit Image
            </p>
            <input
              ref={bannerFileUploadRef}
              type='file'
              hidden
              accept='image/*'
              onChange={onBannerFileChange}
            />
          </div>
        </div>

        <label className=''>Banner Title</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3]'
          value={formData?.banner_title}
          onChange={(e) =>
            setFormData({ ...formData, banner_title: e.target.value })
          }
        />
        <label className=''>Banner Subtext</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3]'
          value={formData?.banner_subtext}
          onChange={(e) =>
            setFormData({ ...formData, banner_subtext: e.target.value })
          }
        />

        <p className='my-2'>CAMPAIGN PAGE:</p>

        <label className=''>Campaign Title</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3]'
          value={formData?.campaign_title}
          onChange={(e) =>
            setFormData({ ...formData, campaign_title: e.target.value })
          }
        />

        <label className=''>Campaign subtext</label>
        <input
          type='text'
          className='border border-[#3d3e3f] rounded-sm w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          value={formData?.campaign_subtext}
          onChange={(e) =>
            setFormData({ ...formData, campaign_subtext: e.target.value })
          }
        />

        <div className='mb-2'>
          <p className='mb-2'>Campaign video (video may not be previewed)</p>
          <div className=''>
            {videoPreview ? (
              <video
                src={videoPreview}
                controls
                className='w-full h-[175px] rounded-lg object-cover'
              />
            ) : (
              <video
                src={formData.campaign_video ? formData?.campaign_video[0] : ''}
                controls
                className='w-full h-[175px] rounded-lg object-cover'
              />
            )}

            <div className='mt-2 text-sm'>
              <p onClick={() => videoFileUploadRef?.current?.click()}>
                Edit video
              </p>
              <input
                ref={videoFileUploadRef}
                type='file'
                hidden
                accept='video/mp4,video/x-m4v,video/*'
                onChange={onVideoFileChange}
              />
            </div>
          </div>
        </div>

        <button
          onClick={editCampaignDetails}
          className='border border-[#909192] bg-[#523f3f9c] text-[#e4e0e0] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#7e5d5dab]'
        >
          {loading ? 'Loading...' : 'Confirm'}
        </button>
      </div>
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='An error occured, please check your connection'
        />
      )}
    </LocalSideModal>
  );
};

export default EditCampaign;
