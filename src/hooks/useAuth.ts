import { useContext } from "react";
import { AuthContext } from "@client/components/context/auth-context";
import { API_BASEURL } from "@client/lib/api";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};

export const onLogin = () => {
  window.location.href = API_BASEURL + "/auth/login";
};

export const onLogout = () => {
  window.location.href = API_BASEURL + "/auth/logout";
};
