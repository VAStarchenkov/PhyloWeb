import { useState } from "react";

import BoundsSection from "./BoundsSection";
import DistributionSection from "./DistributionSection";
import DistributionEditor from "./DistributionEditor";
import PriorsReferenceSection from "./PriorsReferenceSection";

import type { PriorsConfig, BoundParam } from "../../types/config";

/* типы */

type Props = {
    priors: PriorsConfig;

    availableParams: string[];
    availableTrees: string[];

    onChange: (v: PriorsConfig) => void;
};

/* основной компонент */

export default function PriorsPanel({
    priors,
    availableParams,
    availableTrees,
    onChange,
}: Props) {
    /* состояние */

    const [activeDistributionId, setActiveDistributionId] = useState<
        string | null
    >(null);

    /* действия */

    /* для вкладки Bounds */

    function addBound(v: BoundParam) {
        onChange({
            ...priors,
            bounds: [...priors.bounds, v],
        });
    }

    function deleteBound(id: string) {
        onChange({
            ...priors,
            bounds: priors.bounds.filter((x) => x.id !== id),
        });
    }

    function validateBoundId(id: string): string | null {
        if (!availableParams.includes(id)) {
            return "Такого параметра не существует в States";
        }

        return null;
    }

    /* для вкладки Distributions */

    function addDistribution(id: string) {
        onChange({
            ...priors,
            distributions: [
                ...priors.distributions,
                {
                    id,
                    type: "",
                    params: {},
                },
            ],
        });
    }

    function deleteDistribution(id: string) {
        onChange({
            ...priors,
            distributions: priors.distributions.filter((x) => x.id !== id),
        });

        if (activeDistributionId === id) {
            setActiveDistributionId(null);
        }
    }

    function validateDistributionId(id: string): string | null {
        if (!availableParams.includes(id)) {
            return "Такого параметра не существует в States";
        }

        return null;
    }

    function updateDistribution(updated: any) {
        onChange({
            ...priors,
            distributions: priors.distributions.map((x) =>
                x.id === updated.id ? updated : x
            ),
        });
    }

    function clearDistribution(id: string) {
        onChange({
            ...priors,
            distributions: priors.distributions.map((x) =>
                x.id === id ? { ...x, type: "", params: {} } : x
            ),
        });
    }

    /* ui */

    return (
        <div className="flex h-full min-h-0 flex-col p-8 gap-6 overflow-hidden">
            {/* заголовок */}

            <div className="shrink-0">
                <h2 className="text-5xl font-bold text-slate-800">Priors</h2>

                <p className="mt-2 text-2xl text-slate-600">
                    настройка априорных распределений
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
                {/* вкладка Bounds */}

                <BoundsSection
                    items={priors.bounds}
                    onAdd={addBound}
                    onDelete={deleteBound}
                    validateId={validateBoundId}
                />

                {/* вкладка Distributions */}

                <DistributionSection
                    items={priors.distributions}
                    activeId={activeDistributionId}
                    onSelect={setActiveDistributionId}
                    onAdd={addDistribution}
                    onDelete={deleteDistribution}
                    validateId={validateDistributionId}
                />

                {/* редактор */}

                {activeDistributionId && (
                    <div
                        className="
                            shrink-0
                            min-h-[720px]
                            max-h-[70vh]
                            rounded-3xl
                            bg-white
                            shadow
                            ring-1
                            ring-slate-200
                            overflow-hidden
                        "
                    >
                        <DistributionEditor
                            item={
                                priors.distributions.find(
                                    (x) => x.id === activeDistributionId
                                ) || null
                            }
                            onChange={updateDistribution}
                            onClear={clearDistribution}
                            onClose={() => setActiveDistributionId(null)}
                        />
                    </div>
                )}

                {/* вкладка ConstantPopulation */}

                <PriorsReferenceSection
                    title="ConstantPopulation"
                    icon="3."
                    items={priors.constantPopulation}
                    availableTrees={availableTrees}
                    availableParams={availableParams}
                    onChange={(v) =>
                        onChange({
                            ...priors,
                            constantPopulation: v,
                        })
                    }
                />

                {/* вкладка Yule */}

                <PriorsReferenceSection
                    title="Yule"
                    icon="4."
                    items={priors.yule}
                    availableTrees={availableTrees}
                    availableParams={availableParams}
                    onChange={(v) =>
                        onChange({
                            ...priors,
                            yule: v,
                        })
                    }
                />
            </div>
        </div>
    );
}
