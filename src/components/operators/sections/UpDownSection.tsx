import { useState } from "react";
import { primaryButton } from "../../../styles/buttons";

import type { UpDownParam } from "../../../types/config";

type Props = {
    items: UpDownParam[];

    availableParams: string[];

    activeIndex: number | null;
    onSelect: (i: number | null) => void;

    onAdd: (v: UpDownParam) => void;
    onDelete: (i: number) => void;
};

function formatDistribution(x: UpDownParam): string {
    if (!x.type) return "distribution()";

    const keys = Object.keys(x.params ?? {});

    if (!keys.length) return `${x.type}()`;

    keys.sort();

    const args = keys.map((k) => x.params[k]);

    return `${x.type}(${args.join(", ")})`;
}

export default function UpDownSection({
    items,
    availableParams,

    activeIndex,
    onSelect,

    onAdd,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);

    const [upInput, setUpInput] = useState("");
    const [downInput, setDownInput] = useState("");
    const [factorInput, setFactorInput] = useState("");
    const [weightInput, setWeightInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* действие */

    function handleAdd() {
        const up = upInput.trim();
        const down = downInput.trim();

        if (!availableParams.includes(up)) {
            setError("up параметр не существует");
            return;
        }

        if (!availableParams.includes(down)) {
            setError("down параметр не существует");
            return;
        }

        if (up === down) {
            setError("up и down должны отличаться");
            return;
        }

        if (items.some((x) => x.up === up && x.down === down)) {
            setError("Для этой пары параметров оператор уже существует");
            return;
        }
        const factor = Number(factorInput);
        const weight = Number(weightInput);

        if (Number.isNaN(factor) || Number.isNaN(weight)) {
            setError("Введите числа");
            return;
        }

        onAdd({
            up,
            down,

            factor,

            type: "",
            params: {},

            weight,
        });

        setUpInput("");
        setDownInput("");
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
                <span>9. UpDown</span>
                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="px-6 py-2 space-y-4">
                    {/* таблица */}

                    <div className="rounded-xl border overflow-hidden">
                        {/* заголовок таблицы */}

                        <div
                            className="
                                grid
                                grid-cols-[1fr_1fr_96px_2fr_96px_40px]
                                items-center
                                px-4 py-2
                                bg-slate-300
                                text-sm
                                font-semibold
                                text-slate-600
                            "
                        >
                            <div>up</div>

                            <div className="border-l pl-3">down</div>

                            <div className="border-l text-center">factor</div>

                            <div className="border-l text-center">
                                distribution
                            </div>

                            <div className="border-l text-center">weight</div>

                            <div />
                        </div>

                        {/* тело таблицы */}

                        <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            {items.map((x, i) => {
                                const active = i === activeIndex;

                                return (
                                    <div
                                        key={`${x.up}-${x.down}-${i}`}
                                        onClick={() =>
                                            onSelect(active ? null : i)
                                        }
                                        className={`
                                        grid
                                        grid-cols-[1fr_1fr_96px_2fr_96px_40px]
                                        items-center
                                        px-4 py-2
                                        cursor-pointer
                                        transition
                                        ${i !== 0 ? "border-t" : ""}

                                        ${active ? "bg-amber-100" : "hover:bg-slate-200"}
                                        `}
                                    >
                                        <div>{x.up}</div>

                                        <div className="border-l pl-3">
                                            {x.down}
                                        </div>

                                        <div className="border-l text-center text-sm">
                                            {x.factor}
                                        </div>

                                        <div className="border-l text-center font-mono text-sm">
                                            {formatDistribution(x)}
                                        </div>

                                        <div className="border-l text-center text-sm">
                                            {x.weight}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(i);
                                            }}
                                            className="
                                                text-red-500
                                                hover:text-red-700
                                                text-sm
                                                pl-2 border-l
                                            "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}

                            {items.length === 0 && (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Нет добавленных операторов
                                </div>
                            )}
                        </div>
                    </div>

                    {/* добавление */}

                    <div className="flex gap-3 flex-wrap">
                        {/* up */}
                        <input
                            value={upInput}
                            onChange={(e) => {
                                setUpInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="up param"
                            className="
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        {/* down */}
                        <input
                            value={downInput}
                            onChange={(e) => {
                                setDownInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="down param"
                            className="
                                w-32
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        {/* factor */}
                        <input
                            value={factorInput}
                            onChange={(e) => {
                                setFactorInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="factor"
                            className="
                                w-24
                                flex-1
                                rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        {/* weight */}
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
