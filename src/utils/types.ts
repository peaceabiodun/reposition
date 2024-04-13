export type ProductType = {
  img: string;
  product_name: string;
  price: string;
};

export type ProductFormDataType = {
  name: string;
  price: string;
  description: string;
  weight: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
};

export type ProductDetailType = {
  id: string;
  created_at: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  user_id: string;
  sold_out: boolean;
  weight: number;
};

export type ShoppingBagType = {
  id: string;
  created_at: string;
  name: string;
  price: string;
  image: string;
  color: string;
  size: string;
  weight: number;
  user_email: string;
  user_id: string;
};

export type DeliveryDetailsType = {
  id?: string;
  detail_id?: string;
  created_at?: string;
  user_email: string;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  phone_number: string;
};

export type PlacedOrderDetailsType = {
  order_details: {
    id: string;
    name: string;
    price: string;
    size: string;
    color: string;
    quantity: string;
  };
  delivery_details: DeliveryDetailsType;
  billing_details: {
    total_amount_paid: string;
    shipping_fee: string;
    taxes: string;
    discount?: string;
    shipping: 'standard' | 'free';
  };
};
