import React, { useState } from 'react';
import { UserContext, UserProvider } from './UserContext';

const defaultUser = {
    id: "d27db05e-fb3f-4942-a517-59fefbd97937",
    firstName: 'Angela',
    lastName: 'Busato',
    email: "bsuato.angela@gmail.com",
    role: "engeener"
}

export function AppWrapper({ children }) {
    const [user, setUser] = useState(defaultUser);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}