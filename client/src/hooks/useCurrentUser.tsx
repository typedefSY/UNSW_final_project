import { BrainwavesClient, User } from "@/backend";
import Cookies from "js-cookie";
import { createContext, useContext } from "react";

export interface Session {
  user: User;
  token: string;
}

export const useCurrentUser = (): User | null => {
  const session = useSession();

  if (session) {
    return session.user;
  }

  return null;
};

type ResetSession = () => void;

export const SessionContext = createContext<[Session, ResetSession] | null>(
  null,
);

export const useSession = (): Session | null => {
  const sess = useContext(SessionContext);
  return sess?.[0] ?? null;
};

export const useResetSession = (): ResetSession | null => {
  const sess = useContext(SessionContext);
  return sess?.[1] ?? null;
};

export const createSession = async (
  backend: BrainwavesClient,
): Promise<Session | null> => {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  try {
    const { user } = await backend.getUserInfo({});

    return { user, token };
  } catch {
    Cookies.remove("token");
    return null;
  }
};
