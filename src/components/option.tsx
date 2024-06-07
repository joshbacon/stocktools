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

    // Find the breackeven increase and total breakeven premium
    function calculateBreakeven() {
        let openFees:number = brokerageFee + (contractFee * numberOfContracts);
        let increase:number = openFees*2 / (numberOfContracts * 100);
        setBreakevenIncrease(increase);
        setBreakevenPremium(contractPremium + increase);
        setSaleBreakevenPremium(contractPremium + increase);
    }

    // Calculate the sale P/L
    function calculateProfit() {
        let initialCost:number = brokerageFee + (contractFee * numberOfContracts) + (contractPremium * numberOfContracts * 100);
        let difference:number = (salePremium - saleBreakevenPremium) * numberOfContracts * 100;
        setProfitLoss(difference);
        setPrecentProfit((((difference + initialCost) / initialCost) -1) * 100);
    }

    // Calucalte how many shares can be bought at a certain premium with a given amount of money
    function calculateBudgetContracts() {
        let workingBudget:number = budgetAmount - brokerageFee;
        let numContracts:number = Math.floor(workingBudget / (budgetPremium * 100 + contractFee));
        setBudgetContracts(numContracts);
    }

    return <div className="flex justify-center mt-5 bg-gradient-to-br from-purple-800 to-fuchsia-700 rounded-md font-semibold drop-shadow-card">
        <div className="bg-neutral-800 w-full m-1 p-3">
            <section className='flex flex-col gap-5 text-lg'>
                <h1 className='text-2xl'>Breakeven Calculator</h1>
                <div className='grid grid-cols-2 gap-5 text-end'>
                    <h1>Flat Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                    <h1>Per Contract Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                    <h1>Number of Contracts Bought</h1>
                    <input
                        type="number"
                        min={0}
                        value={numberOfContracts}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setNumberOfContracts(parseInt(e.target.value))}
                    />
                    <h1>Contract Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setContractPremium(parseFloat(e.target.value))}
                    />
                </div>
                <div className='flex gap-3 justify-center'>
                    <h1>Breakeven Premium Increase</h1>
                    <h1 className='text-green-600 font-bold'>${breakevenIncrease.toFixed(4)}</h1>
                </div>
                <div className='flex gap-3 justify-center'>
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
                <div className='grid grid-cols-2 gap-5 text-end'>
                    <h1>Breakeven Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={saleBreakevenPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setSaleBreakevenPremium(parseFloat(e.target.value))}
                    />
                    <h1>Desired Sale Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={salePremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setSalePremium(parseFloat(e.target.value))}
                    />
                </div>
                <div className='flex gap-3 justify-center'>
                    <h1>P/L Dollar Amount</h1>
                    <h1 className={`${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}>${profitLoss.toFixed(2)}</h1>
                </div>
                <div className='flex gap-3 justify-center'>
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
                <div className='flex gap-2 justify-center'>
                    <h1>How many contracts can I buy with</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetAmount}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setBudgetAmount(parseFloat(e.target.value))}
                    />
                    <h1>at a premium of</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetPremium}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setBudgetPremium(parseFloat(e.target.value))}
                    />
                    <h1>?</h1>
                </div>
                <div className='grid grid-cols-2 gap-5 text-end'>
                    <h1>Flat Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                    <h1>Per Contract Brokerage Fees</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-32 bg-fuchsia-700 bg-opacity-50 rounded outline-none"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                </div>
                <div className='flex gap-2 justify-center'>
                    <div className='flex gap-2'>
                        <h1>${budgetAmount} can buy</h1>
                        <h1 className='text-green-600'>{budgetContracts}</h1>
                        <h1>contracts.</h1>
                    </div>
                    <div className='flex gap-2'>
                        <h1>It will cost</h1>
                        <h1 className='text-green-600'>${(brokerageFee + (contractFee * budgetContracts)).toFixed(2)}</h1>
                        <h1>in fees, and</h1>
                        <h1 className='text-green-600'>${(budgetPremium * 100 * budgetContracts).toFixed(2)}</h1>
                        <h1>in premiums to open this trade. Giving</h1>
                        <h1 className='text-green-600'>${(brokerageFee + (contractFee * budgetContracts) + (budgetPremium * 100 * budgetContracts)).toFixed(2)}</h1>
                        <h1>in initial costs.</h1>
                    </div>
                </div>
                <button
                    className='rounded-lg px-5 py-1 border border-fuchsia-700 hover:bg-fuchsia-700 hover:bg-opacity-20 hover:drop-shadow-button'
                    onClick={calculateBudgetContracts}
                >
                    Calculate
                </button>
            </section>
        </div>
    </div>
}

export default OptionModule;