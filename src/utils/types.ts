export type ProductType = {
  img: string;
  product_name: string;
  price: string;
};

export type ProductFormDataType = {
  name: string;
  price: string;
  description: string;
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
  sold_out?: boolean;
};

export type ShoppingBagType = {
  id: string;
  created_at: string;
  name: string;
  price: string;
  image: string;
  color: string;
  size: string;
};

export type CheckoutDetailsType = {
  order_details: {
    id: string;
    name: string;
    price: string;
    size: string;
    color: string;
    quantity: string;
  };

  billing_details: {
    total_amount: string;
    shipping_fee: string;
    taxes: string;
    total_paid: string;
  };
};

export type DeliveryDetailsType = {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  phone_number: string;
  shipping: 'standard' | 'free';
};
