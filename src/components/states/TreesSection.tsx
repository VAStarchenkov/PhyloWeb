import { useState } from "react";
import { primaryButton } from "../../styles/buttons";

/* ключевые слова Python */

const PYTHON_KEYWORDS = new Set([
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
]);

/* типы */

type Props = {
    values: string[];
    onChange: (v: string[]) => void;
    validateId?: (id: string) => string | null;
};

/* основной компонент */

export default function TreesSection({ values, onChange, validateId }: Props) {
    const [open, setOpen] = useState(false);

    const [draft, setDraft] = useState("");
    const [error, setError] = useState<string | null>(null);

    /* валидация */

    function validate(id: string): string | null {
        if (!id.trim()) return "Пустой идентификатор";

        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(id)) {
            return "Недопустимый формат";
        }

        if (PYTHON_KEYWORDS.has(id)) {
            return "Ключевое слово Python";
        }

        if (values.includes(id)) {
            return "Уже существует";
        }

        if (validateId) {
            return validateId(id);
        }

        return null;
    }

    /* действия */

    function addRow() {
        const v = draft.trim();

        const err = validate(v);

        if (err) {
            setError(err);
            return;
        }

        onChange([...values, v]);

        setDraft("");
        setError(null);
    }

    function removeRow(i: number) {
        const copy = [...values];
        copy.splice(i, 1);

        onChange(copy);
    }

    /* ui */

    return (
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            {/* заголовок */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full justify-between text-2xl font-semibold"
            >
                <span>1. Trees</span>
                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="mt-4 space-y-4">
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

                            <div className="w-18 border-l" />
                        </div>

                        {/* тело таблицы */}

                        <div className="max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            {values.map((v, i) => (
                                <div
                                    key={i}
                                    className={`
                                        flex items-center px-4 py-2
                                        hover:bg-slate-200 transition
                                        ${i !== 0 ? "border-t" : ""}
                                    `}
                                >
                                    <div className="flex-1 pr-3">{v}</div>

                                    <button
                                        onClick={() => removeRow(i)}
                                        className="ml-3 pl-3 border-l text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {values.length === 0 && (
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
                            placeholder="new_tree_id"
                            className={`
                                flex-1 rounded-xl border px-4 py-2
                                focus:outline-none focus:ring-2 focus:ring-amber-200
                                ${error ? "border-red-400 ring-red-200" : "border-slate-300"}
                            `}
                        />

                        <button onClick={addRow} className={primaryButton}>
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
