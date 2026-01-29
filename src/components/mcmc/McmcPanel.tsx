import { useState } from "react";

import type { McmcConfig } from "../../types/config";

type Props = {
    mcmc: McmcConfig;

    onChange: (v: McmcConfig) => void;
};

export default function McmcPanel({ mcmc, onChange }: Props) {
    /* состояние */

    const [chainInput, setChainInput] = useState(String(mcmc.chainLength));

    const [burnInput, setBurnInput] = useState(String(mcmc.burnIn));

    const [seedInput, setSeedInput] = useState(String(mcmc.seed));

    const [error, setError] = useState<string | null>(null);

    /* доп действия */

    function parseIntField(value: string, name: string): number | null {
        const n = Number(value);

        if (!Number.isInteger(n) || n < 0) {
            setError(`${name} должно быть целым ≥ 0`);
            return null;
        }

        return n;
    }

    /* действия */

    function apply() {
        const chain = parseIntField(chainInput, "Length of chain");

        const burn = parseIntField(burnInput, "Burn-in");

        const seed = parseIntField(seedInput, "Seed");

        if (chain === null || burn === null || seed === null) {
            return;
        }

        onChange({
            chainLength: chain,
            burnIn: burn,
            seed,
        });

        setError(null);
    }

    /* загрузка json */

    function downloadJson() {
        const data = JSON.stringify(window.__APP_JSON__, null, 2);

        const blob = new Blob([data], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "config.json";

        a.click();

        URL.revokeObjectURL(url);
    }

    /* ui */

    return (
        <div className="flex h-full min-h-0 flex-col p-8 gap-6 overflow-hidden">
            {/* заголовок */}

            <div className="shrink-0">
                <h2 className="text-5xl font-bold text-slate-800">MCMC</h2>

                <p className="mt-2 text-2xl text-slate-600">
                    настройка параметров Марковской цепи
                </p>
            </div>

            {/* содержимое */}

            <div className="space-y-6 max-w-xl">
                {/* ввод */}

                <div className="space-y-4">
                    <InputRow
                        label="Length of chain"
                        value={chainInput}
                        onChange={setChainInput}
                    />

                    <InputRow
                        label="Burn-in"
                        value={burnInput}
                        onChange={setBurnInput}
                    />

                    <InputRow
                        label="Seed"
                        value={seedInput}
                        onChange={setSeedInput}
                    />
                </div>

                {/* кнопки */}

                <div className="flex gap-6 flex-wrap">
                    <button
                        onClick={apply}
                        className="
                            px-6 py-3
                            rounded-xl
                            bg-amber-300
                            text-amber-900
                            font-semibold
                            hover:bg-amber-400
                            transition
                        "
                    >
                        Apply
                    </button>

                    <button
                        onClick={downloadJson}
                        className="
                            px-6 py-3
                            rounded-xl
                            bg-emerald-200
                            text-emerald-900
                            font-semibold
                            hover:bg-emerald-300
                            transition
                        "
                    >
                        ⬇ Download JSON file
                    </button>
                </div>

                {/* ошибка */}

                {error && <div className="text-sm text-red-600">⚠ {error}</div>}
            </div>
        </div>
    );
}

/* поле ввода */

type InputProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
};

function InputRow({ label, value, onChange }: InputProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-40 text-slate-700 font-medium">{label}</div>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    flex-1
                    rounded-xl
                    border
                    px-3
                    py-2
                    border-slate-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-amber-200
                "
            />
        </div>
    );
}
