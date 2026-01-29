import { useState } from "react";
import { primaryButton } from "../../styles/buttons";

/* типы */

export type PriorRef = {
    treeId: string;
    paramId: string;
};

type Props = {
    title: string;
    icon?: string;

    items: PriorRef[];

    availableTrees: string[];
    availableParams: string[];

    onChange: (v: PriorRef[]) => void;
};

/* основной компонент */

export default function PriorsReferenceSection({
    title,
    icon,
    items,
    availableTrees,
    availableParams,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    const [treeInput, setTreeInput] = useState("");
    const [paramInput, setParamInput] = useState("");

    const [error, setError] = useState<string | null>(null);

    /* валидация */

    function validate(tree: string, param: string): string | null {
        if (!tree.trim() || !param.trim()) {
            return "Поля не должны быть пустыми";
        }

        if (!availableTrees.includes(tree)) {
            return "Такого дерева не существует";
        }

        if (!availableParams.includes(param)) {
            return "Такого параметра не существует";
        }

        if (items.some((x) => x.treeId === tree && x.paramId === param)) {
            return "Такая связка уже существует";
        }

        return null;
    }

    /* действия */

    function handleAdd() {
        const tree = treeInput.trim();
        const param = paramInput.trim();

        const err = validate(tree, param);

        if (err) {
            setError(err);
            return;
        }

        onChange([
            ...items,
            {
                treeId: tree,
                paramId: param,
            },
        ]);

        setTreeInput("");
        setParamInput("");
        setError(null);
    }

    function handleDelete(i: number) {
        const copy = [...items];

        copy.splice(i, 1);

        onChange(copy);
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
                        {/* заголовок */}

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
                            <div className="flex-1 pr-3">tree id</div>

                            <div className="flex-1 px-3 border-l text-center">
                                param id
                            </div>

                            <div className="w-7 border-l" />
                        </div>

                        {/* тело */}

                        <div
                            className="
                                max-h-[220px]
                                overflow-y-auto
                                scrollbar-thin
                                scrollbar-thumb-slate-300
                            "
                        >
                            {items.map((x, i) => (
                                <div
                                    key={i}
                                    className={`
                                        flex items-center px-4 py-2
                                        ${i !== 0 ? "border-t" : ""}
                                        hover:bg-slate-100
                                    `}
                                >
                                    <div className="flex-1 pr-3">
                                        {x.treeId}
                                    </div>

                                    <div className="flex-1 px-3 border-l text-center font-mono text-sm">
                                        {x.paramId}
                                    </div>

                                    <button
                                        onClick={() => handleDelete(i)}
                                        className="ml-2 pl-2 border-l text-red-500 hover:text-red-700"
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
                            value={treeInput}
                            onChange={(e) => {
                                setTreeInput(e.target.value);
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
                            value={paramInput}
                            onChange={(e) => {
                                setParamInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="param_id"
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

                    {/* ошибка */}

                    {error && (
                        <div className="text-sm text-red-600">⚠ {error}</div>
                    )}
                </div>
            )}
        </div>
    );
}
