import axiosInstance from "../../config/axios/axiosInstance";

const check_correct_password = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/jwt/create/", {
      email,
      password,
    });
    if (response.status === 200) {
      console.log("password is correct");
      return true;
    } else {
      console.log("incorrect password");
      return false;
    }
  } catch (error) {
    if (!error.response.status == "401") {
      console.error("Error  checking password:", error);
    }
    return false;
  }
};

export default check_correct_password;
