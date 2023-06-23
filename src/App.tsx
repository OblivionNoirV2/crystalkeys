import React, { useState, useContext, useEffect } from 'react';
import './sparkles.css';
import './App.css';
import blueswitch from './audio/blueswitch.mp3';
import redswitch from './audio/redswitch.mp3';
import { PrevColorsContext } from './context';
import { KeyColorsContext } from './context';
import { BoardColorsContext } from './context';
import { PrevBoardColorContext } from './context';
import { KeyTypeContext } from './context';

const TopBar = () => {
  return (
    <section className='crystal items-center w-full h-20 flex
     justify-end'>
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
    'Back', 'Ins', 'Home', 'PgUp'
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
    'Down': 'key-down',
    'Left': 'key-left',
    'Right': 'key-right',
    'Back': 'key-backspace',
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
    'R-Shift': 'key-r-shift',
    'F12': 'key-f12',
    'End': 'key-end',
    'ScrLk': 'key-scroll-lock',
    'PgUp': 'key-pgup',
    'PgDn': 'key-pgdown',
  };
  return `${keyClassMap[key_label]} key`
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
//try making it appear under the controls on mobile? 


interface KeyProps {
  label: string;
  color: string;
  onClick: () => void;
};


const Key: React.FC<KeyProps> = ({ label, color, onClick }) => {
  const { keyType, setKeyType } = useContext(KeyTypeContext);
  let key_audio = new Audio();
  const className = `${getClassForKey(label)}`

  function playSound() {
    if (keyType === 'blue') {
      key_audio.src = blueswitch;
      key_audio.play();
    } else {
      key_audio.src = redswitch;
      key_audio.play();
    }
  }
  return (
    <button style={{ backgroundColor: color }} onClick={() => { onClick(); playSound(); }}
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
  isDarkMode: boolean;
}
//handles both board and key colors
const ColorHistory: React.FC<ColorHistoryProps> = ({
  colorHistory, setColor, isRGB, isDarkMode }) => {
  return (
    <>
      {colorHistory.length !== 0 && colorHistory.map((color, index) => {
        const rgb = hexToRgb(color);
        return (
          <button onClick={() => setColor(color)}>
            <li className={
              isDarkMode ? 'text-white' : 'text-black'
            }>
              {/*little window showing the color 
              min-w prevents expanding when rgb*/}
              <div key={index} className={
                isDarkMode ? 'border border-white px-2 flex flex-col '
                  : 'border border-black px-2 flex flex-col '
              }

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

interface ResetButtonProps {
  isDark: boolean;
}
//this needs to reset the select as well
const ResetButton: React.FC<ResetButtonProps> = ({ isDark }) => {
  const { setPrevColors } = useContext(PrevColorsContext);
  const { keyColors, setKeyColors } = useContext(KeyColorsContext);
  const { prevBoardColors, setPrevBoardColors } = useContext(PrevBoardColorContext);
  const { boardColor, setBoardColor } = useContext(BoardColorsContext);
  const { keyType, setKeyType } = useContext(KeyTypeContext);
  const handleReset = () => {
    setPrevColors([]);
    setKeyColors(keys_array.map(() => '#fff'));
    setBoardColor("#242c9e"); //default board color
    setPrevBoardColors([]);
    setKeyType('red');
  }

  return (
    <button onClick={handleReset}
      className={
        isDark ? 'text-white border border-white px-4 py-2 rounded-xl' :
          'text-black border border-black px-4 py-2 rounded-xl'
      }>Reset</button>
  );
}
interface HexRGBSwitchProps {
  isRGB: boolean;
  setIsRGB: (isRGB: boolean) => void;
  isDark: boolean;
}

const HexRGBSwitch: React.FC<HexRGBSwitchProps> = ({ isRGB, setIsRGB, isDark }) => {

  function handleColorCodeSwitch() {
    setIsRGB(!isRGB);
  }

  useEffect(() => {
    console.log(isRGB);
  }, [isRGB]);

  return (
    <label className="switch">
      <input type="checkbox" checked={isRGB} onChange={handleColorCodeSwitch} />
      <span className={
        isDark ? "slider slider-dark round" : "slider round "
      }></span>
    </label>
  )
}
interface DarkLightSwitchProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}
const DarkLightSwitch: React.FC<DarkLightSwitchProps> = ({ isDark, setIsDark }) => {
  useEffect(() => {
    if (isDark) {
      document.body.style.backgroundColor = "#2e2e2e";
    } else {
      document.body.style.backgroundColor = "#ffffff";
    }
    console.log(isDark);
  }, [isDark]);

  const handleDarkLightSwitch = () => {
    setIsDark(!isDark);
  }
  return (
    <label className="switch">
      <input type="checkbox" checked={isDark} onChange={handleDarkLightSwitch} />
      <span className={
        isDark ? "slider slider-dark round" : "slider round "
      }
      ></span>
    </label>
  )
}
interface SoundSelectProps {
  isDark: boolean;
}
const SoundSelect: React.FC<SoundSelectProps> = ({ isDark }) => {
  const { keyType, setKeyType } = useContext(KeyTypeContext);
  useEffect(() => {
    console.log(isDark);

  }, [isDark]);

  useEffect(() => {
    console.log(keyType);
  }, [keyType]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target.value !== "" && setKeyType(e.target.value);
  }
  return (
    <select className={
      isDark ? "text-white bg-black border border-white mt-4" :
        "text-black bg-white border border-black mt-4"
    }
      onChange={handleSelectChange}
      defaultValue="">
      <option value="">Choose a switch type...</option>
      <option value="red">Red</option>
      <option value="blue">Blue</option>
    </select>
  )
};
const Keyboard: React.FC<KeyboardProps> = ({ selected_color, selected_board_color }) => {
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);

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
    <section className='keyboard whitespace-nowrap mx-auto' style={{ backgroundColor: selected_board_color }}>

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
const Controls = () => {
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  const [color, setColor] = useState<string>('#000000')
  const { boardColor, setBoardColor } = useContext(BoardColorsContext);
  const { prevBoardColors, setPrevBoardColors } = useContext(PrevBoardColorContext);
  const [isRGB, setIsRGB] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const rgb = hexToRgb(color);
  return (
    <main className='flex flex-col m-auto justify-center mt-[28rem] lg:mt-4 '>
      <Keyboard selected_color={color} selected_board_color={boardColor} />
      <div className='flex flex-row mx-auto justify-center mt-4 '>
        <div className='flex flex-col min-w-[14rem]'>
          <h1 className={
            isDark ? "text-white" : "text-black"
          }>Key color: {
              isRGB ? (
                rgb !== null &&
                `(${rgb.r}, ${rgb.g}, ${rgb.b})`
              )
                : color
            } </h1>
          <ColorInput color={color} setColor={setColor} colorHistory={prevColors} setColorHistory={setPrevColors} />
          <h1 className={
            isDark ? "text-white" : "text-black"
          }>Previous key colors:</h1>
          <ColorHistory colorHistory={prevColors} setColor={setColor}
            isRGB={isRGB} isDarkMode={isDark} />
        </div>
        <div className='flex flex-col ml-8 min-w-[14rem]'>
          <h1 className={
            isDark ? "text-white" : "text-black"
          }>Board color: {
              isRGB ? (
                rgb !== null &&
                `(${rgb.r}, ${rgb.g}, ${rgb.b})`

              )
                : boardColor
            }
          </h1>
          <ColorInput color={boardColor} setColor={setBoardColor} colorHistory={prevBoardColors} setColorHistory={setPrevBoardColors} />

          <h1 className={
            isDark ? "text-white" : "text-black"
            //prev colors will be white if dark mode is on
          }>Previous board colors:</h1>
          <ColorHistory colorHistory={prevBoardColors}
            setColor={setBoardColor} isRGB={isRGB} isDarkMode={isDark} />
        </div>
        <section >
          <ResetButton isDark={isDark} />
        </section>
        <section className='flex flex-col  ml-8'>
          <section className='flex flex-row ml-8'>
            <h4 className={
              isDark ? "text-white mr-2" : "text-black mr-2"
            }>Hex</h4>
            <HexRGBSwitch isRGB={isRGB} setIsRGB={setIsRGB} isDark={isDark} />
            <h4 className={
              isDark ? "text-white ml-2" : "text-black ml-2"
            }>RGB</h4>
          </section>
          <section className='flex flex-row ml-8'>
            <h4 className={
              isDark ? "text-white mr-2" : "text-black mr-2"
            }>Dark mode</h4>
            <DarkLightSwitch isDark={isDark} setIsDark={setIsDark} />
          </section>
          <SoundSelect isDark={isDark} />
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
      <Controls />
    </main>
  );
};

export default App;