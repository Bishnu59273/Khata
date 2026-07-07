export interface Shop {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  gstin: string | null;
  created_at: string;
}

export interface User {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  email: string;
}

export interface JwtPayload {
  sub: string;
  shopId: string;
  shopName: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: { id: string; name: string; email: string };
  shop: { id: string; name: string; address: string | null; phone: string | null; gstin: string | null };
}
