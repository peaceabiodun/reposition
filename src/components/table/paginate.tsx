// import { MdArrowBackIos } from 'react-icons/md';
// import { MdArrowForwardIos } from 'react-icons/md';
// import './style.module.css';
// import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

// export type PaginateProps = ReactPaginateProps & {
//   containerClass?: string;
// };

// export function Paginate({
//   containerClass = '',
//   ...paginateProps
// }: PaginateProps) {
//   return (
//     <div className={containerClass}>
//       {paginateProps.pageCount <= 1 ? null : (
//         <div className='pagination_container'>
//           <ReactPaginate
//             previousLabel={<MdArrowBackIos size={20} color='#3d3e3f' />}
//             nextLabel={<MdArrowForwardIos size={20} color='#3d3e3f' />}
//             breakLabel={<span>..</span>}
//             marginPagesDisplayed={2}
//             containerClassName='pagination'
//             previousLinkClassName='prev_link'
//             nextLinkClassName='next_link'
//             disabledClassName='pagination__link--disabled'
//             activeClassName='pagination__link--active'
//             {...paginateProps}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
