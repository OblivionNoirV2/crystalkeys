import React, { useState, useContext } from 'react';
import './sparkles.css';
import './App.css';
import blueswitch from './audio/blueswitch.mp3';
import redswitch from './audio/redswitch.mp3';
import { PrevColorsContext } from './context';
import { KeyColorsContext } from './context';

const TopBar = () => {
  return (
    <section className='crystal items-center w-full h-20 flex justify-end'>
      <i>
        <h1 className='mr-8 text-4xl text-white'>
          Crystal Keys
        </h1>
      </i>
    </section>
  )
}
/*how this is going to work is the color picker will 
set the color state, which is then passed to the keyboard component, 
which then changes the color of whatever key is clicked*/


//split the keyboard into different segments
//every element here has its own index, one huge array
const key_sets: { [row: string]: string[] } = {
  top_row: [
    'Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause',
  ],
  second_row: [
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
    'Backspace', 'Ins', 'Home', 'PgUp'
  ],
  third_row: [
    'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O',
    'P', '[', ']', '|', 'Del', 'End', 'PgDn'
  ],
  fourth_row: [
    'CapsLk', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'
  ],
  fifth_row: [
    'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', 'Up'

  ],
  sixth_row: [
    'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', '.', 'Ctrl', 'Left', 'Down', 'Right'
  ],
};


function getClassForKey(key_label: string): string {
  //default is just 'key', some require more work
  const keyClassMap: { [key: string]: string } = {
    'F1': 'key-f1',
    'F5': 'key-f5',
    'F9': 'key-f9',
    'PrtSc': 'key-prtsc',
    'Ins': 'key-ins',
    'Del': 'key-del',
    'Up': 'key-up',
    'Backspace': 'key-backspace',
    'CapsLk': 'key-capslock',
    'Tab': 'key-tab',
    'Enter': 'key-enter',
    'Shift': 'key-shift',
    '|': 'key-backslash',
    'Ctrl': 'key-ctrl',
    'Space': 'key-space',
    'Win': 'key-win',
    'Alt': 'key-alt',
    'Fn': 'key-fn',
    '.': 'key-dot',
    'Left': 'key-left',
  };
  return keyClassMap[key_label] || 'key'
}

interface KeyboardProps {
  selected_color: string;
  selected_board_color: string;
};
//Convert the key_sets object to a flat array
export const keys_array: { label: string, row: string }[] = [];

Object.keys(key_sets).forEach(row => {
  /*create new array of objects with the key label and row,
and push it to the keys array. Spread so it doesn't get segmented. 
So keys_array becomes an array of objects, and we can use these new 
properties to determine where spacings go*/
  keys_array.push(...key_sets[row].map(key => ({ label: key, row })));

});
const Keyboard: React.FC<KeyboardProps> = ({ selected_color, selected_board_color }) => {
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  const [keyColors, setKeyColors] = useState<string[]>(
    keys_array.map(() => '#fff')
  );

  const handleKeyClick = (index: number) => {
    const new_key_colors = [...keyColors];
    new_key_colors[index] = selected_color;
    setKeyColors(new_key_colors);

    if (!prevColors.includes(selected_color)) {
      setPrevColors([...prevColors, selected_color]);
    }
  };
  /*so we can compare the last row to the current one, 
  as the last row does not get a break*/
  let last_row = keys_array[0].row;
  return (
    <section className='keyboard ' style={{ backgroundColor: selected_board_color }}>

      {keys_array.map((key, index) => {
        //add line breaks between rows
        let separator = null;
        if (key.row !== last_row) {
          separator = <br />;
          last_row = key.row;
        }
        return (
          <>
            {separator}
            <Key label={key.label} color={keyColors[index]}
              onClick={() => handleKeyClick(index)}
              key={index} />
          </>
        )
      })}
    </section>
  );
};

interface KeyProps {
  label: string;
  color: string;
  onClick: () => void;
};
//todo: flip between hex/rgb
//for mobile, rotate the whole thing 90 degrees
const Key: React.FC<KeyProps> = ({ label, color, onClick }) => {
  const className = `${getClassForKey(label)}`
  //uses param to call function from above
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}
      className={className}>
      <div className='key-text'>
        {label}
      </div>
    </button>
  );
};


interface ColorHistoryProps {
  colorHistory: string[];
  setColor: (color: string) => void;
}

const ColorHistory: React.FC<ColorHistoryProps> = ({ colorHistory, setColor }) => {
  return (
    <>
      {colorHistory.length !== 0 && colorHistory.map((color, index) => (
        //switches it back to the clicked color
        <button onClick={() => setColor(color)}>
          <li key={index} className=''>
            {/*little window showing the color */}
            <div className='px-2 flex flex-col'
              style={{ backgroundColor: color }}
              title={color}>
              {color}
            </div>
          </li>
        </button>
      ))}
    </>
  );
};

interface ColorInputProps {
  color: string;
  setColor: (color: string) => void;
  colorHistory: string[];
  setColorHistory: (colorHistory: string[]) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ color, setColor, colorHistory, setColorHistory }) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)

    //prevents triggering the same color twice
    if (!colorHistory.includes(e.target.value)) {
      setColorHistory([...colorHistory, e.target.value]);
    }
  }

  return (
    <input type='color' value={color} onChange={handleColorChange} />
  );
};


const ResetButton = () => {
  const { setPrevColors } = useContext(PrevColorsContext);
  const handleReset = () => {
    setPrevColors([]);
  }
  return (
    <button onClick={handleReset}>Reset</button>
  );
}

const ColorPicker = () => {
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  //needs context
  const [color, setColor] = useState<string>('#000000')
  const [boardColor, setBoardColor] = useState<string>('#242c9e')
  const [prevBoardColors, setPrevBoardColors] = useState<string[]>([]);

  return (
    <main className='flex flex-row parent'>
      <Keyboard selected_color={color} selected_board_color={boardColor} />
      <div className='flex ml-8'>
        <div className='flex flex-col'>
          <h1>Key color: {color} </h1>
          <ColorInput color={color} setColor={setColor} colorHistory={prevColors} setColorHistory={setPrevColors} />
          <h1>Previous key colors:</h1>
          <ColorHistory colorHistory={prevColors} setColor={setColor} />
        </div>
        <div className='flex flex-col ml-8'>
          <h1>Board color {boardColor}:</h1>
          <ColorInput color={boardColor} setColor={setBoardColor} colorHistory={prevBoardColors} setColorHistory={setPrevBoardColors} />
          <h1>Previous board colors:</h1>
          <ColorHistory colorHistory={prevBoardColors} setColor={setBoardColor} />
        </div>
        <section>
          <ResetButton />
        </section>
      </div>
    </main>
  );
};


function App() {
  return (
    <main>
      <audio>
        <source src={blueswitch} type='audio/mpeg' />
        <source src={redswitch} type='audio/mpeg' />
      </audio>
      <TopBar />
      <ColorPicker />
    </main>
  );
};

export default App;