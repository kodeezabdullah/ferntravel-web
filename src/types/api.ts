export interface Paginated<T> {
  data: T[];
  nextCursor: string | null;
}

export interface GroupDiscountRule {
  min_people: number;
  discount_pct: number;
}

export interface Departure {
  id: string;
  departure_date: string;
  seats_total: number;
  seats_available: number;
}

export type TourStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface Tour {
  id: string;
  tour_name: string;
  cover_image_url: string | null;
  gallery_image_urls: string[];
  destination: string;
  destination_coordinates?: { lat: number; lng: number };
  duration: string;
  cost: number;
  description: string;
  operator_id: string;
  operator_name?: string;
  rating?: number;
  review_count?: number;
  status?: TourStatus;
  category_ids?: string[];
  group_discount_rules?: GroupDiscountRule[];
}

export interface Review {
  id: string;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface TourDetail extends Tour {
  itinerary?: { time: string; title: string; description: string }[];
  included?: string[];
  not_included?: string[];
  departures?: Departure[];
  reviews?: Review[];
}

export interface Operator {
  id: string;
  operator_name: string;
  bio: string;
  region: string;
  service_region: string;
  rating?: number;
  review_count?: number;
  verified?: boolean;
  cover_image_url?: string;
  tours_hosted?: number;
}

export interface OperatorDetail extends Operator {
  gallery_image_urls?: string[];
  specialties?: string[];
  languages?: string[];
  faqs?: { question: string; answer: string }[];
  reviews?: Review[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  departure_id: string;
  tour_id: string;
  tour_name: string;
  departure_date: string;
  seats_requested: number;
  status: BookingStatus;
  confirmation_code: string;
  cover_image_url: string | null;
  operator_name?: string;
  total_price?: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'tour' | 'trail';
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  profile_photo_url: string | null;
  role: 'traveler' | 'operator' | 'admin';
}

export interface MapPin {
  id: string;
  name: string;
  type: 'tour' | 'trail' | 'location';
  coordinates: { lat: number; lng: number };
  slug?: string;
}

export interface Thread {
  id: string;
  operator_id?: string;
  operator_name?: string;
  is_support?: boolean;
  last_message_preview?: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content?: string;
  attachment_url?: string;
  attachment_type?: 'image' | 'voice';
  created_at: string;
}
