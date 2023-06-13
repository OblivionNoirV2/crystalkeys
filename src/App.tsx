import React, { useState, useContext, useEffect } from 'react';
import './sparkles.css';
import './App.css';
import blueswitch from './audio/blueswitch.mp3';
import redswitch from './audio/redswitch.mp3';
import { PrevColorsContext } from './context';
import { KeyColorsContext } from './context';
import { BoardColorsContext } from './context';
import { PrevBoardColorContext } from './context';

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
    'L-Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'R-Shift', 'Up'

  ],
  sixth_row: [
    'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', '.', 'Ctrl', 'Left', 'Down', 'Right'
  ],
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

/*function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | ((r << 16) | (g << 8) | b)).toString(16).slice(1);
}*/

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
    'L-Shift': 'key-l-shift',
    '|': 'key-backslash',
    'Ctrl': 'key-ctrl',
    'Space': 'key-space',
    'Win': 'key-win',
    'Alt': 'key-alt',
    'Fn': 'key-fn',
    '.': 'key-dot',
    'Left': 'key-left',
    'R-Shift': 'key-r-shift',
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
  //this needs context
  const { keyColors, setKeyColors } = useContext(KeyColorsContext);

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
    <section className='keyboard ml-8' style={{ backgroundColor: selected_board_color }}>

      {keys_array.map((key, index) => {
        //add line breaks between rows
        let separator = null;
        if (key.row !== last_row) {
          separator = <br />;
          last_row = key.row;
        }
        return (
          <span key={index}>
            {separator}
            <Key label={key.label} color={keyColors[index]}
              onClick={() => handleKeyClick(index)}
            />
          </span>
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
  isRGB: boolean;
}
//handles both board and key colors
const ColorHistory: React.FC<ColorHistoryProps> = ({
  colorHistory, setColor, isRGB }) => {
  return (
    <>
      {colorHistory.length !== 0 && colorHistory.map((color, index) => {
        const rgb = hexToRgb(color);
        return (
          <button onClick={() => setColor(color)}>
            <li className=''>
              {/*little window showing the color 
              min-w prevents expanding when rgb*/}
              <div key={index} className='px-2 flex flex-col min-w-[14rem]'
                style={{ backgroundColor: color }}
                title={color}>
                {
                  isRGB ?
                    rgb !== null &&
                    `(${rgb.r}, ${rgb.g}, ${rgb.b})` :
                    color
                }

              </div>
            </li>
          </button>
        )
      })}
    </>
  );
};

interface ColorInputProps {
  color: string;
  setColor: (color: string) => void;
  colorHistory: string[];
  setColorHistory: (colorHistory: string[]) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ color, setColor,
  colorHistory, setColorHistory }) => {
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
  const { keyColors, setKeyColors } = useContext(KeyColorsContext);
  // include board color and board color history in your context and pull it here
  const { prevBoardColors, setPrevBoardColors } = useContext(PrevBoardColorContext);
  const { boardColor, setBoardColor } = useContext(BoardColorsContext);
  const handleReset = () => {
    setPrevColors([]);
    setKeyColors(keys_array.map(() => '#fff'));
    // reset the board color and history of board colors here
    setBoardColor("#242c9e"); // assuming #242c9e is the initial board color
    setPrevBoardColors([]);
  }

  return (
    <button onClick={handleReset}>Reset</button>
  );
}
interface HexRGBSwitchProps {
  isRGB: boolean;
  setIsRGB: (isRGB: boolean) => void;
}

const HexRGBSwitch: React.FC<HexRGBSwitchProps> = ({ isRGB, setIsRGB }) => {

  function handleColorCodeSwitch() {
    setIsRGB(!isRGB);
  }

  useEffect(() => {
    console.log(isRGB);
  }, [isRGB]);

  return (
    <label className="switch">
      <input type="checkbox" checked={isRGB} onChange={handleColorCodeSwitch} />
      <span className="slider round"></span>
    </label>
  )
}


const ColorPicker = () => {
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  const [color, setColor] = useState<string>('#000000')
  const { boardColor, setBoardColor } = useContext(BoardColorsContext);
  const { prevBoardColors, setPrevBoardColors } = useContext(PrevBoardColorContext);
  const [isRGB, setIsRGB] = useState(false);
  const rgb = hexToRgb(color);
  return (
    <main className='flex flex-row parent'>
      <Keyboard selected_color={color} selected_board_color={boardColor} />
      <div className='flex ml-8'>
        <div className='flex flex-col'>
          <h1>Key color: {
            isRGB ? (
              rgb !== null &&
              `(${rgb.r}, ${rgb.g}, ${rgb.b})`
            )
              : color
          } </h1>
          <ColorInput color={color} setColor={setColor} colorHistory={prevColors} setColorHistory={setPrevColors} />
          <h1>Previous key colors:</h1>
          <ColorHistory colorHistory={prevColors} setColor={setColor}
            isRGB={isRGB} />
        </div>
        <div className='flex flex-col ml-8'>
          <h1>Board color:
            {
              isRGB ? (
                rgb !== null
                  ? `(${rgb.r}, ${rgb.g}, ${rgb.b})`
                  : 'Color not available'
              )
                : boardColor
            }

          </h1>
          <ColorInput color={boardColor} setColor={setBoardColor} colorHistory={prevBoardColors} setColorHistory={setPrevBoardColors} />
          <h1>Previous board colors:</h1>
          <ColorHistory colorHistory={prevBoardColors}
            setColor={setBoardColor} isRGB={isRGB} />
        </div>
        <section>
          <ResetButton />
        </section>
        <section className='flex flex-row ml-8'>
          <h4 className='mr-2'>Hex</h4>
          <HexRGBSwitch isRGB={isRGB} setIsRGB={setIsRGB} />
          <h4 className='ml-2'>RGB</h4>
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