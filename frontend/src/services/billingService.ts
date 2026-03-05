import { api } from "./api";

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export const billingService = {
  createCheckoutSession: async (priceId: string): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>("/billing/checkout", { priceId });
    return response.data;
  },
  
  createPortalSession: async (): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>("/billing/portal");
    return response.data;
  },
};
