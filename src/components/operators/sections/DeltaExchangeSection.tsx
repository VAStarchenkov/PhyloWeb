import { useState } from "react";
import { primaryButton } from "../../../styles/buttons";

import type { DeltaExchangeParam } from "../../../types/config";

type Props = {
    items: DeltaExchangeParam[];

    onAdd: (v: DeltaExchangeParam) => void;
    onDelete: (id: string) => void;

    validateId?: (id: string) => string | null;
};

export default function DeltaExchangeSection({
    items,
    onAdd,
    onDelete,
    validateId,
}: Props) {
    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");
    const [factorInput, setFactorInput] = useState("");
    const [weightInput, setWeightInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* действия */

    function handleAdd() {
        const id = idInput.trim();

        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(id)) {
            setError("Недопустимый id");
            return;
        }

        if (validateId) {
            const err = validateId(id);
            if (err) {
                setError(err);
                return;
            }
        }

        if (items.some((x) => x.id === id)) {
            setError("Для этого параметра оператор уже добавлен");
            return;
        }

        const factor = Number(factorInput);
        const weight = Number(weightInput);

        if (Number.isNaN(factor) || Number.isNaN(weight)) {
            setError("Введите числа");
            return;
        }

        onAdd({
            id,
            factor,
            weight,
        });

        setIdInput("");
        setFactorInput("");
        setWeightInput("");
        setError(null);
    }

    /* ui */

    return (
        <div className="rounded-3xl bg-white shadow ring-1 ring-slate-200">
            {/* заголовок */}

            <button
                onClick={() => setOpen(!open)}
                className="flex w-full justify-between px-6 py-4 text-2xl font-bold"
            >
                <span>10. DeltaExchange</span>
                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="px-6 py-2 space-y-4">
                    {/* таблица */}

                    <div className="rounded-xl border overflow-hidden">
                        {/* заголовок таблицы */}

                        <div
                            className="
                                flex items-center
                                px-4 py-2
                                bg-slate-300
                                text-sm
                                font-semibold
                                text-slate-600
                            "
                        >
                            <div className="flex-1 pr-3">parameter id</div>

                            <div className="w-28 px-3 border-l text-center">
                                factor
                            </div>

                            <div className="w-28 px-3 border-l text-center">
                                weight
                            </div>

                            <div className="w-18 border-l" />
                        </div>

                        {/* тело таблицы */}

                        <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            {items.map((x, i) => (
                                <div
                                    key={x.id}
                                    className={`
                                        flex items-center px-4 py-2
                                        hover:bg-slate-200 transition
                                        ${i !== 0 ? "border-t" : ""}
                                    `}
                                >
                                    <div className="flex-1 pr-3">{x.id}</div>

                                    <div className="w-28 px-3 border-l text-center text-sm text-slate-700">
                                        {x.factor}
                                    </div>

                                    <div className="w-28 px-3 border-l text-center text-sm text-slate-700">
                                        {x.weight}
                                    </div>

                                    <button
                                        onClick={() => onDelete(x.id)}
                                        className="ml-3 pl-3 border-l text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Нет добавленных параметров
                                </div>
                            )}
                        </div>
                    </div>

                    {/* добавление */}

                    <div className="flex gap-3">
                        <input
                            value={idInput}
                            onChange={(e) => {
                                setIdInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="parameter_id"
                            className="
                                flex-1 rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        <input
                            value={factorInput}
                            onChange={(e) => {
                                setFactorInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="factor"
                            className="
                                w-28 rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        <input
                            value={weightInput}
                            onChange={(e) => {
                                setWeightInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="weight"
                            className="
                                w-28 rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        <button onClick={handleAdd} className={primaryButton}>
                            + Add
                        </button>
                    </div>

                    {/* ошибка */}

                    {error && (
                        <div className="text-sm text-red-600">⚠ {error}</div>
                    )}
                </div>
            )}
        </div>
    );
}
