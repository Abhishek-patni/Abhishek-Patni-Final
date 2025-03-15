import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user')) || null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        
        // Remove user from storage
        localStorage.removeItem('user');
        sessionStorage.clear();
    
        // Clear application cache
        caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
        });
    
        // Clear in-memory state by reloading the page
        setTimeout(() => {
            window.location.href = "/login"; // Redirect to login page
        }, 100); // Small delay ensures storage updates before redirection
    };
    

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
