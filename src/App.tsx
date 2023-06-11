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


//for unique keys that need a little more work
function getClassForKey(key_label: string): string {
  //default is just 'key', some require more work
  return 'key';
}

interface KeyboardProps {
  selected_color: string;
  selected_board_color: string;
};
//Convert the key_sets object to a flat array
export const keys_array: string[] = [];
for (let row in key_sets) {
  //use spread to merge them into one array
  keys_array.push(...key_sets[row]);
}

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

  return (
    <section className='keyboard ' style={{ backgroundColor: selected_board_color }}>
      {/*maps all the key arrays to the keyboard*/}
      {Object.keys(key_sets).map((row, rowIndex) => (
        <div key={rowIndex}>
          {key_sets[row].map((key, index) => (
            <Key label={key} color={keyColors[rowIndex * key_sets[row].length + index]}
              onClick={() => handleKeyClick(rowIndex * key_sets[row].length + index)}
              key={index} />
          ))}
        </div>
      ))}
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
interface PrevColorsSegmentsProps {
  color: string;


}
/*const PrevColorsSegment: React.FC<PrevColorsSegmentsProps> = ({}) => {


}*/

const BoardColorsSegment = () => {

}

const ColorPicker = () => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }
  const { prevColors } = useContext(PrevColorsContext);
  //key color
  const [color, setColor] = useState<string>('#000000')
  //board color
  const [boardColor, setBoardColor] = useState<string>('#242c9e')
  const [prevBoardColors, setPrevBoardColors] = useState<string[]>([]);
  //keys

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