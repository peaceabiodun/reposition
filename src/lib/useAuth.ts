
import { useEffect, useState } from "react";
import { supabase } from "./supabase";


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    if(typeof window !== "undefined") {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        
      } else {
        setIsAuthenticated(false);
      
      }
    };
    checkAuthStatus();
    }
  }, []);

  return isAuthenticated;
};
