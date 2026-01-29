import { useState } from "react";
import { primaryButton } from "../../styles/buttons";

type Props = {
    title: string;
    icon?: string;

    items: string[];
    allowed: string[];

    onChange: (v: string[]) => void;
};

export default function TreeReferenceSection({
    title,
    icon,
    items,
    allowed,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    const [draft, setDraft] = useState("");
    const [error, setError] = useState<string | null>(null);

    function validate(id: string): string | null {
        if (!id.trim()) {
            return "Пустой идентификатор";
        }

        if (!allowed.includes(id)) {
            return "Такого дерева не существует";
        }

        if (items.includes(id)) {
            return "Это дерево уже используется";
        }

        return null;
    }

    function addRow() {
        const v = draft.trim();

        const err = validate(v);

        if (err) {
            setError(err);
            return;
        }

        onChange([...items, v]);

        setDraft("");
        setError(null);
    }

    function removeRow(i: number) {
        const copy = [...items];
        copy.splice(i, 1);

        onChange(copy);
    }

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
                                flex items-center px-4 py-2
                                bg-slate-300 text-sm font-semibold text-slate-600
                            "
                        >
                            <div className="flex-1 pr-3">tree id</div>

                            <div className="w-18 border-l" />
                        </div>

                        {/* тело таблицы */}

                        <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                            {items.map((x, i) => (
                                <div
                                    key={i}
                                    className={`
                                        flex items-center px-4 py-2
                                        hover:bg-slate-200 transition
                                        ${i !== 0 ? "border-t" : ""}
                                    `}
                                >
                                    <div className="flex-1 pr-3">{x}</div>

                                    <button
                                        onClick={() => removeRow(i)}
                                        className="ml-3 pl-3 border-l text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

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
                            value={draft}
                            onChange={(e) => {
                                setDraft(e.target.value);
                                setError(null);
                            }}
                            placeholder="tree_id"
                            className={`
                                flex-1 rounded-xl border px-3 py-2
                                ${error ? "border-red-400" : "border-slate-300"}
                            `}
                        />

                        <button onClick={addRow} className={primaryButton}>
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
