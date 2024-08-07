import { useFetch } from "@client/hooks/useFetch";
import api from "@client/lib/api";
import { InferResponseType } from "hono";
import { createContext, PropsWithChildren } from "react";

export type AuthUser = NonNullable<
  InferResponseType<typeof api.auth.user.$get>
>;

export const AuthContext = createContext<{
  user?: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}>(null!);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading } = useFetch<AuthUser>(
    "user",
    api.auth.user.$get
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: user != null }}
      children={children}
    />
  );
};
