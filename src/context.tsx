import { createContext, useState, useEffect } from 'react';

interface prevColorsValues {
    prevColors: string[];
    setPrevColors: (value: string[]) => void;
};

export const PrevColorsContext = createContext<prevColorsValues>({
    prevColors: [],
    setPrevColors: () => { }
});

export function PrevColorsContextProvider({ children }: { children: React.ReactElement }) {
    const [prevColors, setPrevColors] = useState<string[]>([]);

    useEffect(() => {
        console.log("color changed" + prevColors);
    }, [prevColors]);

    return (
        <PrevColorsContext.Provider value={{ prevColors, setPrevColors }}>
            {children}
        </PrevColorsContext.Provider>
    )
}