import { useEffect, useState } from 'react';
import axios from 'axios';

function DividendModule () {

    interface TickerData {
        ticker: string,
        name: string,
        numShares: number,
        price: number,
        yieldAmount: number,
        monthly: boolean,
        found: boolean
    }

    const emptyTicker:TickerData = {
        ticker: "",
        name: "",
        numShares: 0,
        price: 0,
        yieldAmount: 0,
        monthly: false,
        found: false
    }

    const [tickerList, setTickerList] = useState<TickerData[]>([emptyTicker]);

    const [total, setTotal] = useState<number>(0);
    const [effectiveYield, setEffectiveYield] = useState<number>(0);

    // Load existing ticker list from local storage
    useEffect(() => {
        let storedData:string|null = localStorage.getItem("tickerList");
        if (storedData) {
            let data:TickerData[] = JSON.parse(storedData);
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
                    temp[i].price = newData.price;
                    temp[i].yieldAmount = newData.yieldAmount;
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
        let tickerPath = "http://172.105.104.89:9001/hello?ticker=" + ticker;
        let data:TickerData = (await axios.get(tickerPath)).data;
        return data;
    }

    // Update the number of shares at a list index
    function updateNumShares(index:number, value:string){
        let temp = [...tickerList];
        temp[index].numShares = parseInt(value);
        setTickerList(temp);
    }

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
                temp[index].yieldAmount = data.yieldAmount;
            }
        });
        setTickerList(temp);
    }

    // Updates the output values
    function updateTotals() {
        // Find total yield dollar amount
        let yieldTotal:number = tickerList.reduce((total, ticker) => {
            return total + (
                ticker.found && ticker.yieldAmount !== undefined ?
                (ticker.numShares * ticker.yieldAmount) : 0
            )
        }, 0);
        setTotal(yieldTotal);
        
        // Find total price dollar amount
        let priceTotal:number = tickerList.reduce((total, ticker) => {
            return total + (
                ticker.found && ticker.price !== undefined ?
                (ticker.numShares * ticker.price) : 0
            )
        }, 0);
        if (priceTotal > 0)
            setEffectiveYield( (yieldTotal / priceTotal) * 100 )
        else
            setEffectiveYield(0);
        
        // Save updated ticker list to local storage
        localStorage.setItem("tickerList", JSON.stringify(tickerList));
    }

    // Mark a ticker as a monthly dividend payer
    function updateMonthly(index:number) {
        let temp:TickerData[] = [...tickerList];
        temp[index].monthly = !tickerList[index].monthly;
        setTickerList(temp);
        // Save updated ticker list to local storage
        localStorage.setItem("tickerList", JSON.stringify(tickerList));
    }

    // Ticker list item component
    function tickerListItem(tickerData:TickerData, key:number) {
        // TODO: add a remove button
        return <div key={key} className="flex flex-row gap-1 mt-2 text-center justify-center">
            <input
                type="number"
                min={0}
                value={tickerData.numShares}
                className="pl-1 w-24 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                onChange={(e) => updateNumShares(key, e.target.value)}
            />
            <p>shares of</p>
            <input
                type="text"
                title={`${tickerData.ticker} - $${tickerData.price}`}
                value={tickerData.ticker}
                className="pl-1 w-36 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                onChange={(e) => handleTickerChange(key, e.target.value)}
                onBlur={(e) => updateTicker(key, e.target.value)}
            />
            <p>at</p>
            <p className="text-green-600 font-bold">${tickerData.yieldAmount.toFixed(2)}</p>
            <p>a share / year</p>
            <button
                className='hover:drop-shadow-remove'
                onClick={() => removeTicker(key)}
            >
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path fill="#be123c" d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"/></svg>
            </button>
        </div>
    }

    // Drip Calculation list item component
    function dripItem(tickerData:TickerData, key:number) {

        let divPerShare:number = tickerData.yieldAmount / (tickerData.monthly ? 12 : 4);
        let divPerPayment:number = tickerData.numShares * divPerShare;
        let sharesDripped:number = ((tickerData.numShares * tickerData.yieldAmount) / (tickerData.monthly ? 12 : 4)) / tickerData.price;

        return <div key={key} className='flex justify-around'>
            <h2 className='w-1/4 text-fuchsia-700 font-bold'>{tickerData.ticker}</h2>
            <h2 className='w-1/4 text-orange-600 font-bold'>
                <button onClick={() => {
                    updateMonthly(key);
                }}>
                    {tickerData.monthly ? "Monthly" : "Quarterly"}
                </button>
            </h2>
            <h2 className='w-1/4 text-green-600 font-bold'>${tickerData.price}</h2>
            <h2 className='w-1/4 text-green-600 font-bold'>${divPerShare.toFixed(2)}</h2>
            <h2 className='w-1/4 text-sky-600 font-bold'>${divPerPayment.toFixed(2)}</h2>
            <h2 className='w-1/4 text-sky-600 font-bold'>{Math.floor(sharesDripped)} ({((sharesDripped - Math.floor(sharesDripped)) * 100).toFixed(0)}%)</h2>
        </div>
    }

    // Main component
    return <div className="flex justify-center mt-5 bg-gradient-to-br from-purple-800 to-fuchsia-700 rounded-md font-semibold drop-shadow-card">
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
            <section className='border-t-2 border-zinc-500 mt-5 pt-2'>
                <ul className='list-none text-xl flex flex-col items-center'>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-green-600'>${total.toFixed(2)}</h1><h1> / year</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-green-600'>${(total/4).toFixed(2)}</h1><h1> / quarter</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-green-600'>${(total/12).toFixed(2)}</h1><h1> / month</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-green-600'>${(total/365).toFixed(2)}</h1><h1> / day</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1 className='text-green-600'>${(total/525960).toFixed(2)}</h1><h1> / minute</h1>
                    </li>
                    <li className='flex flex-row gap-1'>
                        <h1>Effective Yield:</h1><h1 className='text-green-600'>{effectiveYield.toFixed(2)}%</h1>
                    </li>
                </ul>
            </section>
            <section className='border-t-2 border-zinc-500 mt-5 pt-2'>
                <h2 className="text-lg">Drip Calculator</h2>
                <div className='flex justify-around border-b border-zinc-500'>
                    <h2 className='w-1/4 text-fuchsia-700 font-bold'>Ticker</h2>
                    <h2 className='w-1/4 text-orange-600 font-bold'>Monthly</h2>
                    <h2 className='w-1/4 text-green-600 font-bold'>Price</h2>
                    <h2 className='w-1/4 text-green-600 font-bold'>Div Payment / Share</h2>
                    <h2 className='w-1/4 text-sky-600 font-bold'>Div Payment / Period</h2>
                    <h2 className='w-1/4 text-sky-600 font-bold'>Num Shares Dripped</h2>
                </div>
                { tickerList.map((ticker, index) => {
                    return dripItem(ticker, index);
                }) }
            </section>
        </div>
    </div>
}

export default DividendModule;