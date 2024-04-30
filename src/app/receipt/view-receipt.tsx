'use client';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const Receipt = () => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#000000',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      color: '#edeffe',
    },
  });
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Text>~ Created with react-pdffffffffffff ~</Text>
        </View>
        <View style={styles.section}>
          <Text>section 2fsdfsd</Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFView = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <PDFViewer>
      <Receipt />
    </PDFViewer>
  );
};

export default PDFView;
