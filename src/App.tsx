import React from 'react';
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
function App() {
  return (
    <main>
      <TopBar />
    </main>
  );
}

export default App;
