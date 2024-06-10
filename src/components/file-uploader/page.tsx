'use client';
import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  ReactNode,
  Fragment,
} from 'react';
import { LuUploadCloud } from 'react-icons/lu';
import { AiOutlineDelete } from 'react-icons/ai';
import { supabase } from '@/lib/supabase';
import ErrorModal from '../error-modal/page';
import { Cloudinary } from '@cloudinary/url-gen';

type ActionType = 'create' | 'edit';
export type FileUploaderProps = {
  label?: ReactNode;
  setFileUrls: (files: string[]) => void;
  fileUrls: string[];
  fileType?: 'image' | 'document' | 'video';
  disabled?: boolean;
  isMultiple?: boolean;
  className?: string;
  loading?: boolean;
};
const getFileSize = (size: number) => {
  let fileSize;

  if (size < 1024) {
    fileSize = size + ' bytes';
  } else if (size < 1024 * 1024) {
    fileSize = (size / 1024).toFixed(2) + ' kb';
  } else if (size < 1024 * 1024 * 1024) {
    fileSize = (size / (1024 * 1024)).toFixed(2) + ' mb';
  }

  return fileSize;
};

export function FileUploader({
  fileType = 'image',
  fileUrls,
  label,
  setFileUrls,
  disabled,
  isMultiple,
  className = '',
  loading,
}: FileUploaderProps) {
  const [percent, setPercent] = useState(0);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [allowDrop, setAllowDrop] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[] | null>(null);
  const [type, setType] = useState<ActionType>('create');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    },
    url: {
      secure: true,
    },
  });
  useEffect(() => {
    if (!loading && fileUrls?.length) {
      setType('edit');
    }
  }, [loading]);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files: inputFiles } = e.target;
    if (inputFiles?.length) {
      setHasUploaded(false);
      if (isMultiple) {
        const newFiles = Array.from(inputFiles);
        const allFiles = files ? [...files, ...newFiles] : newFiles;
        setFiles(allFiles);
        await uploadImg(allFiles);
        setFilesToUpload(newFiles);
      } else {
        setFiles([inputFiles[0]]);
        setFilesToUpload([inputFiles[0]]);
        await uploadImg([inputFiles[0]]);
      }
    }
  };

  const handleFileDrop = async (e: any) => {
    if (allowDrop && !uploading && !loading) {
      e.preventDefault();
      const inputFiles: File[] = e.dataTransfer.files;
      if (inputFiles.length) {
        setHasUploaded(false);
        if (isMultiple) {
          const newFiles = Array.from(inputFiles);
          const allFiles = files ? [...files, ...newFiles] : newFiles;
          setFiles(allFiles);
          setFilesToUpload(allFiles);
          await uploadImg(allFiles);
        } else {
          if (inputFiles.length > 1) {
            alert('Only the first file was uploaded!');
          }
          setFiles([inputFiles[0]]);
          setFilesToUpload([inputFiles[0]]);
          await uploadImg([inputFiles[0]]);
        }
      }
    }
  };

  const handleDragOver = (e: any) => {
    if (allowDrop) e.preventDefault();
  };
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data.secure_url;
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
      setShowErrorMessage(true);
      throw error;
    }
  };

  const uploadImg = async (filesToUpload: File[]) => {
    if (!filesToUpload) return;
    setUploading(true);
    setPercent(0);
    if (filesToUpload) {
      let uploadedFiles: string[] = [];
      try {
        const requests = filesToUpload.map((f) => uploadSingleFile(f));
        uploadedFiles = await Promise.all(requests);
        setHasUploaded(true);
        setFileUrls([...(fileUrls ?? []), ...uploadedFiles]);
        setPercent(100);
      } catch (error: any) {
        setFiles([]);
        uploadedFiles = [];
        alert(error);
      }
    }
  };

  const fileNames = files?.map((file) => file.name);

  const removeImage = async () => {
    setFiles([]);
    setFileUrls([]);
    setHasUploaded(false);
    setUploading(false);
  };

  useEffect(() => {
    if (uploading) {
      setAllowDrop(false);
    } else {
      setPercent(0);
      setAllowDrop(true);
    }
  }, [uploading]);

  useEffect(() => {
    if (percent === 100) {
      setUploading(false);
    }
  }, [percent, uploading]);

  return (
    <Fragment>
      {type !== 'edit' ? (
        <div className={`${className} file-uploader`}>
          {label}
          <div
            className={`file-uploader_body ${
              (uploading ?? loading) && 'file-uploader_body_not_uploading '
            }`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={() => {
              if (!uploading && !loading) fileUploadRef?.current?.click();
            }}
          >
            {loading ? (
              <div className='body_text'>Loading image...</div>
            ) : (
              <Fragment>
                <LuUploadCloud size={20} />
                <div className='body_text'>
                  <p className='text'> Drop your images here... or </p>
                  <button
                    disabled={uploading}
                    className={`${uploading ? 'button_uploading' : 'button'}`}
                  >
                    browse
                  </button>
                </div>
              </Fragment>
            )}
          </div>
          {files?.length ? (
            <div className='file-uploader_multiple'>
              <div className='file-uploader_file'>
                <div
                  className='file-uploader_file_main'
                  style={{
                    width: files.length > 1 ? '80%' : '100%',
                  }}
                >
                  <div className='file-uploader_file_main_inner '>
                    <div
                      style={{
                        backgroundImage:
                          fileType === 'image'
                            ? `url(${URL.createObjectURL(files[0])})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {fileType !== 'image' && (
                        <span style={{ fontSize: '2rem' }}>📄</span>
                      )}
                    </div>
                  </div>
                  <div className='duration_box'>
                    <label>{files?.[0].name}</label>
                    <div className='text'>
                      <span>{getFileSize(files?.[0].size)}</span>
                      <div />
                      {uploading ? (
                        <span>Uploading...</span>
                      ) : (
                        <span>Upload Complete</span>
                      )}
                    </div>
                  </div>
                  {hasUploaded && files.length === 1 && (
                    <div
                      role='button'
                      onClick={removeImage}
                      className='has_uploaded'
                    >
                      <AiOutlineDelete size={22} />
                    </div>
                  )}
                  {uploading && (
                    <span className='uploading_text'>{percent}%</span>
                  )}
                </div>

                {uploading && (
                  <div className='is_uploading'>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        transition: 'width .8s',
                      }}
                    />
                  </div>
                )}
              </div>
              {files?.length > 1 && (
                <div className=' flex flex-col md:flex-row w-full gap-3'>
                  <div className='multiple_wrapper'>
                    + {files?.length - 1} more
                  </div>
                  <div className='has_uploaded_wrapper'>
                    <div
                      role='button'
                      onClick={removeImage}
                      className='has_uploaded'
                    >
                      <AiOutlineDelete />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span />
          )}
        </div>
      ) : (
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => fileUploadRef?.current?.click()}
          style={{
            backgroundImage:
              fileType === 'image' ? `url(${fileUrls?.[0]})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(1, 11, 25, 0.65)',
          }}
          className={`${className} file-uploader_edit`}
        >
          {/* <p>
            {uploading
              ? 'Loading...'
              : ` ${fileType} 
             `}
          </p> */}
          {fileType !== 'image' && <span style={{ fontSize: '2rem' }}>📄</span>}
        </div>
      )}

      <input
        ref={fileUploadRef}
        type='file'
        hidden
        multiple={isMultiple}
        accept='image/*,video/mp4,video/x-m4v,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf'
        // accept={
        //   fileType === 'image'
        //     ? 'image/*'
        //     : fileType === 'video'
        //     ? 'video/*'
        //     : 'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf'
        // }
        onChange={onFileChange}
        disabled={disabled}
      />
      {showErrorMessage && (
        <ErrorModal
          show={showErrorMessage}
          onClose={() => setShowErrorMessage(false)}
          description='Error uploading file:The image already exists'
        />
      )}
    </Fragment>
  );
}
