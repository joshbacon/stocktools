import { useState } from 'react';

function OptionModule () {

    // Breakeven Calculator Variables
    const [brokerageFee, setBrokerageFee] = useState<number>(5.95);
    const [contractFee, setContractFee] = useState<number>(1.25);
    const [numberOfContracts, setNumberOfContracts] = useState<number>(5);
    const [contractPremium, setContractPremium] = useState<number>(0.25);

    const [breakevenIncrease, setBreakevenIncrease] = useState<number>(0);
    const [breakevenPremium, setBreakevenPremium] = useState<number>(0);

    // Profit Calculator Variables
    const [saleBreakevenPremium, setSaleBreakevenPremium] = useState<number>(0.25);
    const [salePremium, setSalePremium] = useState<number>(0.35);

    const [profitLoss, setProfitLoss] = useState<number>(0);
    const [percentProfit, setPrecentProfit] = useState<number>(0);

    // Volume Calculator Variables
    const [budgetAmount, setBudgetAmount] = useState<number>(100);
    const [budgetPremium, setBudgetPremium] = useState<number>(0.30);

    const [budgetContracts, setBudgetContracts] = useState<number>(0);

    // Spreac Calculator Variables
    const [numCalls, setNumCalls] = useState<number>(4);
    const [callPremium, setCallPremium] = useState<number>(0.25);
    const [costOfCalls, setCostOfCalls] = useState<number>(0);
    const [callFees, setCallFees] = useState<number>(0);
    const [costOfPuts, setCostOfPuts] = useState<number>(0);
    const [numPuts, setNumPuts] = useState<number>(4);
    const [putFees, setPutFees] = useState<number>(0);
    const [putPremium, setPutPremium] = useState<number>(0.32);
    const [spreadWinner, setSpreadWinner] = useState<string>("calls");
    const [spreadSalePremium, setSpreadSalePremium] = useState<number>(1);
    const [spreadSaleTotal, setSpreadSaleTotal] = useState<number>(0);
    const [spreadReturnDollar, setSpreadReturnDollar] = useState<number>(0);
    const [spreadReturnPercent, setSpreadReturnPercent] = useState<number>(0);

    // Find the breackeven increase and total breakeven premium
    function calculateBreakeven() {
        const openFees:number = brokerageFee + (contractFee * numberOfContracts);
        const increase:number = openFees*2 / (numberOfContracts * 100);
        setBreakevenIncrease(increase);
        setBreakevenPremium(contractPremium + increase);
        setSaleBreakevenPremium(contractPremium + increase);
    }

    // Calculate the sale P/L
    function calculateProfit() {
        const initialCost:number = brokerageFee + (contractFee * numberOfContracts) + (contractPremium * numberOfContracts * 100);
        const difference:number = (salePremium - saleBreakevenPremium) * numberOfContracts * 100;
        setProfitLoss(difference);
        setPrecentProfit((((difference + initialCost) / initialCost) -1) * 100);
    }

    // Calucalte how many shares can be bought at a certain premium with a given amount of money
    function calculateBudgetContracts() {
        const workingBudget:number = budgetAmount - brokerageFee;
        const numContracts:number = Math.floor(workingBudget / (budgetPremium * 100 + contractFee));
        setBudgetContracts(numContracts);
    }

    // Calculate the total P/L for a long straddle assuming one contract expires worthless
    function calculateSpread() {
        const callOpenFees = brokerageFee + numCalls * contractFee;
        const putOpenFees = brokerageFee + numPuts * contractFee;
        setCallFees(callOpenFees);
        setPutFees(putOpenFees);

        const callsOpenCost:number = brokerageFee + (contractFee + callPremium * 100) * numCalls;
        const putsOpenCost:number = brokerageFee + (contractFee + putPremium * 100) * numPuts;
        setCostOfCalls(callsOpenCost);
        setCostOfPuts(putsOpenCost);
        
        const totalSale:number = (spreadWinner === "calls" ? numCalls : numPuts) * spreadSalePremium * 100;
        const totalReturn:number = totalSale - callsOpenCost - callOpenFees - putsOpenCost - putOpenFees;
        setSpreadSaleTotal(totalSale - (callOpenFees + putOpenFees));
        setSpreadReturnDollar(totalReturn);
        setSpreadReturnPercent((totalReturn / (callsOpenCost + putsOpenCost)) * 100);
    }

    return <div className="flex justify-center mt-5 bg-gradient-to-br from-purple-800 to-fuchsia-700 rounded-md font-semibold drop-shadow-card">
        <div className="bg-neutral-800 w-full m-1 p-3">
            <section className='flex flex-col gap-5 text-lg'>
                <h1 className='text-2xl'>Breakeven Calculator</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:text-end'>
                    <h1>Flat Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                    <h1>Per Contract Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                    <h1>Number of Contracts Bought</h1>
                    <input
                        type="number"
                        min={0}
                        value={numberOfContracts}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setNumberOfContracts(parseInt(e.target.value))}
                    />
                    <h1>Contract Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setContractPremium(parseFloat(e.target.value))}
                    />
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>Premium Increase Required</h1>
                    <h1 className='text-green-600 font-bold'>${breakevenIncrease.toFixed(4)}</h1>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>Breakeven Premium</h1>
                    <h1 className='text-green-600 font-bold'>${breakevenPremium.toFixed(4)}</h1>
                </div>
                <button
                    className='rounded-lg px-5 py-1 border border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                    onClick={calculateBreakeven}
                >
                    Calculate
                </button>
            </section>

            <section className='border-t-2 border-zinc-500 mt-5 pt-2 flex flex-col gap-5 text-lg'>
                <h1 className='text-2xl'>Profit Calculator</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:text-end'>
                    <h1>Breakeven Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={saleBreakevenPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setSaleBreakevenPremium(parseFloat(e.target.value))}
                    />
                    <h1>Desired Sale Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={salePremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setSalePremium(parseFloat(e.target.value))}
                    />
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>P/L Dollar Amount</h1>
                    <h1 className={`${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>${profitLoss.toFixed(2)}</h1>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>P/L Percentage</h1>
                    <h1 className={`${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>{percentProfit.toFixed(2)}%</h1>
                </div>
                <button
                    className='rounded-lg px-5 py-1 border border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                    onClick={calculateProfit}
                >
                    Calculate
                </button>
            </section>

            <section className='border-t-2 border-zinc-500 mt-5 pt-2 flex flex-col gap-5 text-lg'>
                <h1 className='text-2xl'>Volume Calculator</h1>
                <div>
                {/* <div className='flex gap-2 justify-center'> */}
                    <h1 className='inline'>How many contracts can I buy with</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetAmount}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none inline ml-2"
                        onChange={(e) => setBudgetAmount(parseFloat(e.target.value))}
                    />
                    <h1 className='inline ml-2'>at a premium of</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none inline ml-2"
                        onChange={(e) => setBudgetPremium(parseFloat(e.target.value))}
                    />
                    <h1 className='inline ml-2'>?</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5 sm:text-end'>
                    <h1>Flat Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                    <h1>Per Contract Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                </div>
                <div>
                    <h1 className='inline ml-2'>${budgetAmount} can buy</h1>
                    <h1 className='text-green-600 inline ml-2'>{budgetContracts}</h1>
                    <h1 className='inline ml-2'>contracts. </h1>
                    <h1 className='inline'>It will cost</h1>
                    <h1 className='text-green-600 inline ml-2'>${(brokerageFee + (contractFee * budgetContracts)).toFixed(2)}</h1>
                    <h1 className='inline ml-2'>in fees, and</h1>
                    <h1 className='text-green-600 inline ml-2'>${(budgetPremium * 100 * budgetContracts).toFixed(2)}</h1>
                    <h1 className='inline ml-2'>in premiums to open this trade. Giving</h1>
                    <h1 className='text-green-600 inline ml-2'>${(brokerageFee + (contractFee * budgetContracts) + (budgetPremium * 100 * budgetContracts)).toFixed(2)}</h1>
                    <h1 className='inline ml-2'>in initial costs.</h1>
                </div>
                <button
                    className='rounded-lg px-5 py-1 border border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                    onClick={calculateBudgetContracts}
                >
                    Calculate
                </button>
            </section>

            <section className='border-t-2 border-zinc-500 mt-5 pt-2 flex flex-col gap-5 text-lg'>
                <h1 className='text-2xl'>Spread Calculator</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5 sm:text-end'>
                    <h1>Flat Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                    <h1>Per Contract Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                </div>
                <div className='grid grid-cols-2'>
                    <div className='flex flex-col gap-3'>
                        <h1>Calls</h1>
                        <div className='flex justify-center gap-5'>
                            <h2>Number of contracts</h2>
                            <input
                                type="number"
                                min={0}
                                value={numCalls}
                                className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                                onChange={(e) => setNumCalls(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className='flex justify-center gap-5'>
                            <h2>Contract Premium</h2>
                            <input
                                type="number"
                                min={0}
                                value={callPremium}
                                className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                                onChange={(e) => setCallPremium(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                            <h1>Cost of Calls</h1>
                            <h1 className='text-red-600 font-bold'>${costOfCalls.toFixed(2)}</h1>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                            <h1>Call Fees</h1>
                            <h1 className='text-red-600 font-bold'>${callFees.toFixed(2)}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1>Puts</h1>
                        <div className='flex justify-center gap-5'>
                            <h2>Number of contracts</h2>
                            <input
                                type="number"
                                min={0}
                                value={numPuts}
                                className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                                onChange={(e) => setNumPuts(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className='flex justify-center gap-5'>
                            <h2>Contract Premium</h2>
                            <input
                                type="number"
                                min={0}
                                value={putPremium}
                                className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                                onChange={(e) => setPutPremium(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                            <h1>Cost of Puts</h1>
                            <h1 className='text-red-600 font-bold'>${costOfPuts.toFixed(2)}</h1>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                            <h1>Put Fees</h1>
                            <h1 className='text-red-600 font-bold'>${putFees.toFixed(2)}</h1>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                        <h1>Total Cost</h1>
                        <h1 className='text-red-600 font-bold'>${(costOfCalls + costOfPuts).toFixed(2)}</h1>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                        <h1>Total Fees</h1>
                        <h1 className='text-red-600 font-bold'>${(callFees + putFees).toFixed(2)}</h1>
                    </div>
                    <div className='flex justify-center gap-3'>
                        <h1>Winner</h1>
                        <select
                            name="spreadWinner"
                            id="spreadWinner"
                            value={spreadWinner}
                            onChange={(e) => setSpreadWinner(e.target.value)}
                            className='px-1 rounded bg-fuchsia-900'
                        >
                            <option value="calls" >calls</option>
                            <option value="puts" >puts</option>
                        </select>
                    </div>
                    <div className='flex justify-center gap-3'>
                        <h1>Sale Premium</h1>
                            <input
                                type="number"
                                min={0}
                                value={spreadSalePremium}
                                className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none m-auto sm:m-0"
                                onChange={(e) => setSpreadSalePremium(parseFloat(e.target.value))}
                            />
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>Total Sale After Closing Fees</h1>
                    <h1 className={`${spreadSaleTotal >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>${spreadSaleTotal.toFixed(2)}</h1>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>P/L Dollar Amount</h1>
                    <h1 className={`${spreadReturnDollar >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>${spreadReturnDollar.toFixed(2)}</h1>
                </div>
                <div className='flex flex-col sm:flex-row sm:gap-3 justify-center'>
                    <h1>P/L Percentage</h1>
                    <h1 className={`${spreadReturnDollar >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>{spreadReturnPercent.toFixed(2)}%</h1>
                </div>
                <button
                    className='rounded-lg px-5 py-1 border border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                    onClick={calculateSpread}
                >
                    Calculate
                </button>
            </section>
        </div>
    </div>
}

export default OptionModule;