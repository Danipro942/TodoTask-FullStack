import { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../types/user";
import { getSession, setSession } from "../utils/localStorage";

type UserContextType = {
  user: UserType | null;
  setTokenStorage: (token: string) => void;
};

type Props = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

const userProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>({} as UserType);

  const setTokenStorage = (token: string) => {
    try {
      const DecodedToken = jwtDecode<UserType>(token);
      setSession(token);
      setUser(DecodedToken);
    } catch (error) {
      console.error("Error decoding token ", error);
    }
  };

  useEffect(() => {
    const storedToken = getSession();
    if (storedToken) {
      setTokenStorage(storedToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setTokenStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export default userProvider;
