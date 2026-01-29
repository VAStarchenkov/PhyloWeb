import { useState } from "react";

import TreesSection from "./TreesSection";
import RealSection from "./RealSection";
import WeightsSection from "./WeightsSection";
import TreeReferenceSection from "./TreeReferenceSection";

import type { WeightParam, RealParam } from "../../types/config";
import { primaryButton } from "../../styles/buttons";

/* типы */

type Props = {
    dataPath: string;

    trees: string[];
    internals: string[];
    root: string[];

    real: RealParam[];
    weights: WeightParam[];

    onChangeDataPath: (v: string) => void;

    onChangeTrees: (v: string[]) => void;
    onChangeInternals: (v: string[]) => void;
    onChangeRoot: (v: string[]) => void;

    onAddReal: (v: RealParam) => void;
    onDeleteReal: (id: string) => void;

    onAddWeight: (v: WeightParam) => void;
    onDeleteWeight: (id: string) => void;
};

/* основной компонент */

export default function StatesPanel({
    dataPath,

    trees,
    internals,
    root,

    real,
    weights,

    onChangeDataPath,

    onChangeTrees,
    onChangeInternals,
    onChangeRoot,

    onAddReal,
    onDeleteReal,

    onAddWeight,
    onDeleteWeight,
}: Props) {
    const [draftPath, setDraftPath] = useState(dataPath);
    const [pathError, setPathError] = useState<string | null>(null);

    /* валидация */

    function validatePath(path: string): string | null {
        if (!path.trim()) return "Путь не может быть пустым";

        if (/[<>:"|?*]/.test(path)) {
            return "Путь содержит недопустимые символы";
        }

        if (!/[\\/]/.test(path)) {
            return "Путь должен содержать / или \\";
        }

        return null;
    }

    function applyPath() {
        const err = validatePath(draftPath);

        if (err) {
            setPathError(err);
            return;
        }

        onChangeDataPath(draftPath);
        setPathError(null);
    }

    /* ui */

    return (
        <div className="flex h-full min-h-0 flex-col p-8 gap-6 overflow-hidden">
            {/* заголовок */}

            <div className="shrink-0">
                <h2 className="text-5xl font-bold text-slate-800">States</h2>

                <p className="mt-2 text-2xl text-slate-600">
                    настройка входных данных
                </p>
            </div>

            {/* область прокрутки */}

            <div
                className="
                    flex-1
                    min-h-0
                    overflow-y-auto
                    space-y-8
                    pr-2

                    scrollbar-thin
                    scrollbar-thumb-slate-300
                "
            >
                {/* путь к данным */}

                <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
                    <label className="block text-2xl font-semibold text-slate-700">
                        Data path
                    </label>

                    <div className="mt-3 flex gap-3">
                        <input
                            value={draftPath}
                            onChange={(e) => {
                                setDraftPath(e.target.value);
                                setPathError(null);
                            }}
                            placeholder="/data/alignment.fasta"
                            className={`
                                flex-1 rounded-xl border px-5 py-3 text-lg
                                focus:outline-none focus:ring-2

                                ${
                                    pathError
                                        ? "border-red-500 ring-red-200"
                                        : "border-slate-300 focus:ring-amber-200"
                                }
                            `}
                        />

                        <button onClick={applyPath} className={primaryButton}>
                            Apply
                        </button>
                    </div>

                    {pathError && (
                        <div className="mt-2 text-sm text-red-600">
                            ⚠ {pathError}
                        </div>
                    )}
                </div>

                {/* Trees */}

                <TreesSection values={trees} onChange={onChangeTrees} />

                {/* Real */}

                <RealSection
                    items={real}
                    onAdd={onAddReal}
                    onDelete={onDeleteReal}
                />

                {/* Weights */}

                <WeightsSection
                    items={weights}
                    onAdd={onAddWeight}
                    onDelete={onDeleteWeight}
                />

                {/* Internals */}

                <TreeReferenceSection
                    title="Internals"
                    icon="4. "
                    items={internals}
                    allowed={trees}
                    onChange={onChangeInternals}
                />

                {/* Root */}

                <TreeReferenceSection
                    title="Root"
                    icon="5. "
                    items={root}
                    allowed={trees}
                    onChange={onChangeRoot}
                />
            </div>
        </div>
    );
}
