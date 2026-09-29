export type TradeType = 'juice_chai' | 'chaat_snacks' | 'fruits_veg';

export type SolarOption = '250w_800wh' | '400w_1200wh';

export interface SmartModule {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
}

export interface CartConfigState {
  tradeType: TradeType;
  solarOption: SolarOption;
  selectedModules: string[];
  contactNumber: string;
  vendorName: string;
  city: string;
  stateName: string;
}

export interface SavedOrder {
  id: string;
  userId: string;
  tradeType: string;
  solarArray: string;
  selectedModules: string[];
  basePrice: number;
  subsidyAmount: number;
  finalPrice: number;
  depositPaid: number;
  phoneNumber: string;
  status: 'reserved' | 'subsidy_verifying' | 'manufacturing' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface SoundboxTrackItem {
  id: string;
  title: string;
  hindiTitle: string;
  prompt: string;
  audioType: 'lyria_clip' | 'lyria_pro' | 'soundbox_call';
  audioData?: string;
  category: string;
}
