import './App.css';
import { useState } from 'react';
import DividendModule from './pages/dividend';
import PaperModule from './pages/paper';
import OptionModule from './pages/option';
import icon from "./assets/icon.ico";

function App() {

  interface Page {
    id: number,
    title: string;
    module: JSX.Element;
  }

  const pages: Page[] = [
    {id: 0, title: "Growth Tracking", module: <PaperModule/>},
    {id: 1, title: "Dividend Tracking", module: <DividendModule/>},
    {id: 2, title: "Option Calculator", module: <OptionModule/>},
  ];

  const [selected, setSelected] = useState<Page>(pages[1]);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  function renderSection() {
    return selected.module;
  }

  return <>
    <div  className="relative rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 mb-10 pb-6 pt-6 shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
        <div className="flex justify-between items-center">
          <img className="hidden sm:block" src={icon} width={64} />
          <h1 className="text-[38px] font-medium text-[#f0f0f5] tracking-tight">
            {selected.title}
          </h1>
          <svg
            onClick={() => setNavOpen((o) => !o)}
            className="cursor-pointer hover:text-[#26c6da]"
            width="32" height="32" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: navOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={`flex flex-col items-end ${navOpen ? '' : 'hidden'}`}>
          { pages.map((page) => {
            console.log(page);
            if (page.id != selected.id)
              return <div
                key={page.id}
                className="cursor-pointer text-[30px] font-medium hover:text-[#26c6da]"
                onClick={() => {
                  setSelected(page)
                  setNavOpen(false);
                }}
              >
                {page.title}
              </div>    
          }) }
        </div>
    </div>
    { renderSection() }
  </>
}

export default App;
