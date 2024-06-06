import { useState } from 'react';
import './App.css';

import DividendModule from './components/dividend';
import OptionModule from './components/option';
import AnalysisModule from './components/analysis';

function App() {

  const [selected, setSelected] = useState(0);

  function renderSection() {
    switch(selected) {
      case 0:
        return <DividendModule/>;
      case 1:
        return <OptionModule/>;
      case 2:
        return <AnalysisModule/>;
    }
  }

  return (
    <>
      <ul className='flex flex-row justify-center gap-10 list-none bg-fuchsia-700 rounded-md'>
        <li
          key={0}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer hover:bg-fuchsia-900 ${selected === 0 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(0)}
        >
            Dividend Calculator
        </li>
        <li
          key={1}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer hover:bg-fuchsia-900 ${selected === 1 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(1)}
        >
            Option Calculator
        </li>
        <li
          key={2}
          className={`my-1 py-1 px-3 rounded-md cursor-pointer hover:bg-fuchsia-900 ${selected === 2 ? 'bg-zinc-800' : ''}`}
          onClick={() => setSelected(2)}
        >
            Stock Analysis
        </li>
      </ul>
      { renderSection() }
    </>
  )
}

export default App;
