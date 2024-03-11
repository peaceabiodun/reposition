'use-client';
// import React, {
//   useRef,
//   useState,
//   useEffect,
//   ChangeEvent,
//   useMemo,
//   ReactNode,
//   Fragment,
// } from 'react';
// import UploadIcon from '../assets/images/file-uploader/upload.svg';
// import DeleteIcon from '../assets/images/file-uploader/delete.svg';
// import { toast } from 'react-toastify';
// import { ToastMessage } from '../toast';
// import 'assets/styles/file-uploader.scss';

// type ActionType = 'create' | 'edit';
// export type FileUploaderProps = {
//   label?: ReactNode;
//   setFileUrls: (files: string[]) => void;
//   fileUrls: string[];
//   fileType?: 'image' | 'document';
//   disabled?: boolean;
//   token: string;
//   isMultiple?: boolean;
//   className?: string;
//   loading?: boolean;
// };
// const getFileSize = (size: number) => {
//   let fileSize;

//   if (size < 1024) {
//     fileSize = size + ' bytes';
//   } else if (size < 1024 * 1024) {
//     fileSize = (size / 1024).toFixed(2) + ' kb';
//   } else if (size < 1024 * 1024 * 1024) {
//     fileSize = (size / (1024 * 1024)).toFixed(2) + ' mb';
//   }

//   return fileSize;
// };

// export function FileUploader({
//   fileType = 'image',
//   fileUrls,
//   label,
//   setFileUrls,
//   disabled,
//   token,
//   isMultiple,
//   className = '',
//   loading,
// }: FileUploaderProps) {
//   const [percent, setPercent] = useState(0);
//   const [hasUploaded, setHasUploaded] = useState(false);
//   const [allowDrop, setAllowDrop] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [files, setFiles] = useState<File[] | null>(null);
//   const [filesToUpload, setFilesToUpload] = useState<File[] | null>(null);
//   const [type, setType] = useState<ActionType>('create');

//   useEffect(() => {
//     if (!loading && fileUrls?.length) {
//       setType('edit');
//     }
//   }, [loading]);

//   const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { files: inputFiles } = e.target;
//     if (inputFiles?.length) {
//       setHasUploaded(false);
//       if (isMultiple) {
//         const newFiles = Array.from(inputFiles);
//         const allFiles = files ? [...files, ...newFiles] : newFiles;
//         setFiles(allFiles);
//         setFilesToUpload(newFiles);
//       } else {
//         setFiles([inputFiles[0]]);
//         setFilesToUpload([inputFiles[0]]);
//       }
//     }
//   };

//   const handleFileDrop = (e: any) => {
//     if (allowDrop && !uploading && !loading) {
//       e.preventDefault();
//       const inputFiles: File[] = e.dataTransfer.files;
//       if (inputFiles.length) {
//         setHasUploaded(false);
//         if (isMultiple) {
//           const newFiles = Array.from(inputFiles);
//           const allFiles = files ? [...files, ...newFiles] : newFiles;
//           setFiles(allFiles);
//         } else {
//           if (inputFiles.length > 1) {
//             toast(
//               <ToastMessage
//                 type='warn'
//                 message='Only the first file was uploaded!'
//               />
//             );
//           }
//           setFiles([inputFiles[0]]);
//           setFilesToUpload([inputFiles[0]]);
//         }
//       }
//     }
//   };

//   const handleDragOver = (e: any) => {
//     if (allowDrop) e.preventDefault();
//   };
//   const fileUploadRef = useRef<HTMLInputElement | null>(null);

//   const uploadSingleFile = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const numberOfFiles = filesToUpload?.length ?? 1;
//       const formData = new FormData();
//       formData.append('file', file);

//       const xhr = new XMLHttpRequest();
//       xhr.open('POST', 'https://file-api.getfoodcourt.com/upload');
//       xhr.setRequestHeader('Authorization', `Bearer ${token}`);

//       // TODO :: refactor progress
//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round(
//             (event.loaded * (100 / numberOfFiles)) / event.total
//           );
//           setPercent(progress);
//         }
//       };

//       xhr.onload = async () => {
//         const data = JSON.parse(xhr.responseText);
//         if (data) {
//           resolve(data.url);
//         }
//       };

//       xhr.onerror = () => {
//         reject(Error('Problem uploading image. Contact tech support'));
//       };

//       xhr.send(formData);
//     });
//   };
//   const uploadImg = async () => {
//     setUploading(true);
//     if (filesToUpload) {
//       let uploadedFiles: string[] = [];
//       try {
//         const requests = filesToUpload.map((f) => uploadSingleFile(f));
//         uploadedFiles = await Promise.all(requests);
//         setHasUploaded(true);
//         setPercent(100);
//       } catch (error: any) {
//         setFiles([]);
//         uploadedFiles = [];
//         toast(<ToastMessage type='error' message={error} />);
//       } finally {
//         setFileUrls(uploadedFiles);
//         setFilesToUpload([]);
//       }
//     }
//   };

