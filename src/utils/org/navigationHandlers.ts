// navigationHandlers.js

import axiosInstance from "@/axios/axiosInstance";
import { toast } from "sonner";
import useUserStore from "@/context/userStore";
import useOrgStore from "@/context/OrgStore";
import { findNavById } from "./helpers";
export const handleNavEdit = async ({
	navigationGettingEdited,
	newNavigationLabel,
	newIcon,
	setNavigationGettingEdited,
	currentOrg,
	setLoading,
	navigations,
	fetchNavigations,
}) => {
	const currentNav = findNavById(navigations, navigationGettingEdited);

	if (!currentNav) {
		toast.info("Cannot match nav");
		setNavigationGettingEdited(null);
		return;
	}

	if (newNavigationLabel === currentNav.label && newIcon === currentNav.icon) {
		toast.info("No changes made.");
		setNavigationGettingEdited(null);
		return;
	}

	setLoading(true);

	try {
		await axiosInstance.patch(
			`/organizations/${currentOrg.id}/navigation/${navigationGettingEdited}/`,
			{
				organization: currentOrg.id,
				label: newNavigationLabel,
				icon: newIcon,
			},
		);
		toast.success("Navigation updated successfully");
		setNavigationGettingEdited(null);
		fetchNavigations();
	} catch (err) {
		console.error("Error editing navigation:", err);
		toast.error("Failed to update navigation");
	} finally {
		setLoading(false);
	}
};

export const handleNavDelete = async ({
	navigationId,
	currentOrg,
	setLoading,
	fetchNavigations,
}) => {
	try {
		setLoading(true);
		await axiosInstance.delete(
			`/organizations/${currentOrg.id}/navigation/${navigationId}/`,
		);
		toast.success("Navigation deleted successfully");
		fetchNavigations();
	} catch (err) {
		console.error("Error deleting navigation:", err);
		toast.error("Failed to delete navigation");
	} finally {
		setLoading(false);
	}
};
