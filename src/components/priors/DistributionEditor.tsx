import { useEffect, useState } from "react";
import { primaryButton } from "../../styles/buttons";
import DistributionPlot from "./DistributionPlot";

/* типы */

export type DistributionParam = {
    id: string;
    type: string;
    params: Record<string, number>;
};

type Props = {
    item: DistributionParam | null;

    onChange: (v: DistributionParam) => void;
    onClear: (id: string) => void;

    onClose: () => void;
};

/* константы */

const DISTRIBUTIONS = {
    Beta: ["shape_a", "shape_b"],
    Exp: ["rate"],
    Gamma: ["rate", "shape"],
    InverseGamma: ["rate", "shape"],
    Laplace: ["location", "scale"],
    LogNormal: ["location", "scale"],
    Normal: [],
    Poisson: ["lambda"],
    Uniform: ["min", "max"],
} as const;

type DistType = keyof typeof DISTRIBUTIONS;

/* основной компонент */

export default function DistributionEditor({
    item,
    onChange,
    onClear,
    onClose,
}: Props) {
    const [type, setType] = useState<DistType | "">("");
    const [params, setParams] = useState<Record<string, number>>({});

    /* синхронизация */

    useEffect(() => {
        if (!item) {
            setType("");
            setParams({});
            return;
        }

        setType((item.type as DistType) || "");
        setParams(item.params || {});
    }, [item]);

    /* обработчики */

    function changeParam(key: string, value: string) {
        const n = Number(value);

        if (Number.isNaN(n)) return;

        setParams((prev) => ({
            ...prev,
            [key]: n,
        }));
    }

    function handleSave() {
        if (!item || !type) return;

        onChange({
            ...item,
            type,
            params,
        });
    }

    function handleDelete() {
        if (!item) return;

        onClear(item.id);
    }

    /* ui */

    if (!item) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-lg">
                Выберите параметр в таблице Distribution
            </div>
        );
    }

    const paramList = type ? DISTRIBUTIONS[type] : [];

    return (
        <div className="h-full min-h-0 flex flex-col gap-4 p-6 overflow-hidden">
            {/* заголовок */}

            <div className="shrink-0 flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-800">
                    Распределение параметра:{" "}
                    <span className="text-amber-600">{item.id}</span>
                </div>

                <button
                    onClick={onClose}
                    className="
                        text-slate-400
                        hover:text-slate-700
                        text-2xl
                        leading-none
                        px-2
                        transition
                    "
                    title="Закрыть"
                >
                    ✕
                </button>
            </div>

            {/* область прокрутки */}

            <div
                className="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    pr-2
                    space-y-6

                    scrollbar-thin
                    scrollbar-thumb-slate-300
                "
            >
                {/* график */}

                <div
                    className="
                        w-full
                        min-h-[260px]
                        max-h-[360px]
                        rounded-2xl
                        border
                        bg-slate-50
                        flex
                        items-center
                        justify-center
                    "
                >
                    <DistributionPlot type={type} params={params} />
                </div>

                {/* тип */}

                <div className="flex flex-wrap gap-2">
                    {Object.keys(DISTRIBUTIONS).map((k) => {
                        const active = k === type;

                        return (
                            <button
                                key={k}
                                onClick={() => setType(k as DistType)}
                                className={`
                                px-4 py-2 rounded-xl text-sm font-medium transition

                                ${
                                    active
                                        ? "bg-amber-300 text-amber-900 shadow"
                                        : "bg-slate-100 hover:bg-slate-200"
                                }
                                `}
                            >
                                {k}
                            </button>
                        );
                    })}
                </div>

                {/* параметры */}

                {paramList.length > 0 && (
                    <div className="space-y-3">
                        {paramList.map((p) => (
                            <div key={p} className="flex items-center gap-3">
                                <div className="w-32 text-slate-700">{p}</div>

                                <input
                                    value={params[p] ?? ""}
                                    onChange={(e) =>
                                        changeParam(p, e.target.value)
                                    }
                                    className="
                                        flex-1 rounded-xl border px-3 py-2
                                        border-slate-300
                                        focus:outline-none focus:ring-2 focus:ring-amber-200
                                    "
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* действия */}

            <div className="shrink-0 flex gap-3 pt-4 border-t">
                <button onClick={handleSave} className={primaryButton}>
                    Save
                </button>

                <button
                    onClick={handleDelete}
                    className="
                        rounded-xl px-5 py-3
                        font-semibold
                        text-red-600
                        bg-red-100
                        hover:bg-red-200
                        transition
                    "
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
