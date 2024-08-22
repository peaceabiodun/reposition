"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(typeof window !== "undefined") {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        router.push('/home')
      } else {
        setIsAuthenticated(false);
        router.push("/"); // Redirect to signup page
      }
    };
    checkAuthStatus();
    }
  }, [router]);

  return isAuthenticated;
};
