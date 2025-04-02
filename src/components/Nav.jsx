import React from "react";
import { Avatar } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import OrganizationsDropDown from "./menu/NavDropDown";
import { useOrg } from "../context/OrganizationContext";

function Nav() {
  const { user } = useUser();
  const userName = user?.firstName || user?.email || "x";
  const userInitial = userName.charAt(0).toUpperCase();

  const navigate = useNavigate();

  return (
    <nav className="shadow-sm fixed w-full grid grid-cols-2 align-middle">
      <div className="bg-gray-100 py-2 pl-5">
        <button
          onClick={() => {
            navigate("/home");
          }}
          className="mr-4 block hover:translate-y-1 cursor-pointer py-1.5 text-base text-red-800 font-semibold hover:text-sky-600"
        >
          <HomeOutlined className="text-lg hover:text-sky-600" /> Home
        </button>
      </div>

      <div className="bg-gray-100 flex justify-end py-2 pr-5">
        {user && (
          <div className=" flex justify-center items-center gap-2">
            <OrganizationsDropDown />
            <Avatar
              style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
              size="large"
              onClick={() => navigate("/manage-all")}
              className="cursor-pointer"
            >
              {userInitial}
            </Avatar>
          </div>
        )}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="mr-4 block hover:translate-y-1 cursor-pointer py-1.5 text-base text-slate-800 font-semibold hover:text-sky-600"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
