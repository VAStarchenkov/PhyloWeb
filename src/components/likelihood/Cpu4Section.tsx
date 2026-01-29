import { useState } from "react";

import { primaryButton } from "../../styles/buttons";

import type { Cpu4LikelihoodParam } from "../../types/config";

type Props = {
    items: Cpu4LikelihoodParam[];

    availableTrees: string[];

    usedOtherIds: string[];

    onAdd: (v: Cpu4LikelihoodParam) => void;
    onDelete: (id: string) => void;
};

export default function Cpu4Section({
    items,
    availableTrees,
    usedOtherIds,

    onAdd,
    onDelete,
}: Props) {
    /* состояние */

    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");
    const [subInput, setSubInput] = useState("");
    const [clockInput, setClockInput] = useState("");
    const [treeInput, setTreeInput] = useState("");
    const [freqInput, setFreqInput] = useState("");
    const [kappaInput, setKappaInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* доп действия */

    function parseFreq(text: string): number[] | null {
        const parts = text
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);

        if (parts.length === 0) return null;

        const res: number[] = [];

        for (const p of parts) {
            const n = Number(p);

            if (Number.isNaN(n)) return null;

            res.push(n);
        }

        return res;
    }

    /* действия */

    function handleAdd() {
        const id = idInput.trim();
        const sub = subInput.trim();
        const tree = treeInput.trim();

        /* id */

        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(id)) {
            setError("Недопустимый id");
            return;
        }

        if (items.some((x) => x.id === id)) {
            setError("Такой likelihood уже существует");
            return;
        }

        if (usedOtherIds.includes(id)) {
            setError("Такой id уже используется в другой likelihood-секции");
            return;
        }

        /* substitution */

        if (!sub) {
            setError("Substitution не может быть пустым");
            return;
        }

        /* tree */

        if (!availableTrees.includes(tree)) {
            setError("Такого дерева не существует");
            return;
        }

        /* numbers */

        const clock = Number(clockInput);
        const kappa = Number(kappaInput);

        if (Number.isNaN(clock) || Number.isNaN(kappa)) {
            setError("StrictClock и kappa должны быть числами");
            return;
        }

        /* frequencies */

        const freqs = parseFreq(freqInput);

        if (!freqs) {
            setError("Некорректные frequencies");
            return;
        }

        /* добавление */

        onAdd({
            id,

            substitution: sub,

            strictClock: clock,

            treeId: tree,

            frequencies: freqs,

            kappa,
        });

        setIdInput("");
        setSubInput("");
        setClockInput("");
        setTreeInput("");
        setFreqInput("");
        setKappaInput("");

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
                <span>1. CPU4Likelihood</span>

                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="px-6 py-2 space-y-4">
                    {/* таблица */}

                    <div className="rounded-xl border overflow-hidden">
                        {/* заголовок */}

                        <div
                            className="
                                grid
                                grid-cols-[1fr_1fr_96px_1fr_2fr_96px_40px]
                                items-center
                                px-4 py-2
                                bg-slate-300
                                text-sm
                                font-semibold
                                text-slate-600
                            "
                        >
                            <div>id</div>
                            <div className="border-l text-center">
                                substitution
                            </div>
                            <div className="border-l text-center">clock</div>
                            <div className="border-l text-center">tree</div>
                            <div className="border-l text-center">
                                frequencies
                            </div>
                            <div className="border-l text-center">kappa</div>
                            <div />
                        </div>

                        {/* тело */}

                        <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            {items.map((x, i) => (
                                <div
                                    key={x.id}
                                    className={`
                                        grid
                                        grid-cols-[1fr_1fr_96px_1fr_2fr_96px_40px]
                                        items-center
                                        px-4 py-2
                                        transition
                                        ${i !== 0 ? "border-t" : ""}

                                        hover:bg-slate-200
                                    `}
                                >
                                    <div>{x.id}</div>

                                    <div className="border-l text-center text-sm">
                                        {x.substitution}
                                    </div>

                                    <div className="border-l text-center text-sm">
                                        {x.strictClock}
                                    </div>

                                    <div className="border-l text-center text-sm">
                                        {x.treeId}
                                    </div>

                                    <div className="border-l text-center font-mono text-xs">
                                        [{x.frequencies.join(", ")}]
                                    </div>

                                    <div className="border-l text-center text-sm">
                                        {x.kappa}
                                    </div>

                                    <button
                                        onClick={() => onDelete(x.id)}
                                        className="
                                            ml-1 pl-1
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
                                    Нет добавленных likelihood
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
                            placeholder="id"
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

                        <input
                            value={subInput}
                            onChange={(e) => {
                                setSubInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="substitution"
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

                        <input
                            value={clockInput}
                            onChange={(e) => {
                                setClockInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="strictClock"
                            className="
                                w-28
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

                        <input
                            value={treeInput}
                            onChange={(e) => {
                                setTreeInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="tree_id"
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

                        <input
                            value={freqInput}
                            onChange={(e) => {
                                setFreqInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="0.1, 0.2, 0.7"
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

                        <input
                            value={kappaInput}
                            onChange={(e) => {
                                setKappaInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="kappa"
                            className="
                                w-24
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
