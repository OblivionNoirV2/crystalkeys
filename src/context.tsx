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

export function ColorContextProvider({ children }: { children: React.ReactElement }) {
    const [color, setColor] = useState<string>('');

    useEffect(() => {
        console.log("color changed" + color);
    }, [color]);

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

    useEffect(() => {
        console.log("color changed" + boardColor);
    }, [boardColor]);

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
    useEffect(() => {
        console.log("board history changed" + prevBoardColors);
    }, [prevBoardColors]);

    return (
        <PrevBoardColorContext.Provider value={{ prevBoardColors, setPrevBoardColors }}>
            {children}
        </PrevBoardColorContext.Provider>
    )
}
