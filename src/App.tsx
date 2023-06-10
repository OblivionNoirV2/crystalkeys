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

interface KeyProps {
  label: string;
  color: string;
  onClick: () => void;
};
//todo: flip between hex/rgb
//for mobile, rotate the whole thing 90 degrees
const Key: React.FC<KeyProps> = ({ label, color, onClick }) => {
  const className = `${getClassForKey(label)}`
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}
      className={className}>
      <div className='key-text'>
        {label}
      </div>
    </button>
  );
};
//split the keyboard into different segments
const key_sets: { [row: string]: string[] } = {
  top_row: [
    'Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause'
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
  ]
};
//displays them on the screen in row order
function mapKeys() {
  for (let row in key_sets) {
    return (
      <div className='keyboard-row'>
        {
          key_sets.values.map((key, index) => (
            <Key label={key} color={keyColors[index]}
              //put a ternary in here 
              onClick={() => handleKeyClick(index)}
              key={index} />
          ))
        }
      </div>
    )
  }
}
const handleKeyClick = (index: number) => {
  const new_key_colors = [...keyColors];
  new_key_colors[index] = selected_color;
  setKeyColors(new_key_colors);

  if (!prevColors.includes(selected_color)) {
    setPrevColors([...prevColors, selected_color]);
  }
};
//for unique keys that need a little more work
function getClassForKey(key_label: string): string {
  //default is just 'key', some require more work
  return 'key';
}

export const keys_array = Object.values(key_sets);
interface KeyboardProps {
  selected_color: string;
  selected_board_color: string;
};
const Keyboard: React.FC<KeyboardProps> = ({ selected_color, selected_board_color }) => {

  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  //map them all to a default of white
  //this will hbe a seperate function that serves as the reset btn too

  //stores list of used colors 
  const [keyColors, setKeyColors] = useState<string[]>(
    keys_array.map(
      () => '#fff'));

  return (
    <section className='keyboard ' style={{ backgroundColor: selected_board_color }}>
      <div className='keyboard-row'>
        {
          key_sets.top_row.map((key, index) => (
            <Key label={key} color={keyColors[index]}
              onClick={() => handleKeyClick(index)}
              key={index} />
          ))}
      </div>
      <div className='keyboard-row'>
        {key_sets.second_row.map((key, index) => (
          <Key label={key} color={keyColors[index + key_sets.top_row.length]}
            onClick={() => handleKeyClick(index + key_sets.top_row.length)}
            key={index + key_sets.top_row.length} />
        ))}
      </div>
    </section>
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
  const { prevColors } = useContext(PrevColorsContext);
  const [color, setColor] = useState<string>('#000000')
  const [boardColor, setBoardColor] = useState<string>('#242c9e')
  const [prevBoardColors, setPrevBoardColors] = useState<string[]>([]);
  //keys
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }
  //background
  const handleBoardColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardColor(e.target.value)

    //prevents triggering the same color twice
    if (!prevBoardColors.includes(e.target.value)) {
      setPrevBoardColors([...prevBoardColors, e.target.value]);
    }
  }

  return (
    <main className='flex flex-row parent'>
      <Keyboard selected_color={color} selected_board_color={boardColor} />
      <section className=''>
        <div className='flex ml-8'>
          <div className='flex flex-col'>
            <h1>Key color: {color} </h1>
            <input type='color' value={color} onChange={handleColorChange} />
            <h1>Previous key colors:</h1>
            {prevColors.length !== 0 && prevColors.map((color, index) => (
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
          </div>
          <div className='flex flex-col ml-8'>
            <h1>Board color {boardColor}:</h1>
            <input type='color' value={boardColor}
              onChange={handleBoardColorChange} />
            <h1>Previous board colors:</h1>
            {prevBoardColors.length !== 0 && prevBoardColors.map(
              (color, index) => (
                //can click to revert back to that color
                <button onClick={() => setBoardColor(color)}>
                  <li key={index} className='flex flex-col'>
                    {/*little window showing the color */}
                    <div className='px-2 flex flex-col'
                      style={{ backgroundColor: color }}
                      title={color}>
                      {color}
                    </div>
                  </li>
                </button>
              )
            )}
          </div>
          <section>
            <ResetButton />
          </section>
        </div>
      </section>
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
