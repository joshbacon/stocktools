import './App.css';
import { useState } from 'react';
import DividendModule from './pages/dividend';
import PaperModule from './pages/paper';
import OptionModule from './pages/option';
import icon from "./assets/icon.ico";

function App() {

  const [selected, setSelected] = useState(2);
  const [navOpen, setNavOpen] = useState(false);

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

  return <>
    <div onClick={() => setNavOpen((o) => !o)} className="relative cursor-pointer rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 mb-10 pb-6 pt-6 overflow-hidden shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
        <div className="flex justify-between items-center">
          <img className="hidden sm:block" src={icon} width={64} />
          <h1 className="text-[38px] font-medium text-[#f0f0f5] tracking-tight">
            Dividend Tracking
          </h1>
          <svg width="32" height="32" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: navOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          >
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
    </div>
    { renderSection() }
  </>
}

export default App;
