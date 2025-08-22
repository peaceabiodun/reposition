import axios from 'axios';

export const verifyTransaction = async (reference: string) => {
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.paystack.co/transaction/verify/' + reference,
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'error occured';
    throw new Error(message);
  }
};
