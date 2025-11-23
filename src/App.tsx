import { useState } from 'react';
import './App.css';

import PaperModule from './components/paper';
import DividendModule from './components/dividend';
import OptionModule from './components/option';
// import ContractModule from './components/contract';

function App() {

  const [selected, setSelected] = useState(0);

  function renderSection() {
    switch(selected) {
      case 0:
        return <PaperModule/>;
      case 1:
        return <DividendModule/>;
      case 2:
        return <OptionModule/>;
    }
  }

  return (
    <>
      <ul className='flex flex-col sm:flex-row sm:gap-10 justify-center items-center list-none bg-fuchsia-700 rounded-md'>
        <li
          key={0}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer font-semibold hover:bg-fuchsia-900 ${selected === 0 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(0)}
        >
          Growth Calculator
        </li>
        <li
          key={1}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer font-semibold hover:bg-fuchsia-900 ${selected === 1 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(1)}
        >
          Dividend Calculator
        </li>
        <li
          key={2}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer font-semibold hover:bg-fuchsia-900 ${selected === 2 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(2)}
        >
          Option Calculator
        </li>
      </ul>
      { renderSection() }
    </>
  )
}

export default App;
