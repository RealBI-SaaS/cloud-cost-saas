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

export const get_users_orgs = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (err) {
    throw err;
    console.error("Error fetching organization data:", err);
  }
};

export const fetchCompOrgs = async (comp_id) => {
  const response = await axiosInstance.get(
    `organizations/company/${comp_id}/organizations/`,
  );
  return response.data;
};
