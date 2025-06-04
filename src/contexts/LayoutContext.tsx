// src/contexts/LayoutContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderGrade {
    gradoNombre?: string;
}

interface LayoutContextType {
    headerGrade: HeaderGrade | null;
    setHeaderGrade: (grade: HeaderGrade | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [headerGrade, setHeaderGrade] = useState<HeaderGrade | null>(null);

    return (
        <LayoutContext.Provider value={{ headerGrade, setHeaderGrade }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};