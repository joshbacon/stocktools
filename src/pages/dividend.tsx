import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";

function DividendModule () {

    interface TickerData {
        ticker: string,
        name: string,
        numShares: number,
        price: number,
        yield: number,
        monthly: boolean,
        found: boolean
    }

    const emptyTicker:TickerData = {
        ticker: "",
        name: "",
        numShares: 0,
        price: 0,
        yield: 0,
        monthly: false,
        found: false
    }

    const [tickerList, setTickerList] = useState<TickerData[]>([emptyTicker]);

    const [effectiveYield, setEffectiveYield] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [totalDrips, setTotalDrips] = useState<number>(0);
    

    // Load existing ticker list from local storage
    useEffect(() => {
        let tickerData:string|null = localStorage.getItem("tickerList");
        if (tickerData) {
            let data:TickerData[] = JSON.parse(tickerData);
            setTickerList(data);
            refreshTickers(data);
            updateTotals(data);
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
                    temp[i].yield = newData.yield;
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
        updateTotals(temp);
    }

    // API call to get ticker data
    async function getTickerData(ticker:string) : Promise<TickerData> {
        // let tickerPath = "localhost:9001/dividend?ticker=" + ticker;
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
                temp[index].yield = data.yield;
            }
        });
        setTickerList(temp);
    }

    // Updates the output values
    function updateTotals(data?:TickerData[]) {

        let recentList:TickerData[] = data ?? tickerList;

        // Find total yield dollar amount
        let yieldTotal:number = recentList.reduce((total, ticker) => {
            return total + (
                ticker.found && ticker.yield !== undefined ?
                (ticker.numShares * ticker.yield) : 0
            )
        }, 0);
        setTotal(yieldTotal);
        
        // Find total price dollar amount
        let priceTotal:number = recentList.reduce((total, ticker) => {
            return total + (
                ticker.found && ticker.price !== undefined ?
                (ticker.numShares * ticker.price) : 0
            )
        }, 0);
        if (priceTotal > 0)
            setEffectiveYield( (yieldTotal / priceTotal) * 100 )
        else
            setEffectiveYield(0);

        // Find total number of shares DRIPed per payout
        let dripTotal:number = recentList.reduce((total, ticker) => {
            return total + (
                ticker.found && ticker.price !== undefined ?
                Math.floor(((ticker.numShares * ticker.yield) / (ticker.monthly ? 12 : 4)) / ticker.price) : 0
            )
        }, 0);
        setTotalDrips(dripTotal);
        
        // Save updated ticker list to local storage
        localStorage.setItem("tickerList", JSON.stringify(recentList));
    }

    // Mark a ticker as a monthly dividend payer
    function updateMonthly(index:number) {
        let temp:TickerData[] = [...tickerList];
        temp[index].monthly = !tickerList[index].monthly;
        setTickerList(temp);
        // Save updated ticker list to local storage
        localStorage.setItem("tickerList", JSON.stringify(tickerList));
        updateTotals();
    }

    // Currency formatter
    let currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

    // Percent formatter
    let percentFormatter = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
    });


    // Drip Calculation list item component
    function dripItem(tickerData:TickerData, key:number) {

        let divPerPayment:number = tickerData.numShares * (tickerData.yield / (tickerData.monthly ? 12 : 4));
        let sharesDripped:number = ((tickerData.numShares * tickerData.yield) / (tickerData.monthly ? 12 : 4)) / tickerData.price;

        return <tr key={key} >
            <td>
                <input
                    type="text"
                    title={tickerData.name}
                    value={tickerData.ticker}
                    className="pl-1 w-36 bg-transparent hover:bg-[#242424] text-center rounded outline-none font-dm-sans text-sm font-normal uppercase tracking-[0.04em]" 
                    onChange={(e) => handleTickerChange(key, e.target.value)}
                    onBlur={(e) => {
                        updateTicker(key, e.target.value);
                        updateTotals();
                    }}
                />
            </td>
            <td>
                <input
                    type="number"
                    min={0}
                    value={tickerData.numShares}
                    className="pl-1 w-24 bg-transparent hover:bg-[#242424] text-center rounded outline-none font-dm-mono tracking-tight"
                    onChange={(e) => updateNumShares(key, e.target.value)}
                    onBlur={(_) => {
                        updateTotals();
                    }}
                />
            </td>
            <td className="font-dm-mono tracking-tight">{percentFormatter.format(tickerData.yield / tickerData.price)}</td>
            <td>
                <button className="font-dm-sans text-sm font-normal uppercase tracking-[0.04em]" onClick={() => {
                    updateMonthly(key);
                }}>
                    {tickerData.monthly ? "MONTHLY" : "QUARTERLY"}
                </button>
            </td>
            <td className="font-dm-mono tracking-tight">{currencyFormatter.format(divPerPayment)}</td>
            <td className="font-dm-mono tracking-tight">{Math.floor(sharesDripped)} ({percentFormatter.format(sharesDripped - Math.floor(sharesDripped))})</td>
            <td>
                <button
                    className='hover:drop-shadow-remove inline ml-2'
                    onClick={() => removeTicker(key)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path fill="#be123c" d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"/></svg>
                </button>
            </td>
        </tr>
    }
    
    // Main component
    return <div className="flex flex-col gap-10">
        <div className="flex flex-wrap justify-center gap-10">
            <StatCard title={"Effective Dividend Yield"} amount={effectiveYield} icon={"💸"} format={"percent"} />
            <StatCard title={"Total Annual Dividends"} amount={total} icon={"💲"} />
            <StatCard title={"DRIPs Per Payout"} amount={totalDrips} icon={"📈"} format={"int"} />
        </div>
        <div className="relative rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 pb-6 pt-10 overflow-x-auto shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
            <table className="border-separate border-spacing-x-10 border-spacing-y-1">
                <thead>
                    <tr>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="Stock ticker following yahoo finance formatting (e.x. use .TO for TSX stocks)"
                        >
                            Ticker
                        </th>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="Number of shares currently held for a given stock"
                        >
                            Number of Shares
                        </th>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="Dividend yield percentage of a given stock"
                        >
                            Dividend Yield
                        </th>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="How often a stock pays out dividends (monthly or quarterly)"
                        >
                            Payout Frequency
                        </th>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="Dollar amount you get paid based on yield and number of shares held"
                        >
                            Amount Per Payout
                        </th>
                        <th
                            className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]"
                            title="Number of shares each dividend payout can DRIP.
