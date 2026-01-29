type Tab = "States" | "Priors" | "Operators" | "Likelihood" | "MCMC";

const TABS: Tab[] = ["States", "Priors", "Operators", "Likelihood", "MCMC"];

type Props = {
    active: Tab;
    onChange: (t: Tab) => void;
};

export default function TopTabs({ active, onChange }: Props) {
    return (
        <div className="flex flex-wrap gap-4 border-b border-slate-200 bg-white/90 px-6 py-5">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`rounded-2xl px-6 py-3 text-lg transition ${
                        active === tab
                            ? "bg-amber-300 font-bold text-amber-900 shadow"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
