import { createContext, useState, useContext } from 'react';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState("");
    const [ruolo, setRuolo] = useState(""); 

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUsername(_ => jwtDecode(token)?.sub);
        setRuolo(_ => jwtDecode(token)?.roles);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername(_ => "");
        setRuolo(_ => "");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, ruolo, setRuolo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);