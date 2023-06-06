import React, { useState } from 'react';
import './sparkles.css';
import './App.css';
import blueswitch from './audio/blueswitch.mp3';
import redswitch from './audio/redswitch.mp3';
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
    'Esc', '', '', 'F1', 'F2', 'F3', 'F4', '', 'F5', 'F6',
    'F7', 'F8', '', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause'
  ],
};
const Keyboard: React.FC<KeyboardProps> = ({ selected_color }) => {
  //map them all to a default of white
  const [keyColors, setKeyColors] = useState<string[]>(
    key_sets.top_row.map(
      () => '#fff'));
  const [prevColors, setPrevColors] = useState<string[]>([]);

  const handleKeyClick = (index: number) => {
    const new_key_colors = [...keyColors];
    new_key_colors[index] = selected_color;
    setKeyColors(new_key_colors);
    if (!prevColors.includes(selected_color)) {
      setPrevColors(prevColors => [...prevColors, selected_color]);
    }
  };

  return (
    <section className='keyboard '>
      {key_sets.top_row.map((key, index) => (
        <Key label={key} color={keyColors[index]}
          //pass the function being called to the key itself
          onClick={() => handleKeyClick(index)}
          key={index} />
      ))}
      {/*will need context to display in the correct area*/}
      <h1>Previous:</h1>
      {prevColors.length !== 0 && prevColors.map((color, index) => (
        <li key={index}>{color}</li>
      ))}
    </section>
  );
};

const ColorPicker = () => {
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
      </section>
    </main>
  );
};

function App() {
  return (
    <main>
      <TopBar />
      <ColorPicker />
    </main>
  );
};

export default App;
