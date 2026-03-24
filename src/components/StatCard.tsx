import { useState, useEffect } from "react";

interface StatCardProps {
  title: string;
  amount: number;
  icon: string;
  format?: string;
}

const StatCard = ({title, amount, icon, format} : StatCardProps) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = amount / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= amount) {
        setDisplayed(amount);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, step);
    return () => clearInterval(timer);
  }, [amount]);

  let formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(displayed);

  if (format == "percent") {
    formatted = new Intl.NumberFormat("en-US", {
      style: "percent",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(displayed/100);
  } else if (format == "int") {
    formatted = amount.toString();
  }

  return (
    <>
      {/* Card */}
      <div className="relative w-80 rounded-2xl border border-[#2a2a30] bg-[#17171a] px-7 pb-6 pt-7 overflow-hidden shadow-[0_0_0_1px_#ffffff06,0_24px_64px_#00000060] animate-fade-up font-dm-sans">

        {/* Glow blob */}
        <div
          className="absolute -top-15 -right-15 w-50 h-50 pointer-events-none"
          style={{ background: "radial-gradient(circle, #c9f53344 0%, transparent 70%)" }}
        />

        {/* Header: icon + title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-[10px] text-lg shrink-0 border"
            style={{ background: "#c9f53318", borderColor: "#c9f53328" }}
          >
            {icon}
          </div>
          <span className="text-[13.5px] font-normal uppercase tracking-[0.04em] text-[#9696a0]">
            {title}
          </span>
        </div>

        {/* Amount */}
        <div className="font-dm-mono text-[38px] font-medium text-[#f0f0f5] tracking-tight leading-none mb-4">
          {formatted}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#66bb6a] to-[#26c6da]" />
      </div>
    </>
  );
};

export default StatCard;