export interface Target {
  name: string;
  price: number;
  startYear: number;
  endYear: number;
}

interface ActivityReview {
  name: string;
  startDate: string;
  endDate: string;
}

export interface EventActivity {
  id?: number;
  name?: string;
  description?: string;
  notes?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  price?: number;
  targets?: Target[];
  isReview?: boolean;
  activitiesReview?: ActivityReview[];
}
