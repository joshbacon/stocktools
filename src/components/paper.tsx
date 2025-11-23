import { useEffect, useState } from 'react';
import axios from 'axios';

function PaperModule () {

    interface TickerData {
        ticker: string,
        name: string,
        numShares: number,
        price: number,
        avgCost: number,
        found: boolean
    }

    const emptyTicker:TickerData = {
        ticker: "",
        name: "",
        numShares: 0,
        price: 0,
        avgCost: 0,
        found: false
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const [tickerList, setTickerList] = useState<TickerData[]>([emptyTicker]);

    const [totalCost, setTotalCost] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);

    // Load existing ticker list from local storage
    useEffect(() => {
        let tickerData:string|null = localStorage.getItem("growthTickerList");
        if (tickerData) {
            let data:TickerData[] = JSON.parse(tickerData);
            setTickerList(data);
            refreshTickers(data);
        }
    }, []);

    // Grab the newest price and yield
    async function refreshTickers(data:TickerData[]) {
        let temp:TickerData[] = [...data];
        for (let i:number = 0; i < temp.length; i++){
            await getTickerData(temp[i].ticker).then(newData => {
                if (newData.found) {
                    temp[i].found = newData.found;
                    temp[i].price = newData.price;
                }
            });
        }
        setTickerList(temp);
    }

    // Adds an empty ticker item to the list
    function addTicker() {
        let temp = [...tickerList];
        temp.push(emptyTicker);
        setTickerList(temp);
    }

    // Removes a given ticker from the list
    function removeTicker(key:number) {
        let temp = [...tickerList];
        temp.splice(key, 1);
        setTickerList(temp);
    }

    // API call to get ticker data
    async function getTickerData(ticker:string) : Promise<TickerData> {
        let tickerPath = "http://172.105.104.89:9001/dividend?ticker=" + ticker;
        let data:TickerData = (await axios.get(tickerPath)).data;
        return data;
    }

    // Update the number of shares at a list index
    function updateNumShares(index:number, value:string){
        let temp = [...tickerList];
        temp[index].numShares = parseInt(value);
        setTickerList(temp);
    }

    // Update state on ticker change
    function handleTickerChange(index:number, value:string) {
        let temp = [...tickerList];
        temp[index].ticker = value.toUpperCase();
        setTickerList(temp);
    }

    // Update the ticker at a list index
    async function updateTicker(index:number, value:string){
        let temp = [...tickerList];
        await getTickerData(value).then(data => {
            temp[index].found = data.found;
            if (data.found) {
                temp[index].name = data.name;
                temp[index].price = data.price;
            }
        });
        setTickerList(temp);
    }

    // Update the number of shares at a list index
    function updateAvgCost(index:number, value:string){
        let temp = [...tickerList];
        temp[index].avgCost = parseFloat(value);
        setTickerList(temp);
    }

    // Updates the output values
    function updateTotals() {        
        // Find total price dollar amount
        let totalCost:number = 0;
        let totalValue:number = 0;
        for (let i=0; i < tickerList.length; i++) {
            let currTicker:TickerData = tickerList[i];
            if (currTicker.found && currTicker.price !== undefined) {
                totalCost += currTicker.numShares * currTicker.avgCost;
                totalValue += currTicker.numShares * currTicker.price;
            }
        }
        setTotalCost(totalCost);
        setTotalValue(totalValue);
        
        // Save updated ticker list to local storage
        localStorage.setItem("growthTickerList", JSON.stringify(tickerList));
    }

    // Ticker list item component
    function tickerListItem(tickerData:TickerData, key:number) {
        return <div key={key} className="flex flex-row flex-wrap gap-1 mt-2 text-center justify-center border-zinc-500 border-opacity-50 border-b-2 sm:border-b-0 pb-2 sm:pb-0">
            <input
                type="number"
                min={0}
                value={tickerData.numShares}
                className="pl-1 w-24 bg-fuchsia-700 bg-opacity-50 rounded outline-none inline"
                onChange={(e) => updateNumShares(key, e.target.value)}
            />
            <p className='inline ml-2'>shares of</p>
            <input
                type="text"
                title={tickerData.name}
                value={tickerData.ticker}
                className="pl-1 w-36 bg-fuchsia-700 bg-opacity-50 rounded outline-none inline ml-2"
                onChange={(e) => handleTickerChange(key, e.target.value)}
                onBlur={(e) => updateTicker(key, e.target.value)}
            />
            <p className='inline ml-2'>at</p>
            <input
                type="number"
                min={0}
                value={tickerData.avgCost}
                className="pl-1 w-36 bg-fuchsia-700 bg-opacity-50 rounded outline-none inline ml-2"
                onChange={(e) => updateAvgCost(key, e.target.value)}
            />
            <p className='inline ml-2'>from {formatter.format(tickerData.price)}</p>
            <button
                className='hover:drop-shadow-remove inline ml-2'
                onClick={() => removeTicker(key)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path fill="#be123c" d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"/></svg>
            </button>
        </div>
    }

    // Ticker list item component
    function growthListItem(tickerData:TickerData, key:number) {
        let cost = tickerData.numShares * tickerData.avgCost;
        let value = tickerData.numShares * tickerData.price;
        return <div key={key} className="flex justify-around gap-1 mt-2 text-center border-zinc-500 border-opacity-50 border-b-2 sm:border-b-0 pb-2 sm:pb-0">
            <p className='w-1/4 min-w-28 inline ml-2 pr-3'>{tickerData.ticker}</p>
            <p className='w-1/4 min-w-28 inline ml-2 text-sky-600'>Cost: {formatter.format(tickerData.numShares * tickerData.avgCost)}</p>
            <p className='w-1/4 min-w-28 inline ml-2 text-fuchsia-700'>Value: {formatter.format(tickerData.numShares * tickerData.price)}</p>
            <p className={`w-1/4 min-w-28 inline ml-2 ${value - cost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Growth: {value - cost < 0 ? "-" : ""}{formatter.format(Math.abs(value - cost))} ({(((value / cost) - 1) * 100).toFixed(2)}%)
            </p>
        </div>
    }

    // Main component
    return <div className="flex justify-center mt-5 bg-gradient-to-br from-purple-800 to-fuchsia-700 rounded-md font-semibold drop-shadow-card overflow-x-hidden">
        <div className="bg-neutral-800 w-full m-1 p-3">
            <section>
                <h2 className="text-lg">I have:</h2>
                { tickerList.map((ticker, index) => {
                    return tickerListItem(ticker, index);
                }) }
                <div className='mt-5 flex justify-center gap-5'>
                    <button
                        className='border border-zinc-500 rounded-lg px-5 py-1 hover:border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                        onClick={addTicker}
                    >
                        Add Ticker
                    </button>
                    <button
                        className='border border-zinc-500 rounded-lg px-5 py-1 hover:border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                        onClick={updateTotals}
                    >
                        Update
                    </button>
                </div>
            </section>
            <section className='border-t-2 border-zinc-500 mt-5 pt-2 overflow-x-auto'>
                { tickerList.map((ticker, index) => {
                    return growthListItem(ticker, index);
                }) }
            </section>
            <section className='border-t-2 border-zinc-500 mt-5 pt-2 flex justify-evenly flex-wrap'>
                <ul className='list-none text-xl flex flex-col items-center'>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-3xl'>Total Cost</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-2xl text-sky-600'>
                            {formatter.format(totalCost)}
                        </h1>
                    </li>
                </ul>
                <ul className='list-none text-xl flex flex-col items-center'>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-3xl'>Total Value</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-2xl text-fuchsia-700'>
                            {formatter.format(totalValue)}
                        </h1>
                    </li>
                </ul>
                <ul className='list-none text-xl flex flex-col items-center'>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-3xl'>Total Growth</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className={`text-2xl ${totalValue - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalValue - totalCost < 0 ? "-" : ""}{formatter.format(Math.abs(totalValue - totalCost))}
                        </h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className={`text-2xl ${totalValue - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((1 - (totalCost / totalValue)) * 100).toFixed(2)}%
                        </h1>
                    </li>
                </ul>
            </section>
        </div>
    </div>
}

export default PaperModule;