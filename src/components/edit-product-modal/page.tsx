import { FileUploader } from '../file-uploader/page';
import LocalSideModal from '../side-modal/page';

type EditModalProps = {
  show: boolean;
  onClose: () => void;
};
const EditProductModal = ({ show, onClose }: EditModalProps) => {
  return (
    <LocalSideModal
      isOpen={show}
      onRequestClose={onClose}
      title='Edit Product Details'
    >
      <div className='text-sm mt-4'>
        <label className=''>Product Name</label>
        <input
          type='text'
          className='border border-[#3d3e3f] w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='e.g Utility Jacket'
        />

        <label className=''>Product Price</label>
        <input
          type='text'
          className='border border-[#3d3e3f] w-full p-2 my-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='$100'
        />

        <label className=''>Product Description</label>
        <textarea
          className='border border-[#3d3e3f] w-full h-[160px] my-2 p-2 outline-none bg-transparent placeholder:text-[#9fa1a3] '
          placeholder='Describe your product'
        />

        <label className=''>Product Image(s)</label>
        <FileUploader
          fileUrls={[]}
          setFileUrls={() => []}
          token=''
          className='w-full text-sm'
          isMultiple
        />
      </div>
    </LocalSideModal>
  );
};

export default EditProductModal;
