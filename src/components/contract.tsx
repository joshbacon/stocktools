// import { useState } from 'react';
// import axios from 'axios';

// function ContractModule () {

//     interface OptionData {
//         ticker: string,
//         cost: number,
//         lastSale: number,
//         ask: number,
//         bid: number,
//     }

//     const [plDollar, setPlDollar] = useState<number>(0);
//     const [plPercent, setPlPercent] = useState<number>(0);
//     const [totalDollar, settotalDollar] = useState<number>(0);
//     const [totalPercent, settotalPercent] = useState<number>(0);


//     const [brokerageFee, setBrokerageFee] = useState<number>(5.95);
//     const [contractFee, setContractFee] = useState<number>(1.25);
    
//     const [ticker, setTicker] = useState<string>("");
//     const [contractPremium, setContractPremium] = useState<number>(0.3);
//     const [lastSale, setLastSale] = useState<number>(0.42);

//     // API call to get option data for the ticker
//     async function getOptionData(ticker:string) : Promise<OptionData> {
//         // let tickerPath = "http://172.105.104.89:9001/option?ticker=" + ticker;
//         let tickerPath = "http://localhost:3000/option?ticker=" + ticker;
//         console.log(tickerPath);
//         let temp = await axios.get(tickerPath);
//         console.log(temp.data);
//         let data:OptionData = (await axios.get(tickerPath)).data;
//         console.log(data)
//         return data;
//     }

//     async function updateOutput() {
//         await getOptionData(ticker).then(data => {
//             console.log(data);
//         });
//     }

//     function contractWidget(index:number) {
//         return <div className='grid grid-cols-4'>
//             <div>
//                 <h1 className='pb-3'>Ticker</h1>
//                 <input
//                     type="text"
//                     value={ticker}
//                     className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
//                     onChange={(e) => setTicker(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <h1 className='pb-3'>Premium Paid</h1>
//                 <input
//                     type="number"
//                     min={0}
//                     value={contractPremium}
//                     className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
//                     onChange={(e) => setContractPremium(parseFloat(e.target.value))}
//                 />
//             </div>
//             <div>
//                 <h1 className='pb-3'>Last Sale</h1>
//                 <input
//                     type="number"
//                     min={0}
//                     value={lastSale}
//                     className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
//                     onChange={(e) => setLastSale(parseFloat(e.target.value))}
//                 />
//             </div>
//             <div>
//                 <h1>P/L</h1>
//                 <div className='flex flex-col'>
//                     <h2 className={`${plDollar >= 0 ? 'text-green-600' : 'text-red-600'}`}>${plDollar}</h2>
//                     <h2 className={`${plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{plPercent}%</h2>
//                 </div>
//             </div>
//         </div>;
//     }

//     return <div className="flex justify-center mt-5 bg-gradient-to-br from-purple-800 to-fuchsia-700 rounded-md font-semibold drop-shadow-card overflow-x-hidden">
//         <div className="bg-neutral-800 w-full m-1 p-3">
//             <section className='flex justify-around'>
//                 <div>
//                     <h1 className='pb-3'>Flat Brokerage Fees</h1>
//                     <input
//                         type="number"
//                         min={0}
//                         value={brokerageFee}
//                         className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
//                         onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
//                     />
//                 </div>
//                 <div>
//                     <h1 className='pb-3'>Per Contract Brokerage Fees</h1>
//                     <input
//                         type="number"
//                         min={0}
//                         value={contractFee}
//                         className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
//                         onChange={(e) => setContractFee(parseFloat(e.target.value))}
//                     />
//                 </div>
//             </section>

//             <section className='flex flex-col gap-3 border-t-2 border-zinc-500 mt-5 pt-2'>
//                 <h1 className='text-xl font-bold pb-3'>Ongoing Contracts</h1>
//                 {
//                     contractWidget(1)
//                 }
//                 <div className='grid grid-cols-4'>
//                     <div className='col-start-4'>
//                         <h1>Total P/L</h1>
//                         <div className='flex flex-col'>
//                             <h2 className={`${totalDollar >= 0 ? 'text-green-600' : 'text-red-600'}`}>${totalDollar}</h2>
//                             <h2 className={`${totalPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{totalPercent}%</h2>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='mt-5 flex justify-center gap-5'>
//                     <button
//                         className='border border-zinc-500 rounded-lg px-5 py-1 hover:border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
//                         onClick={updateOutput}
//                     >
//                         Update
//                     </button>
//                 </div>
//             </section>
//         </div>
//     </div>
// }

// export default ContractModule;