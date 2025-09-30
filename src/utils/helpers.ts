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

/**
 * List of West African countries
 * Based on ECOWAS (Economic Community of West African States) members
 */
const WEST_AFRICAN_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Senegal',
  'Mali',
  'Ivory Coast',
  "Côte d'Ivoire",
  'Burkina Faso',
  'Niger',
  'Benin',
  'Togo',
  'Guinea',
  'Sierra Leone',
  'Liberia',
  'Mauritania',
  'Gambia',
  'Guinea-Bissau',
  'Cape Verde',
];

/**
 * Checks if a country is in West Africa
 * @param country - The country name to check
 * @returns boolean - true if country is in West Africa, false otherwise
 */
export const isWestAfricanCountry = (country: string): boolean => {
  if (!country) return false;

  // Normalize country name for comparison (case-insensitive and trim whitespace)
  const normalizedCountry = country.trim().toLowerCase();

  return WEST_AFRICAN_COUNTRIES.some(
    (westAfricanCountry) =>
      westAfricanCountry.toLowerCase() === normalizedCountry
  );
};
