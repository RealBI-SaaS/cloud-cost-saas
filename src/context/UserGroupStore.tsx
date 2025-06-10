
// stores/useUserGroupStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/lib/axiosInstance'; // adjust the import path as needed

export interface UserGroup {
  id: string;
  name: string;
  users: string[]; // or User[] depending on your use case
  organization: string;
  created_at: string;
  updated_at: string;
}

interface UserGroupStore {
  groups: UserGroup[];
  loading: boolean;
  error: string | null;

  fetchGroups: (orgId: string) => Promise<void>;
  createGroup: (orgId: string, name: string, userIds:string[]) => Promise<void>;
  updateGroup: (groupId: string, name: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addUserToGroup: (groupId: string, userId: string) => Promise<void>;
  removeUserFromGroup: (groupId: string, userId: string) => Promise<void>;
}

export const useUserGroupStore = create<UserGroupStore>()(
  persist(
    (set, get) => ({
      groups: [],
      loading: false,
      error: null,

      fetchGroups: async (orgId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axiosInstance.get(`/organizations/${orgId}/groups`);
          set({ groups: data, loading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message, loading: false });
        }
      },

     createGroup: async (orgId, name, userIds = []) => {
      try {
        const payload = { name, users: userIds }; // Adjust key if backend uses a different one
        const { data: newGroup } = await axiosInstance.post(`/organizations/${orgId}/groups`, payload);
        set({ groups: [...get().groups, newGroup] });
      } catch (err: any) {
        set({ error: err.response?.data?.detail || err.message });
      }
    },
      updateGroup: async (groupId, name) => {
        try {
          const { data: updatedGroup } = await axiosInstance.put(`/groups/${groupId}`, { name });
          set({
            groups: get().groups.map((g) => (g.id === groupId ? updatedGroup : g)),
          });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message });
        }
      },

      deleteGroup: async (groupId) => {
        try {
          await axiosInstance.delete(`/groups/${groupId}`);
          set({ groups: get().groups.filter((g) => g.id !== groupId) });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message });
        }
      },

      addUserToGroup: async (groupId, userId) => {
        try {
          const { data: updatedGroup } = await axiosInstance.post(`/groups/${groupId}/add-user/`, {
            user_id: userId,
          });
          set({
            groups: get().groups.map((g) => (g.id === groupId ? updatedGroup : g)),
          });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message });
        }
      },

      removeUserFromGroup: async (groupId, userId) => {
        try {
          const { data: updatedGroup } = await axiosInstance.post(`/groups/${groupId}/remove-user/`, {
            user_id: userId,
          });
          set({
            groups: get().groups.map((g) => (g.id === groupId ? updatedGroup : g)),
          });
        } catch (err: any) {
          set({ error: err.response?.data?.detail || err.message });
        }
      },
    }),
    {
      name: 'user-group-storage',
      skipHydration: true,
    },
  )
);
