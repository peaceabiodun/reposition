
import { useEffect, useState } from "react";
import { supabase } from "./supabase";


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session !== null) {
        setIsAuthenticated(true);
        
      } else {
        setIsAuthenticated(false);
      
      }
    
    if (typeof window !== "undefined") {
      checkAuthStatus();
    }
    }
  }, []);

  return isAuthenticated;
};
