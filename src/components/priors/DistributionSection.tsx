import { useState } from "react";
import { primaryButton } from "../../styles/buttons";

type DistributionParam = {
    id: string;
    type: string;
    params: Record<string, number>;
};

type Props = {
    items: DistributionParam[];

    activeId: string | null;

    onSelect: (id: string | null) => void;

    onAdd: (id: string) => void;
    onDelete: (id: string) => void;

    validateId?: (id: string) => string | null;
};

function formatDistribution(x: DistributionParam): string {
    const type = x.type?.trim();

    if (!type) return "distribution()";

    const keys = Object.keys(x.params ?? {});

    if (keys.length === 0) return `${type}()`;

    keys.sort((a, b) => a.localeCompare(b));

    const args = keys.map((k) => x.params[k]);

    return `${type}(${args.join(", ")})`;
}

export default function DistributionSection({
    items,
    activeId,
    onSelect,
    onAdd,
    onDelete,
    validateId,
}: Props) {
    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");
    const [error, setError] = useState<string | null>(null);

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
            setError("Для этого параметра распределение уже добавлено");
            return;
        }

        onAdd(id);

        setIdInput("");
        setError(null);
    }

    return (
        <div className="rounded-3xl bg-white shadow ring-1 ring-slate-200">
            {/* заголовок */}

            <button
                onClick={() => setOpen(!open)}
                className="flex w-full justify-between px-6 py-4 text-2xl font-bold"
            >
                <span>2. Distribution</span>
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
                            <div className="flex-1 pr-3">parameter id</div>

                            <div className="flex-1 px-3 border-l text-center">
                                distribution
                            </div>

                            <div className="w-18 border-l" />
                        </div>

                        {/* тело */}

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
                                        flex items-center px-4 py-2 cursor-pointer
                                        transition
                                        ${i !== 0 ? "border-t" : ""}

                                        ${active ? "bg-amber-100" : "hover:bg-slate-200"}
                                        `}
                                    >
                                        <div className="flex-1 pr-3">
                                            {x.id}
                                        </div>

                                        <div className="flex-1 px-3 border-l text-center font-mono text-sm text-slate-700">
                                            {formatDistribution(x)}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(x.id);
                                            }}
                                            className="
                                                ml-3 pl-3 border-l
                                                text-red-500
                                                hover:text-red-700
                                            "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}

                            {items.length === 0 && (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Нет добавленных параметров. Добавьте id
                                    ниже.
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
