import axiosInstance from "../../config/axios/axiosInstance";

const send_password_reset_email = async (email) => {
  console.log(email);
  try {
    const response = await axiosInstance.post("/auth/users/reset_password/", {
      email: email,
    });
    if (response.status === 204) {
      console.log("Verification email resent successfully! Check your inbox.");
      return null;
    } else {
      console.log("Unexpected response. Please try again.");
      return true;
    }
  } catch (error) {
    console.error("Error resending email:", error);
    return true;
  }
};

export default send_password_reset_email;
