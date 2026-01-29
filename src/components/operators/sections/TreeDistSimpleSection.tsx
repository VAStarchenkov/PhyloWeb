import { useState } from "react";
import { primaryButton } from "../../../styles/buttons";

type Item = {
    id: string;

    type: string;
    params: Record<string, number>;

    weight: number;
};

type Props = {
    title: string;
    icon?: string;

    items: Item[];

    availableTrees: string[];

    activeId: string | null;
    onSelect: (id: string | null) => void;

    onAdd: (v: Item) => void;
    onDelete: (id: string) => void;
};

function formatDistribution(x: Item): string {
    if (!x.type) return "distribution()";

    const keys = Object.keys(x.params ?? {});

    if (!keys.length) return `${x.type}()`;

    keys.sort();

    const args = keys.map((k) => x.params[k]);

    return `${x.type}(${args.join(", ")})`;
}

export default function TreeDistSimpleSection({
    title,
    icon,

    items,
    availableTrees,

    activeId,
    onSelect,

    onAdd,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");
    const [weightInput, setWeightInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* действие */

    function handleAdd() {
        const id = idInput.trim();

        if (!availableTrees.includes(id)) {
            setError("Такого дерева не существует");
            return;
        }

        if (items.some((x) => x.id === id)) {
            setError("Для этого дерева оператор уже добавлен");
            return;
        }

        const weight = Number(weightInput);

        if (Number.isNaN(weight)) {
            setError("Введите число");
            return;
        }

        onAdd({
            id,
            type: "",
            params: {},
            weight,
        });

        setIdInput("");
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
                <span>
                    {icon} {title}
                </span>

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
                                grid-cols-[1fr_2fr_96px_40px]
                                items-center
                                px-4 py-2
                                bg-slate-300
                                text-sm
                                font-semibold
                                text-slate-600
                            "
                        >
                            <div>tree id</div>

                            <div className="border-l text-center">
                                distribution
                            </div>

                            <div className="border-l text-center">weight</div>

                            <div />
                        </div>

                        {/* тело таблицы */}

                        <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            {items.map((x, i) => {
                                const active = x.id === activeId;

                                return (
                                    <div
                                        key={x.id}
                                        onClick={() =>
                                            onSelect(active ? null : x.id)
                                        }
                                        className={`
                                        grid
                                        grid-cols-[1fr_2fr_96px_40px]
                                        items-center
                                        px-4 py-2
                                        cursor-pointer
                                        transition
                                        ${i !== 0 ? "border-t" : ""}

                                        ${active ? "bg-amber-100" : "hover:bg-slate-200"}
                                        `}
                                    >
                                        <div>{x.id}</div>

                                        <div className="border-l text-center font-mono text-sm">
                                            {formatDistribution(x)}
                                        </div>

                                        <div className="border-l text-center text-sm">
                                            {x.weight}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(x.id);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-sm"
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
                        <input
                            value={idInput}
                            onChange={(e) => {
                                setIdInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="tree_id"
                            className="
                                flex-1 rounded-xl border px-3 py-2
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
                                flex-1 rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        <button onClick={handleAdd} className={primaryButton}>
                            + Add
                        </button>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">⚠ {error}</div>
                    )}
                </div>
            )}
        </div>
    );
}
