import React, { useState, useContext } from 'react';
import './sparkles.css';
import './App.css';
import blueswitch from './audio/blueswitch.mp3';
import redswitch from './audio/redswitch.mp3';
import { PrevColorsContext } from './context';
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
interface KeyboardProps {
  selected_color: string;
};
interface KeyProps {
  label: string;
  color: string;
  onClick: () => void;
};
//todo: flip between hex/rgb
//for mobile, rotate the whole thing 90 degrees
const Key: React.FC<KeyProps> = ({ label, color, onClick }) => {
  const className = label === '' ? 'key-hidden' : 'key'
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
    'Esc', '', '', '', '', '', '', '', 'F1', 'F2', 'F3', 'F4', '', 'F5', 'F6',
    'F7', 'F8', '', 'F9', 'F10', 'F11', 'F12', '', '', 'PrtSc', 'ScrLk', 'Pause'
  ],
  second_row: [
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
    'Backspace', '', '', 'Ins', 'Home', 'PgUp'
  ],
  third_row: [
    'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O',
    'P', '[', ']', '|', 'Del', '', '', '', 'End', 'PgDn'
  ]
};
//for unique keys that need a little more work
function GetClassForIndex() {

}
const Keyboard: React.FC<KeyboardProps> = ({ selected_color }) => {
  const keys_array = Object.values(key_sets);
  const { prevColors, setPrevColors } = useContext(PrevColorsContext);
  //map them all to a default of white
  //this will hbe a seperate function that serves as the reset btn too
  const [keyColors, setKeyColors] = useState<string[]>(
    keys_array.map(
      () => '#fff'));
  const handleKeyClick = (index: number) => {
    const new_key_colors = [...keyColors];
    new_key_colors[index] = selected_color;
    setKeyColors(new_key_colors);
    if (!prevColors.includes(selected_color)) {
      setPrevColors([...prevColors, selected_color]);
    }
  };
  return (
    <section className='keyboard'>
      <div className='keyboard-row'>
        {key_sets.top_row.map((key, index) => (
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
interface ResetButtonProps {
  prev_colors: string[];
}
const ResetButton: React.FC<ResetButtonProps> = ({ prev_colors }) => {
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
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }
  return (
    <main className='flex'>
      <Keyboard selected_color={color} />
      <section className='flex flex-col'>
        <h1>Selected color: {color} </h1>
        <input type='color' value={color} onChange={handleColorChange} />
        <h1>Previous:</h1>
        {prevColors.length !== 0 && prevColors.map((color, index) => (
          <li key={index}>{color}</li>
        ))}
        <ResetButton prev_colors={prevColors} />
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
