import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: isAuthenticated && role === "admin",
    isUser: isAuthenticated && role === "user",
    isOwner: isAuthenticated && role === "Owner",
  };
};
