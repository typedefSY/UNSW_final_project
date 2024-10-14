"use client";

import { Theme } from "@radix-ui/themes";
import { useAppearance } from "@/hooks/useAppearance";
import { Session, SessionContext, createSession } from "@/hooks/useCurrentUser";
// import Login from "./login";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useBackend } from "@/hooks/useBackend";
import { CenteredLoading } from "@/components/loading";
import Login from "@/app/login/page";

interface WrapperProps extends PropsWithChildren {
  sessionAndReset: [Session, () => void] | null;
}

const AppWrapper: React.FC<WrapperProps> = ({ children, sessionAndReset }) => {
  const appearance = useAppearance();

  return (
    <SessionContext.Provider value={sessionAndReset}>
      <Theme appearance={appearance} accentColor="orange">
        <div className="w-screen h-screen">{children}</div>
      </Theme>
    </SessionContext.Provider>
  );
};

const AppInner: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [sessionAndReset, setSessionAndReset] = useState<
    [Session, () => void] | null
  >(null);

  const backend = useBackend();

  const loadSession = useCallback(async () => {
    setIsLoadingSession(true);
    const session = await createSession(backend);
    setSession(session);
    setIsLoadingSession(false);
  }, [backend]);

  useEffect(() => {
    if (session) {
      setSessionAndReset([
        session,
        () => {
          void loadSession();
        },
      ]);
    } else {
      setSessionAndReset(null);
    }
  }, [loadSession, session]);

  useEffect(() => {
    void loadSession();
  }, [backend, loadSession]);

  if (isLoadingSession) {
    return (
      <AppWrapper sessionAndReset={sessionAndReset}>
        <CenteredLoading />
      </AppWrapper>
    );
  }

  if (!session && !isLoadingSession) {
    return (
      <AppWrapper sessionAndReset={sessionAndReset}>
        <Login />
      </AppWrapper>
    );
  }

  return <AppWrapper sessionAndReset={sessionAndReset}>{children}</AppWrapper>;
};

export default AppInner;
