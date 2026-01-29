import { useState } from "react";
import { primaryButton } from "../../styles/buttons";

type RealParam = {
    id: string;
    value: number;
};

type Props = {
    items: RealParam[];
    onAdd: (item: RealParam) => void;
    onDelete: (id: string) => void;
    validateId?: (id: string) => string | null;
};

export default function RealSection({
    items,
    onAdd,
    onDelete,
    validateId,
}: Props) {
    const [open, setOpen] = useState(false);

    const [idInput, setIdInput] = useState("");
    const [valueInput, setValueInput] = useState("");

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
            setError("Такой параметр уже существует");
            return;
        }

        const value = Number(valueInput);

        if (Number.isNaN(value)) {
            setError("Введите число");
            return;
        }

        onAdd({ id, value });

        setIdInput("");
        setValueInput("");
        setError(null);
    }

    return (
        <div className="rounded-3xl bg-white shadow ring-1 ring-slate-200">
            {/* заголовок */}

            <button
                onClick={() => setOpen(!open)}
                className="flex w-full justify-between px-6 py-4 text-2xl font-bold"
            >
                <span>2. Real</span>
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
                            <div className="flex-1 pr-3">id</div>

                            <div className="w-28 px-3 border-l text-center">
                                value
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
                                        {x.value}
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
                            placeholder="id"
                            className="
                                flex-1 rounded-xl border px-3 py-2
                                border-slate-300
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                            "
                        />

                        <input
                            value={valueInput}
                            onChange={(e) => {
                                setValueInput(e.target.value);
                                setError(null);
                            }}
                            placeholder="value"
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

                    {error && (
                        <div className="text-sm text-red-600">⚠ {error}</div>
                    )}
                </div>
            )}
        </div>
    );
}
