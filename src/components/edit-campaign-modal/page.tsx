import { useState } from 'react';
import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';
import { supabase } from '@/lib/supabase';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
};

type CampaignFormDataType = {
  banner_image: string[];
  banner_title: string;
  banner_subtext: string;
  campaign_title: string;
  campaign_subtext: string;
  campaign_video: string[];
};
const EditCampaign = ({ show, onClose }: EditModalProps) => {
  const [formData, setFormData] = useState({} as CampaignFormDataType);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const editCampaignDetails = async () => {
    setLoading(true);
    const payload = {};
    try {
      const { data, error } = await supabase.from('products').update(payload);
      //.eq('id', selectedProduct?.id);
      console.log(data);
      onClose();
    } catch {
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalSideModal
      isOpen={show}
      onRequestClose={onClose}
      title='Edit Campaign Details'
    >
      <div className='text-sm mt-4'>
        <div className='my-2'>
          <p className='mb-2'>Campaign Banner Image (1 image)</p>
          <FileUploader
            fileUrls={formData.banner_image}
            setFileUrls={(img) =>
              setFormData({ ...formData, banner_image: img })
            }
          />
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
          <p className='mb-2'>Campaign video</p>
          <div className='flex flex-col gap-3'>
            <FileUploader
              fileUrls={formData.campaign_video}
              setFileUrls={(vid) =>
                setFormData({ ...formData, campaign_video: vid })
              }
            />
          </div>
        </div>

        <button className='border border-[#909192] bg-[#523f3f9c] text-[#e4e0e0] rounded-sm p-2 mt-6 mb-9 text-sm w-full h-[40px] hover:bg-[#7e5d5dab]'>
          {loading ? 'Loading...' : 'Confirm'}
        </button>
      </div>
    </LocalSideModal>
  );
};

export default EditCampaign;
