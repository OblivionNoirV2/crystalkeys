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

export function ColorContextProvider({ children }: { children: React.ReactElement }) {
    const [color, setColor] = useState<string>('');


    return (
        <ColorContext.Provider value={{ color, setColor }}>
            {children}
        </ColorContext.Provider>
    )
}

interface BoardColorsValues {
    boardColor: string;
    setBoardColor: (value: string) => void;
}

export const BoardColorsContext = createContext<BoardColorsValues>({
    boardColor: '',
    setBoardColor: () => { }
})

export function BoardColorsContextProvider({ children }: { children: React.ReactElement }) {
    const [boardColor, setBoardColor] = useState<string>('#242c9e');

    return (
        <BoardColorsContext.Provider value={{ boardColor, setBoardColor }}>
            {children}
        </BoardColorsContext.Provider>
    )
}

interface PrevBoardColorValues {
    prevBoardColors: string[];
    setPrevBoardColors: (value: string[]) => void;
}

export const PrevBoardColorContext = createContext<PrevBoardColorValues>({
    prevBoardColors: [],
    setPrevBoardColors: () => { }
})

export function PrevBoardColorContextProvider({ children }: { children: React.ReactElement }) {

    const [prevBoardColors, setPrevBoardColors] = useState<string[]>([]);


    return (
        <PrevBoardColorContext.Provider value={{ prevBoardColors, setPrevBoardColors }}>
            {children}
        </PrevBoardColorContext.Provider>
    )
}

interface KeyTypeValues {
    keyType: string;
    setKeyType: (value: string) => void;
}

export const KeyTypeContext = createContext<KeyTypeValues>({
    keyType: '',
    setKeyType: () => { }
})

export function KeyTypeContextProvider({ children }: { children: React.ReactElement }) {
    const [keyType, setKeyType] = useState<string>('red');



    return (
        <KeyTypeContext.Provider value={{ keyType, setKeyType }}>
            {children}
        </KeyTypeContext.Provider>
    )
}