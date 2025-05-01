import axiosInstance from "../../axios/axiosInstance";
export const get_user_comp = async () => {
  try {
    const response = await axiosInstance.get("/organizations/company/");
    return response;
  } catch (err) {
    throw err;
    console.error("Error fetching organization data:", err);
  }
};

export const get_users_orgs = async () => {
  try {
    const response = await axiosInstance.get("/organizations/organization/");
    return response;
  } catch (err) {
    throw err;
    console.error("Error fetching organization data:", err);
  }
};
