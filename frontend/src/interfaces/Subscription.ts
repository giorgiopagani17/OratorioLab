export interface Subscription {
  id: number;
  userId: number;
  userName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  paymentStatus: string;
  registrationDate: string;
  subscriptionType: string;
  itemId: number;
  itemName: string;
  targetName?: string;
}
