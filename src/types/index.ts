export interface CopywritingItem {
  id: number;
  content: string;
  categoryId: number;
  moodId: number;
  wordCount: number;
  isFree: boolean;
  isOriginal: boolean;
  suggestImageStyle: string;
  usageCount: number;
  createdAt: string | Date;
  category?: CategoryItem;
  mood?: MoodItem;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

export interface MoodItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

export interface CardTemplateItem {
  id: number;
  name: string;
  previewUrl: string;
  configJson: string;
  isFree: boolean;
  category: string;
}

export interface ImageItem {
  id: number;
  url: string;
  styleTag: string;
  categoryId: number | null;
  isFree: boolean;
  source: string;
}

export interface UserInfo {
  id: number;
  openid: string;
  nickname: string;
  avatar: string;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export interface AiLogItem {
  id: number;
  userId: number;
  type: "rewrite" | "generate";
  input: string;
  output: string;
  tokenUsed: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  userId: number;
  amount: number;
  status: "pending" | "paid" | "refunded";
  transactionId: string;
  paidAt: string | null;
  createdAt: string;
}

export interface TemplateConfig {
  bgColor: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  accentColor: string;
  layout: "centered" | "left-aligned" | "bottom-heavy";
  padding: number;
  decorations: string[];
  watermark: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
