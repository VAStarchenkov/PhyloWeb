import { useState } from "react";

import DeltaExchangeBlock from "./blocks/DeltaExchangeBlock";
import ParamScaleBlock from "./blocks/ParamScaleBlock";
import TreeDistBlock from "./blocks/TreeDistBlock";
import SimpleTreeBlock from "./blocks/SimpleTreeBlock";
import UpDownBlock from "./blocks/UpDownBlock";
import TreeDistSimpleBlock from "./blocks/TreeDistSimpleBlock";
import RandomWalkBlock from "./blocks/RandomWalkBlock";

import type { OperatorsConfig } from "../../types/config";

/* типы */

type Props = {
    operators: OperatorsConfig;

    availableParams: string[];
    availableTrees: string[];

    onChange: (v: OperatorsConfig) => void;
};

/* основной компонент */
export default function OperatorsPanel({
    operators,
    availableParams,
    availableTrees,
    onChange,
}: Props) {
    /* состояние */
    const [page, setPage] = useState<1 | 2>(1);

    /* ui */

    return (
        <div className="flex h-full min-h-0 flex-col p-8 gap-6 overflow-hidden">
            {/* заголовок */}
            <div className="shrink-0">
                <h2 className="text-5xl font-bold text-slate-800">Operators</h2>

                <p className="mt-2 text-2xl text-slate-600">
                    настройка операторов MCMC
                </p>
            </div>

            {/* переключатель страниц */}

            <div className="shrink-0 flex gap-3">
                {[1, 2].map((p) => {
                    const active = page === p;

                    return (
                        <button
                            key={p}
                            onClick={() => setPage(p as 1 | 2)}
                            className={`
                px-5 py-2 rounded-xl font-semibold transition

                ${
                    active
                        ? "bg-amber-300 text-amber-900 shadow"
                        : "bg-slate-100 hover:bg-slate-200"
                }
              `}
                        >
                            Page {p}
                        </button>
                    );
                })}
            </div>

            {/* контент */}

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
                {/* страница 1 */}

                {page === 1 && (
                    <>
                        {/* RandomWalk */}

                        <RandomWalkBlock
                            items={operators.randomWalk}
                            availableParams={availableParams}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    randomWalk: v,
                                })
                            }
                        />

                        {/* NodeSlide */}

                        <TreeDistSimpleBlock
                            title="NodeSlide"
                            icon="2."
                            items={operators.nodeSlide}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    nodeSlide: v,
                                })
                            }
                        />

                        <TreeDistSimpleBlock
                            title="SubtreeSlide"
                            icon="3."
                            items={operators.subtreeSlide}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    subtreeSlide: v,
                                })
                            }
                        />

                        <TreeDistSimpleBlock
                            title="SubtreeLeap"
                            icon="4."
                            items={operators.subtreeLeap}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    subtreeLeap: v,
                                })
                            }
                        />

                        {/* ParamScale */}

                        <ParamScaleBlock
                            items={operators.paramScale}
                            availableParams={availableParams}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    paramScale: v,
                                })
                            }
                        />

                        {/* RootSlide */}

                        <TreeDistBlock
                            title="RootSlide"
                            icon="6."
                            items={operators.rootSlide}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    rootSlide: v,
                                })
                            }
                        />

                        {/* TreeScale */}

                        <TreeDistBlock
                            title="TreeScale"
                            icon="7."
                            items={operators.treeScale}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    treeScale: v,
                                })
                            }
                        />

                        {/* EpochScale */}

                        <TreeDistBlock
                            title="EpochScale"
                            icon="8."
                            items={operators.epochScale}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    epochScale: v,
                                })
                            }
                        />
                    </>
                )}

                {/* страница 2 */}

                {page === 2 && (
                    <>
                        {/* UpDown */}

                        <UpDownBlock
                            items={operators.upDown}
                            availableParams={availableParams}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    upDown: v,
                                })
                            }
                        />

                        {/* DeltaExchange */}

                        <DeltaExchangeBlock
                            items={operators.deltaExchange}
                            availableParams={availableParams}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    deltaExchange: v,
                                })
                            }
                        />

                        {/* SubtreePruneRegraft */}

                        <SimpleTreeBlock
                            title="SubtreePruneRegraft"
                            icon="11."
                            items={operators.subtreePruneRegraft}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    subtreePruneRegraft: v,
                                })
                            }
                        />

                        {/* BeastNarrowExchange */}

                        <SimpleTreeBlock
                            title="BeastNarrowExchange"
                            icon="12."
                            items={operators.beastNarrowExchange}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    beastNarrowExchange: v,
                                })
                            }
                        />

                        {/* BeastWideExchange */}

                        <SimpleTreeBlock
                            title="BeastWideExchange"
                            icon="13."
                            items={operators.beastWideExchange}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    beastWideExchange: v,
                                })
                            }
                        />

                        {/* NarrowExchange */}

                        <SimpleTreeBlock
                            title="NarrowExchange"
                            icon="14."
                            items={operators.narrowExchange}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    narrowExchange: v,
                                })
                            }
                        />

                        {/* WideExchange */}

                        <SimpleTreeBlock
                            title="WideExchange"
                            icon="15."
                            items={operators.wideExchange}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    wideExchange: v,
                                })
                            }
                        />

                        {/* WilsonBalding */}

                        <SimpleTreeBlock
                            title="WilsonBalding"
                            icon="16."
                            items={operators.wilsonBalding}
                            availableTrees={availableTrees}
                            onChange={(v) =>
                                onChange({
                                    ...operators,
                                    wilsonBalding: v,
                                })
                            }
                        />
                    </>
                )}
            </div>
        </div>
    );
}