Percentage represents how close you are to another share"
                        >
                            Number of Shares DRIPed
                        </th>
                    </tr>
                    <tr>
                        <td colSpan={7} className="p-0">
                            <div className="h-0.5 mt-3.5 mb-3.5 rounded-lg bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
                        </td>
                    </tr>
                </thead>
                <tbody>
                    { tickerList.map((ticker, index) => {
                        return dripItem(ticker, index);
                    }) }
                    <tr>
                        <td>
                            <button className="rounded-lg mt-2 hover:drop-shadow-add" onClick={addTicker} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36px" height="36px"><path fill="#46c1a2" d="M25,2c-12.6907,0 -23,10.3093 -23,23c0,12.69071 10.3093,23 23,23c12.69071,0 23,-10.30929 23,-23c0,-12.6907 -10.30929,-23 -23,-23zM25,4c11.60982,0 21,9.39018 21,21c0,11.60982 -9.39018,21 -21,21c-11.60982,0 -21,-9.39018 -21,-21c0,-11.60982 9.39018,-21 21,-21zM24,13v11h-11v2h11v11h2v-11h11v-2h-11v-11z"/></svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="h-0.5 w-full mt-8 mb-8 rounded-lg bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
            <h1 className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">Dividend income by the...</h1>
            <div className="flex flex-wrap justify-center gap-10 mt-5">
                <div>
                    <h2 className="text-m font-normal uppercase tracking-[0.04em] text-[#9696a0] mb-2">Quarter</h2>
                    <h2 className="text-2xl font-dm-mono font-medium text-[#f0f0f5] tracking-tight">{currencyFormatter.format(total/4)}</h2>
                </div>
                <div>
                    <h2 className="text-m font-normal uppercase tracking-[0.04em] text-[#9696a0] mb-2">Month</h2>
                    <h2 className="text-2xl font-dm-mono font-medium text-[#f0f0f5] tracking-tight">{currencyFormatter.format(total/12)}</h2>
                </div>
                <div>
                    <h2 className="text-m font-normal uppercase tracking-[0.04em] text-[#9696a0] mb-2">Day</h2>
                    <h2 className="text-2xl font-dm-mono font-medium text-[#f0f0f5] tracking-tight">{currencyFormatter.format(total/365)}</h2>
                </div>
                <div>
                    <h2 className="text-m font-normal uppercase tracking-[0.04em] text-[#9696a0] mb-2">Minute</h2>
                    <h2 className="text-2xl font-dm-mono font-medium text-[#f0f0f5] tracking-tight">{currencyFormatter.format(total/525960)}</h2>
                </div>
            </div>
        </div>
    </div>
}

export default DividendModule;