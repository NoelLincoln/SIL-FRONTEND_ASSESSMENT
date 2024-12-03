import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextProps {
  loggedIn: boolean;
  user: any;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<SessionContextProps>({
    loggedIn: false,
    user: null,
  });

  const [loading, setLoading] = useState(true); // Track if session fetch is in progress

  const backendUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_DEV_URL;


  useEffect(() => {
    console.log("Fetching session data...");
    fetch(`${backendUrl}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Session data received:", data);
        if (data.email) {
          setSession({ loggedIn: true, user: data });
        } else {
          setSession({ loggedIn: false, user: null });
        }
      })
      .catch((err) => {
        console.error("Session fetch error:", err);
        setSession({ loggedIn: false, user: null });
      })
      .finally(() => {
        setLoading(false); // Stop loading after session fetch
      });
  }, [backendUrl]);

  console.log("Current session state:", session);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while session is being fetched
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
