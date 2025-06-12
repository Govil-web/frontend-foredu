// src/contexts/LayoutContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
    headerGrade: {
        gradoNombre?: string;
        aula?: string;
    } | null;
    setHeaderGrade: (grade: { gradoNombre?: string; aula?: string; } | null) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [headerGrade, setHeaderGrade] = useState<{ gradoNombre?: string; aula?: string; } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <LayoutContext.Provider value={{ headerGrade, setHeaderGrade, searchTerm, setSearchTerm }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};