import { useOrg } from "@/context/OrganizationContext";
import { useUser } from "@/context/UserContext";
import axiosInstance from "@/axios/axiosInstance";

export const useNavigationHandlers = () => {
  const { currentOrg, fetchNavigations } = useOrg();
  const { setLoading } = useUser();

  const handleNavigationDelete = async (navigationId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/organizations/navigation/${navigationId}/`);
    } catch (err) {
      console.error("Error deleting navigation", err);
    } finally {
      fetchNavigations();
      setLoading(false);
    }
  };

  const handleNavigationCreation = async (label: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/organizations/navigation/`, {
        organization: currentOrg.id,
        label,
      });
    } catch (err) {
      console.error("Error creating navigation", err);
    } finally {
      fetchNavigations();
      setLoading(false);
    }
  };

  const handleNavigationEdit = async (
    navigationId: string,
    newLabel: string,
  ) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/organizations/navigation/${navigationId}/`, {
        organization: currentOrg.id,
        label: newLabel,
      });
    } catch (err) {
      console.error("Error editing navigation", err);
    } finally {
      fetchNavigations();
      setLoading(false);
    }
  };

  return {
    handleNavigationDelete,
    handleNavigationCreation,
    handleNavigationEdit,
  };
};
