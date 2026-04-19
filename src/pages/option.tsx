import { useEffect, useState } from 'react';

function OptionModule () {

    // Breakeven Calculator Variables
    const [brokerageFee, setBrokerageFee] = useState<number>(5.95);
    const [contractFee, setContractFee] = useState<number>(1.25);
    const [numberOfContracts, setNumberOfContracts] = useState<number>(5);
    const [contractPremium, setContractPremium] = useState<number>(0.25);

    const [breakevenPremium, setBreakevenPremium] = useState<number>(0);
    const [breakevenIncrease, setBreakevenIncrease] = useState<number>(0);

    // Profit Calculator Variables
    const [saleBreakevenPremium, setSaleBreakevenPremium] = useState<number>(0.25);
    const [salePremium, setSalePremium] = useState<number>(0.35);

    const [profitLoss, setProfitLoss] = useState<number>(0);
    const [percentProfit, setPrecentProfit] = useState<number>(0);

    // Volume Calculator Variables
    const [budgetAmount, setBudgetAmount] = useState<number>(100);
    const [budgetPremium, setBudgetPremium] = useState<number>(0.30);

    const [budgetContracts, setBudgetContracts] = useState<number>(0);

    // Find the breakeven increase and total breakeven premium
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

    // Calculate how many shares can be bought at a certain premium with a given amount of money
    function calculateBudgetContracts() {
        const workingBudget:number = budgetAmount - brokerageFee;
        const numContracts:number = Math.floor(workingBudget / (budgetPremium * 100 + contractFee));
        setBudgetContracts(numContracts);
    }

    // Recalculates everything when fees are updated
    function updateNumbers() {
        calculateBreakeven();
        calculateProfit();
        calculateBudgetContracts();
    }

    useEffect(() => {
        updateNumbers();
    }, [brokerageFee, contractFee])

    useEffect(() => {
        calculateBreakeven();
    }, [numberOfContracts, contractPremium])

    useEffect(() => {
        calculateProfit();
    }, [breakevenPremium, breakevenIncrease])

    useEffect(() => {
        calculateBudgetContracts();
    }, [budgetAmount, budgetPremium])

    return <div className="columns-1 md:columns-2 lg:columns-3 gap-10">
        <div className="relative w-full h-min break-inside-avoid mb-10 rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 pb-6 pt-7 overflow-hidden shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
            <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
                    Brokerage Fees
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1>Flat Brokerage Fee</h1>
                    <input
                        type="number"
                        min={0}
                        value={brokerageFee}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-dm-mono"
                        onChange={(e) => setBrokerageFee(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex justify-between">
                    <h1>Per Contract Fee</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractFee}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-dm-mono"
                        onChange={(e) => setContractFee(parseFloat(e.target.value))}
                    />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
        </div>
        <div className="relative w-full h-min break-inside-avoid mb-10 rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 pb-6 pt-7 overflow-hidden shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
            <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
                    Return Calculator
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1>Number of Contracts</h1>
                    <input
                        type="number"
                        min={0}
                        value={numberOfContracts}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none font-dm-mono tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setNumberOfContracts(parseInt(e.target.value))}
                    />
                </div>
                <div className="flex justify-between">
                    <h1>Contract Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={contractPremium}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none font-dm-mono tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setContractPremium(parseFloat(e.target.value))}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2.5 my-5">
                <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
                    Breakeven
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1>Breakeven Premium</h1>
                    <h1 className="font-dm-mono">${breakevenPremium.toFixed(4)}</h1>
                </div>
                <div className="flex justify-between">
                    <h1>Required Increase</h1>
                    <h1 className="font-dm-mono">${breakevenIncrease.toFixed(4)}</h1>
                </div>
            </div>
            <div className="flex items-center gap-2.5 my-5">
                <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
                    Profit
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1>Sale Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={salePremium}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setSalePremium(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex justify-between">
                    <h1>P/L Dollar Amount</h1>
                    <h1 className={`text-[20px] font-dm-mono font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-[#be123c]'}`}>${profitLoss.toFixed(2)}</h1>
                </div>
                <div className="flex justify-between">
                    <h1>P/L Percentage</h1>
                    <h1 className={`text-[20px] font-dm-mono font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-[#be123c]'}`}>{percentProfit.toFixed(2)}%</h1>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
        </div>
        <div className="relative w-full h-min break-inside-avoid mb-10 rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 pb-6 pt-7 overflow-hidden shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">
            <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
                    Volume Calculator
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1>Capital</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetAmount}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none font-dm-mono tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setBudgetAmount(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex justify-between">
                    <h1>Contract Premium</h1>
                    <input
                        type="number"
                        min={0}
                        value={budgetPremium}
                        className="pl-1 w-24 bg-[#242424] text-center rounded outline-none font-dm-mono tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setBudgetPremium(parseFloat(e.target.value))}
                    />
                </div>
                <div>
                    <p className="inline font-dm-mono text-[#26c6da]">${budgetAmount}</p>
                    <p className="inline"> can buy </p>
                    <p className="inline font-dm-mono text-[#26c6da]">{budgetContracts}</p>
                    <p className="inline"> contracts at a premium of </p>
                    <p className="inline font-dm-mono text-[#26c6da]">${budgetPremium}</p>
                    <p className="inline">. It will cost </p>
                    <p className="inline font-dm-mono text-[#26c6da]">${(brokerageFee + (contractFee * budgetContracts)).toFixed(2)}</p>
                    <p className="inline"> in fees, and </p>
                    <p className="inline font-dm-mono text-[#26c6da]">${(budgetPremium * 100 * budgetContracts).toFixed(2)}</p>
                    <p className="inline"> in premiums. The total cost to open the position will be </p>
                    <p className="inline font-dm-mono text-[#26c6da]">${(brokerageFee + (contractFee * budgetContracts) + (budgetPremium * 100 * budgetContracts)).toFixed(2)}</p>
                    <p className="inline">.</p>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
        </div>
    </div>
}

export default OptionModule;