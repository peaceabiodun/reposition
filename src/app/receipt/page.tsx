'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicReceiptViewer = dynamic(() => import('./view-receipt'), {
  ssr: false,
});

const View = () => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  return <DynamicReceiptViewer />;
};
export default View;
