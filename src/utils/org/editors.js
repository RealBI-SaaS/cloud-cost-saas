import axiosInstance from "../../config/axios/axiosInstance";

export const edit_user_comp = async (company_id, data) => {
  try {
    const response = await axiosInstance.patch(
      `/organizations/company/${company_id}/`,
      data,
    );
    return response;
  } catch (err) {
    throw err;
    console.error("Error editing company :", err);
  }
};

export const edit_user_org = async (org_id, data) => {
  try {
    const response = await axiosInstance.patch(
      `/organizations/organization/${org_id}/`,
      data,
    );
    return response;
  } catch (err) {
    throw err;
    console.error("Error editing organization :", err);
  }
};



export const edit_nav = async (org_id, nav_id, data) => {
  try {
    const response = await axiosInstance.patch(
      `/organizations/${org_id}/navigation/${nav_id}/`,
      data,
    );
    return response;
  } catch (err) {
    throw err;
    console.error("Error editing navigation :", err);
  }
};
