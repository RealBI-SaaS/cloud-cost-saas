//TODO: improve the logging method and response
//import axios from "axios"
import axiosInstance from "../../config/axios/axiosInstance";
import Logout from "../../pages/auth/logout";

const change_password = async (current_pass, new_pass, access_token) => {
  console.log(current_pass, new_pass, access_token);
  try {
    const response = await axiosInstance.post("/auth/users/set_password/", {
      new_password: new_pass,
      current_password: current_pass,
    });
    if (response.status === 204) {
      console.log("Password Change Successful!");
      return null;
    } else {
      console.log("Unexpected response. Please try again.");
      return true;
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return true;
  }
};

export default change_password;
