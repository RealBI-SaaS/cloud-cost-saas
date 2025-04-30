import axiosInstance from "../../axios/axiosInstance";
const get_user_comp = async () => {
  try {
    const response = await axiosInstance.get("/organizations/company/");
    return response;
  } catch (err) {
    throw err;
    console.error("Error fetching organization data:", err);
  }
};

export default get_user_comp;
