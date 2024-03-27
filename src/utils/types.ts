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
