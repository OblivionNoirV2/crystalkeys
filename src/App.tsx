import React, { useState } from 'react';
import './sparkles.css';
import './App.css';
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
}
const Keyboard: React.FC<KeyboardProps> = ({ selected_color }) => {
  return (
    <section>
      temp
    </section>
  )

}
const ColorPicker = () => {
  const [color, setColor] = useState<string>('#000000')
  const [prevColors, setPrevColors] = useState<string[]>([])
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    setPrevColors(prevColors => [...prevColors, e.target.value])
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


      </section>
    </main>
  )
}
function App() {
  return (
    <main>
      <TopBar />
      <ColorPicker />
    </main>
  );
}

export default App;
