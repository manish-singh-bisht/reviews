import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { API_BASE_URL } from "../config/index";
import { removeTokenFromLocalStorage } from "../lib/utils";
import { useAuthStore } from "../store/store";

const Logout = () => {
  const navigate = useNavigate();
  const clearToken = useAuthStore((state) => state.clearToken);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/users/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      clearToken();
      removeTokenFromLocalStorage();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const navigateToApi = () => {
    navigate("/users/details");
  };
  return (
    <>
      <DropdownMenu className="">
        <DropdownMenuTrigger className=" p-2 px-[0.9rem] border rounded-full bg-main">
          U
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={navigateToApi}>Api Key</DropdownMenuItem>
          <DropdownMenuItem onClick={logoutHandler}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Logout;
