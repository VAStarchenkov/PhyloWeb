import { useState } from "react";
import { primaryButton } from "../../../styles/buttons";

import type { RandomWalkParam } from "../../../types/config";

type Props = {
    items: RandomWalkParam[];

    availableParams: string[];

    onAdd: (v: RandomWalkParam) => void;
    onDelete: (id: string) => void;
};

export default function RandomWalkSection({
    items,
    availableParams,
    onAdd,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");

    const [windowInput, setWindowInput] = useState("");
    const [lowerInput, setLowerInput] = useState("");
    const [upperInput, setUpperInput] = useState("");
    const [boundaryInput, setBoundaryInput] = useState("");
    const [weightInput, setWeightInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* ================= ACTION ================= */

    function handleAdd() {
        const id = idInput.trim();

        if (!availableParams.includes(id)) {
            setError("Такого параметра не существует");
            return;
        }

        if (items.some((x) => x.id === id)) {
            setError("Для этого параметра оператор уже добавлен");
            return;
        }

        const window = Number(windowInput);
        const lower = Number(lowerInput);
        const upper = Number(upperInput);
        const boundary = Number(boundaryInput);
        const weight = Number(weightInput);

        if (
            [window, lower, upper, boundary, weight].some((x) =>
                Number.isNaN(x)
            )
        ) {
            setError("Введите числа");
            return;
        }

        onAdd({
            id,
            window,
            lower,
            upper,
            boundary,
            weight,
        });

        setIdInput("");
        setWindowInput("");
        setLowerInput("");
        setUpperInput("");
        setBoundaryInput("");
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
                <span>1. RandomWalk</span>
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
                            <div className="flex-1 pr-3">param</div>

                            <div className="w-24 px-3 border-l text-center">
                                window
                            </div>

                            <div className="w-24 px-3 border-l text-center">
                                lower
                            </div>

                            <div className="w-24 px-3 border-l text-center">
                                upper
                            </div>

                            <div className="w-28 px-3 border-l text-center">
                                boundary
                            </div>

                            <div className="w-24 px-3 border-l text-center">
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
                                        transition
                                        hover:bg-slate-200
                                        ${i !== 0 ? "border-t" : ""}
                                    `}
                                >
                                    <div className="flex-1 pr-12">{x.id}</div>

                                    <div className="w-24 px-3 border-l text-center text-sm">
                                        {x.window}
                                    </div>

                                    <div className="w-24 px-3 border-l text-center text-sm">
                                        {x.lower}
                                    </div>

                                    <div className="w-24 px-3 border-l text-center text-sm">
                                        {x.upper}
                                    </div>

                                    <div className="w-28 px-3 border-l text-center text-sm">
                                        {x.boundary}
                                    </div>

                                    <div className="w-24 px-3 border-l text-center text-sm">
                                        {x.weight}
                                    </div>

                                    <button
                                        onClick={() => onDelete(x.id)}
                                        className="
                                            ml-3 pl-3
                                            border-l
                                            text-red-500
                                            hover:text-red-700
                                            text-sm
                                        "
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Нет добавленных операторов
                                </div>
                            )}
                        </div>
                    </div>

                    {/* добавление */}

                    <div className="flex gap-3 flex-wrap">
                        <input
                            value={idInput}
                            onChange={(e) => {
                                setIdInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="param_id"
                            className="
                                w-96
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
                            "
                        />

                        <input
                            value={windowInput}
                            onChange={(e) => {
                                setWindowInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="window"
                            className="
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
                            "
                        />

                        <input
                            value={lowerInput}
                            onChange={(e) => {
                                setLowerInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="lower"
                            className="
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
                            "
                        />

                        <input
                            value={upperInput}
                            onChange={(e) => {
                                setUpperInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="upper"
                            className="
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
                            "
                        />

                        <input
                            value={boundaryInput}
                            onChange={(e) => {
                                setBoundaryInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="boundary"
                            className="
                                w-28
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
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
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-amber-200
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
