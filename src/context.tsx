import { createContext, useState, useEffect } from 'react';
import { keys_array } from './App';

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

interface keyColorsValues {
    keyColors: string[];
    setKeyColors: (value: string[]) => void;
}

export const KeyColorsContext = createContext<keyColorsValues>({
    keyColors: [],
    setKeyColors: () => { }
})

export function KeyColorsContextProvider({ children }: { children: React.ReactElement }) {
    const [keyColors, setKeyColors] = useState<string[]>(
        keys_array.map(
            () => '#fff'));

    useEffect(() => {
        console.log("color changed" + keyColors);
    }, [keyColors]);

    return (
        <KeyColorsContext.Provider value={{ keyColors, setKeyColors }}>
            {children}
        </KeyColorsContext.Provider>
    )
}



interface ColorValues {
    color: string;
    setColor: (value: string) => void;
}
export const ColorContext = createContext<ColorValues>({
    color: '',
    setColor: () => { }
})

