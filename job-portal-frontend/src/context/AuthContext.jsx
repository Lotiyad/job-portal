import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Validate token format (basic JWT check)
        if (!token || token.split('.').length !== 3) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Check if token is expired (basic check)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            // Token expired
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
            return;
          }
        } catch (jwtError) {
          // Invalid JWT format
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear storage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (e) {
        // Parsing error, clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      // Ensure state is cleared if data is missing
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
