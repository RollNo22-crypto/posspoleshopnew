export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vertical: string;
  image_url: string;
  status: 'active' | 'delisted';
  specifications: Record<string, string>;
  features: string[];
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface RFQRequest {
  id: string;
  user_id: string;
  products: {
    id: string;
    quantity: number;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
    full_name: string;
  };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}