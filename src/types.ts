export type ExamType = 'jee' | 'neet';

export interface PlanFeature {
  text: string;
  isHighlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  price: string;
  originalPrice: string;
  discount: string;
  paymentType: string;
  ctaText: string;
  features: PlanFeature[];
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface ComparisonRow {
  feature: string;
  otherCreators: boolean;
  otherCoaching: boolean;
  ourPlatform: boolean;
  note?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  socials: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  featured?: boolean;
}

export interface FounderItem {
  name: string;
  college: string;
  role: string;
  avatar: string;
  bio: string;
  socials: {
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export interface ResourceItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  actionText: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
