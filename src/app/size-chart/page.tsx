import Header from '@/components/header/page';
import Link from 'next/link';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const SizeChart = () => {
  const topChart = [
    {
      alpha: 'S',
      chest: '39 in',
      hip: '38 in',
      sleeve: '23 in',
    },
    {
      alpha: 'M',
      chest: '43 in',
      hip: '40 in',
      sleeve: '24.5 in',
    },
    {
      alpha: 'L',
      chest: '47 in',
      hip: '45 in',
      sleeve: '25 in',
    },
    {
      alpha: 'XL',
      chest: '50 in',
      hip: '47 in',
      sleeve: '25.5 in',
    },
    {
      alpha: 'XXL',
      chest: '52 in',
      hip: '50 in',
      sleeve: '26 in',
    },
    {
      alpha: 'XXXL',
      chest: '58 in',
      hip: '56 in',
      sleeve: '26.5 in',
    },
  ];

  const pantsCharts = [
    {
      alpha: 'S',
      waist: '30 in',
      hip: '29 in',
    },
    {
      alpha: 'M',
      waist: '33 in',
      hip: '43 in',
    },
    {
      alpha: 'L',
      waist: '36 in',
      hip: '46 in',
    },

    {
      alpha: 'XL',
      waist: '39 in',
      hip: '48 in',
    },
    {
      alpha: 'XXL',
      waist: '42 in',
      hip: '52 in',
    },
    {
      alpha: 'XXXL',
      waist: '45 in',
      hip: '55 in',
    },
  ];
  return (
    <div className='w-full h-full min-h-[100vh] bg-[#dbd9d2]'>
      <Header />
      <Link href='/' className=' gap-1 flex text-sm items-center p-4'>
        <MdOutlineArrowBackIosNew size={20} />
        Back
      </Link>
      <h2 className='text-center font-semibold text-sm mt-4'>
        How to Measure for Tops and Pants
      </h2>
      <div className='p-4 text-sm space-y-2 w-full '>
        <div className=''>
          <p className='font-semibold'>1. Measure your arm length</p>
          <p>
            With elbow bent, measure from the center (back) of neck to the elbow
            and down to wrist.
          </p>
        </div>
        <div className=''>
          <p className='font-semibold'>2. Measure your chest</p>
          <p>
            Relax your arms, then measure around the fullest part of your
            chest/bust.
          </p>
        </div>
        <div className=''>
          <p className='font-semibold'>3. Measure your Waist</p>
          <p>
            Bend Slightlt to one side of your natural waist. (This will be the
            crease created from bending.) Then, stand erect and measure around
            your body at the crease point.
          </p>
        </div>

        <div className=''>
          <p className='font-semibold'>4. Measure your hips</p>
          <p>
            Stand relaxed with feet shoulder-wide apart. now measure around the
            fullest part of your hips and seat.
          </p>
        </div>
      </div>

      <div className='p-4 w-full flex flex-col items-center justify-center'>
        <h2 className='text-center font-semibold text-sm my-4'>
          Men&apos;s Top Size Chart
        </h2>

        <table className='w-full md:w-[80%]'>
          <tr className='border-y border-[#a1a1a19c] bg-[#553918d3] text-[#ecf3f3] '>
            <th className='py-2 text-sm'>Alpha Size</th>
            <th className='py-2 text-sm'>Chest</th>
            <th className='py-2 text-sm'>Hip</th>
            <th className='py-2 text-sm'>Sleeve(Arm)</th>
          </tr>
          {topChart.map((item, index) => (
            <tr
              key={index}
              className='text-center mt-3 text-xs sm:text-sm bg-[#8575637a]'
            >
              <td className='py-2 '>{item.alpha}</td>
              <td>{item.chest}</td>
              <td>{item.hip}</td>
              <td>{item.sleeve}</td>
            </tr>
          ))}
        </table>

        <h2 className='text-center font-semibold text-sm my-4'>
          Men's Pants Size Chart
        </h2>

        <table className='w-full md:w-[80%]'>
          <tr className='border-y border-[#a1a1a19c] bg-[#553918d3] text-[#ecf3f3] '>
            <th className='py-2 text-sm'>Alpha Size</th>
            <th className='py-2 text-sm'>Waist</th>
            <th className='py-2 text-sm'>Hip</th>
          </tr>

          {pantsCharts.map((item, index) => (
            <tr key={index} className='text-center mt-3 text-xs sm:text-sm'>
              <td className='py-2 bg-[#8575637a]'>{item.alpha}</td>
              <td>{item.hip}</td>
              <td>{item.waist}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default SizeChart;
