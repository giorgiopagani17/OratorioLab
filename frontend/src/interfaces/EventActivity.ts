export interface Target {
  name: string;
  price: number;
  startYear: number;
  endYear: number;
}

export interface EventActivity {
  id: number;
  name: string;
  description: string;
  notes: string;
  startDate: string;
  endDate: string;
  image: string;
  price?: number;
  targets?: Target[];
}
