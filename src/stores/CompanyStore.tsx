import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/config/axios/axiosInstance";
import useUserStore from "./userStore";

// interface Company {
//   id: string;
//   name: string;
//   logo?: string;
//   created_at?: string;
// }
const useCompany = create(
  persist(
    (set, get) => ({
      // State
      allCompanies: [],
      filteredCompanies: [],

      userComp: null,
      searchTerm: "",
      loading: false,

      // Setters
      setAllCompanies: (companies) => set({ allCompanies: companies }),
      setFilteredCompanies: (companies) =>
        set({ filteredCompanies: companies }),

      setUserComp: (comp) => set({ userComp: comp }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setLoading: (loading) => set({ loading }),

      // Fetch all companies (with optional search)
      fetchCompanies: async (search = "") => {
        set({ loading: true });
        try {
          const response = await axiosInstance.get(
            `/organizations/all-companies/?search=${search}`,
          );
          const companies = response.data.results;
          set({
            allCompanies: companies,
            filteredCompanies: companies,
          });
        } catch (err) {
          console.error("Error fetching companies", err);
        } finally {
          set({ loading: false });
        }
      },

      // Fetch current user's company
      fetchUserCompany: async () => {
        const { user, userComp, setUserComp } = useUserStore.getState();
        try {
          if (user?.is_staff && userComp?.id) {
            const response = await axiosInstance.get(`/company/`);
            if (response.data) set({ userComp: response.data });
          } else {
            const response = await axiosInstance.get(`/company/`);
            const comp = response.data?.results?.[0] || null;

            if (comp) set({ userComp: comp });
          }
        } catch (err) {
          console.error("Error fetching user company:", err);
        }
      },

      // Search logic
      handleSearchChange: (search) => {
        const { fetchCompanies, allCompanies } = get();
        set({ searchTerm: search });

        if (search) {
          fetchCompanies(search);
        } else {
          set({ filteredCompanies: allCompanies });
        }
      },

      // Reset all
      resetCompanyStore: () =>
        set({
          allCompanies: [],
          filteredCompanies: [],
          userComp: null,
          searchTerm: "",
          loading: false,
        }),
      // Init
      initializeCompany: async () => {
        const fetchUserCompany = get().fetchUserCompany;
        await fetchUserCompany();
      },
      // set({
      //   allCompanies: [],
      //   filteredCompanies: [],
      //   userComp: null,
      //   searchTerm: "",
      //   loading: false,
      // }),
    }),
    {
      name: "company-storage", // Key in localStorage
      partialize: (state) => ({
        allCompanies: state.allCompanies,
        filteredCompanies: state.filteredCompanies,
        searchTerm: state.searchTerm,
      }),
    },
  ),
);

export default useCompany;