//   const getImgSrc = useMemo(() => {
//     if (files?.length) {
//       setUploading(true);
//       uploadImg();
//       return URL.createObjectURL(files?.[0]);
//     }
//     return '';
//   }, [files]);

//   const removeImage = () => {
//     setFiles([]);
//     setFileUrls([]);
//   };

//   useEffect(() => {
//     if (uploading) {
//       setAllowDrop(false);
//     } else {
//       setPercent(0);
//       setAllowDrop(true);
//     }
//   }, [uploading]);

//   useEffect(() => {
//     if (percent === 100) {
//       setUploading(false);
//     }
//   }, [percent, uploading]);

//   return (
//     <>
//       {type !== 'edit' ? (
//         <div className={`${className} file-uploader`}>
//           {label}
//           <div
//             className={`file-uploader_body ${
//               (uploading || loading) && 'file-uploader_body_not_uploading '
//             }`}
//             onDrop={handleFileDrop}
//             onDragOver={handleDragOver}
//             onClick={() => {
//               if (!uploading && !loading) fileUploadRef?.current?.click();
//             }}
//           >
//             {loading ? (
//               <div className='body_text'>Loading image...</div>
//             ) : (
//               <Fragment>
//                 <UploadIcon />
//                 <div className='body_text'>
//                   <p className='text'> Drop your file here... or </p>
//                   <button
//                     disabled={uploading}
//                     className={`${uploading ? 'button_uploading' : 'button'}`}
//                   >
//                     browse
//                   </button>
//                 </div>
//               </Fragment>
//             )}
//           </div>
//           {files?.length ? (
//             <div className='file-uploader_multiple'>
//               <div className='file-uploader_file'>
//                 <div
//                   className='file-uploader_file_main'
//                   style={{
//                     width: files.length > 1 ? '80%' : '100%',
//                   }}
//                 >
//                   <div className='file-uploader_file_main_inner'>
//                     <div
//                       style={{
//                         backgroundImage:
//                           fileType === 'image' ? `url(${getImgSrc})` : 'none',
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                       }}
//                     >
//                       {fileType !== 'image' && (
//                         <span style={{ fontSize: '2rem' }}>📄</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className='duration_box'>
//                     <label>{files?.[0].name}</label>
//                     <div className='text'>
//                       <span>{getFileSize(files?.[0].size)}</span>
//                       <div />
//                       {uploading ? (
//                         <span>Uploading...</span>
//                       ) : (
//                         <span>Upload Complete</span>
//                       )}
//                     </div>
//                   </div>
//                   {hasUploaded && files.length === 1 && (
//                     <div
//                       role='button'
//                       onClick={removeImage}
//                       className='has_uploaded'
//                     >
//                       <DeleteIcon />
//                     </div>
//                   )}
//                   {uploading && (
//                     <span className='uploading_text'>{percent}%</span>
//                   )}
//                 </div>

//                 {uploading && (
//                   <div className='is_uploading'>
//                     <div
//                       style={{
//                         height: '100%',
//                         width: `${percent}%`,
//                         transition: 'width .8s',
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>
//               {files?.length > 1 && (
//                 <Fragment>
//                   <div className='multiple_wrapper'>
//                     + {files?.length - 1} more
//                   </div>
//                   <div className='has_uploaded_wrapper'>
//                     <div
//                       role='button'
//                       onClick={removeImage}
//                       className='has_uploaded'
//                     >
//                       <DeleteIcon />
//                     </div>
//                   </div>
//                 </Fragment>
//               )}
//             </div>
//           ) : (
//             <span />
//           )}
//         </div>
//       ) : (
//         <div
//           onDrop={handleFileDrop}
//           onDragOver={handleDragOver}
//           onClick={() => fileUploadRef?.current?.click()}
//           style={{
//             backgroundImage:
//               fileType === 'image' ? `url(${fileUrls?.[0]})` : 'none',
//             backgroundPosition: 'center',
//             backgroundSize: 'cover',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: 'rgba(1, 11, 25, 0.65)',
//           }}
//           className={`${className} file-uploader_edit`}
//         >
//           <p>
//             {uploading
//               ? 'Loading...'
//               : `Update ${fileType}
//              `}
//           </p>
//           {fileType !== 'image' && <span style={{ fontSize: '2rem' }}>📄</span>}
//         </div>
//       )}

//       <input
//         ref={fileUploadRef}
//         type='file'
//         hidden
//         multiple={isMultiple}
//         accept={
//           fileType === 'image'
//             ? 'image/*'
//             : 'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf'
//         }
//         onChange={onFileChange}
//         disabled={disabled}
//       />
//     </>
//   );
// }