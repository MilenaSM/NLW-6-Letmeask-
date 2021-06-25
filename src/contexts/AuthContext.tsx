import { useEffect, useState } from "react";
import { createContext, ReactNode } from "react";

import { auth } from "../services/firebase";
import firebase from "firebase";


type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  sigInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => {
    if (user) {
      const { displayName, photoURL, uid } = user
        
    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account.');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
      })
      setLoading(false)
    }
  })

    return() => {
      unsubscribe();
    }

  }, [])
  
  // autenticação de user
  async function sigInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user
        
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <AuthContext.Provider value={{ user, sigInWithGoogle }}>
      { props.children }
    </AuthContext.Provider>

  );
}