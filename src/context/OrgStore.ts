import { create } from "zustand";
import { useEffect } from "react";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../axios/axiosInstance";
import {
  get_users_orgs,
  get_user_comp,
  fetchCompOrgs,
} from "../utils/org/fetchers";
import useUserStore from "./userStore";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  company: string;
}

interface Company {
  id: string;
  name: string;
}

interface Navigation {
  id: string;
  name: string;
}

interface OrgState {
  userOrgs: Organization[];
  loading: boolean;
  currentOrg: Organization | null;
  userComp: Company | null;
  orgsNext: string | null;
  orgsPrevious: string | null;
  navigations: Navigation[];
  isInitialized: boolean;
  setLoading: (loading: boolean) => void;
  setCurrentOrg: (org: Organization | null) => void;
  setUserOrgs: (orgs: Organization[]) => void;
  setUserComp: (comp: Company | null) => void;
  fetchUserOrganizations: (url?: string) => Promise<void>;
  createOrganization: (orgName: string) => Promise<string | void>;
  fetchNavigations: () => Promise<void>;
  fetchUserCompany: () => Promise<void>;
  initialize: () => Promise<void>;
  reset: () => void;
}

const useOrgStore = create<OrgState>()(
  persist(
    (set, get) => ({
      userOrgs: [],
      loading: false,
      currentOrg: null,
      userComp: null,
      orgsNext: null,
      orgsPrevious: null,
      navigations: [],
      isInitialized: false,

      setLoading: (loading) => set({ loading }),
      setCurrentOrg: (org) => set({ currentOrg: org }),
      setUserOrgs: (orgs) => set({ userOrgs: orgs }),
      setUserComp: (comp) => set({ userComp: comp }),

      fetchNavigations: async () => {
        const { currentOrg, setLoading } = get();
        if (!currentOrg) return;

        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/organizations/${currentOrg.id}/navigation/`,
          );
          set({ navigations: response.data.results });
        } catch (err) {
          console.error("Error fetching navigations", err);
        } finally {
          setLoading(false);
        }
      },

      fetchUserCompany: async () => {
        const { userComp, setUserComp } = get();
        const user = useUserStore.getState().user;

        if (user.is_staff) {
          const response = await axiosInstance.get(
            `/organizations/company/${userComp?.id}/`,
          );
          if (response.data) {
            setUserComp(response.data);
          }
          return;
        }

        try {
          const response = await get_user_comp();
          const comp = response.data?.results || [];
          setUserComp(comp[0]);
        } catch (err) {
          console.error("Error fetching company data:", err);
        }
      },

      fetchUserOrganizations: async (url = "/organizations/organization/") => {
        const { currentOrg, userComp, setUserOrgs, setCurrentOrg, setLoading } =
          get();
        const user = useUserStore.getState().user;

        try {
          let organizations = [];
          if (user.is_staff && currentOrg?.id) {
            const response = await fetchCompOrgs(userComp?.id);
            organizations = response || [];
          } else {
            let next_list_url = url;
            while (next_list_url) {
              const response = await get_users_orgs(next_list_url);
              const results = response.data?.results || [];
              organizations.push(...results);
              next_list_url = response.data.next;
            }
          }

          setUserOrgs(organizations);
          if (organizations.length > 0) {
            const matchedOrg = organizations.find(
              (org) => org.id === currentOrg?.id,
            );
            setCurrentOrg(matchedOrg || organizations[0]);
          }
        } catch (err) {
          console.error("Error fetching organization data:", err);
        } finally {
          setLoading(false);
        }
      },

      createOrganization: async (orgName) => {
        const { userComp, fetchUserOrganizations } = get();

        if (!userComp) {
          return "No company to create the organization in! Create one first.";
        }

        try {
          const response = await axiosInstance.post(
            "/organizations/organization/",
            { name: orgName, company: userComp.id },
          );

          if (response.status === 201) {
            await fetchUserOrganizations();
          } else {
            throw new Error("Failed to create company");
          }
        } catch (error) {
          console.error("Error creating company:", error);
          throw error;
        }
      },

      initialize: async () => {
        const {
          setLoading,
          fetchUserCompany,
          fetchUserOrganizations,
          fetchNavigations,
          reset,
        } = get();
        const user = useUserStore.getState().user;

        if (!user) {
          reset();
          set({ isInitialized: true });
          return;
        }

        if (!user.is_staff || get().userComp) {
          setLoading(true);
          await fetchUserCompany();
          await fetchUserOrganizations();
        }
        set({ isInitialized: true });
      },

      reset: () => {
        set({
          userOrgs: [],
          loading: false,
          currentOrg: null,
          userComp: null,
          orgsNext: null,
          orgsPrevious: null,
          navigations: [],
          isInitialized: false,
        });
      },
    }),
    {
      name: "org-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userOrgs: state.userOrgs,
        currentOrg: state.currentOrg,
        userComp: state.userComp,
        navigations: state.navigations,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);

// Custom hook for initialization
export const useOrgInitializer = () => {
  const { currentOrg, initialize, fetchNavigations, isInitialized } =
    useOrgStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (currentOrg) {
      fetchNavigations();
    }
  }, [currentOrg]);
};

export default useOrgStore;
