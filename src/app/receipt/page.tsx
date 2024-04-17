'use client';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const Receipt = () => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });
  return (
    <Document>
      <Page size='A4' style={styles.page}></Page>
    </Document>
  );
};

export default Receipt;
