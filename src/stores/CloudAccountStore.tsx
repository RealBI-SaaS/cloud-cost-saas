// stores/cloudAccountsStore.js

import { create } from "zustand";
import axiosInstance from "@/config/axios/axiosInstance";

interface CloudAccount {
  id: string;
  account_name: string;
  // Add other fields as needed
}

interface CostData {
  service_name?: string;
  day?: string;
  total_usage?: number;
  total_cost?: number;
}

interface CloudAccountsState {
  accounts: CloudAccount[];
  currentAccount: CloudAccount | null;
  costOverTime: CostData[];
  costByService: CostData[];
  costByServicePerDay: CostData[];
  loading: boolean;
  error: string | null;

  fetchAccounts: (company_id: string) => Promise<void>;
  fetchCostOverTime: () => Promise<void>;
  fetchCostByService: () => Promise<void>;
  fetchCostByServicePerDay: () => Promise<void>;

  setCurrentAccount: (account: CloudAccount) => void;

  fetchCosts: () => Promise<void>;
}

export const useCloudAccountsStore = create<CloudAccountsState>((set, get) => ({
  accounts: [],
  currentAccount: null,
  costOverTime: [],
  costByService: [],
  costByServicePerDay: [],
  loading: false,
  error: null,

  fetchAccounts: async (company_id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${company_id}/cloud-accounts/`,
      );
      const accounts = res.data.results || [];
      set({ accounts, loading: false });

      // Auto-select first account if none selected
      if (!get().currentAccount && accounts.length > 0) {
        set({ currentAccount: accounts[0] });
      }
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "Failed to fetch accounts", loading: false });
    }
  },

  fetchCostOverTime: async () => {
    const currentAccount = get().currentAccount;
    if (!currentAccount) return;
    console.log("sretw", currentAccount);

    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/data/cost/region/${currentAccount.id}/`,
      );
      console.log(res.data);
      set({ costOverTime: res.data || [], loading: false });
    } catch (err: any) {
      console.error("fetchCostOverTime error", err);
      set({
        error: err.message || "Failed to fetch cost over time",
        loading: false,
      });
    }
  },

  fetchCostByService: async () => {
    const currentAccount = get().currentAccount;
    if (!currentAccount) return;

    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/data/cost/service/${currentAccount.id}/`,
      );
      set({ costByService: res.data || [], loading: false });
    } catch (err: any) {
      console.error("fetchCostByService error", err);
      set({
        error: err.message || "Failed to fetch cost by service",
        loading: false,
      });
    }
  },

  fetchCostByServicePerDay: async () => {
    const currentAccount = get().currentAccount;
    if (!currentAccount) return;

    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/data/cost/service-day/${currentAccount.id}/`,
      );
      set({ costByServicePerDay: res.data || [], loading: false });
    } catch (err: any) {
      console.error("fetchCostByServicePerDay error", err);
      set({
        error: err.message || "Failed to fetch cost by service per day",
        loading: false,
      });
    }
  },

  setCurrentAccount: (account) => {
    set({ currentAccount: account });
  },

  fetchCosts: async () => {
    // Fetch all cost-related data for the current account
    await Promise.all([
      get().fetchCostOverTime(),
      get().fetchCostByService(),
      get().fetchCostByServicePerDay(),
    ]);
  },
}));

export default useCloudAccountsStore;
