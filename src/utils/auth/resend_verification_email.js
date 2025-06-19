import axiosInstance from "../../config/axios/axiosInstance";

const resend_verification_email = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/auth/users/resend_activation/",
      { email },
    );
    if (response.status === 204) {
      console.log("Verification email resent successfully! Check your inbox.");
      alert("Verification email resent successfully! Check your inbox.");
    } else {
      console.log("Unexpected response. Please try again.");
    }
  } catch (error) {
    console.error("Error resending email:", error);
  }
};

export default resend_verification_email;
