import { useState } from "react";

import MainLayout from "./layout/MainLayout";
import TopTabs from "./components/tabs/TopTabs";
import StatesPanel from "./components/states/StatesPanel";
import JsonViewer from "./components/json/JsonViewer";

import PriorsPanel from "./components/priors/PriorsPanel";
import OperatorsPanel from "./components/operators/OperatorsPanel";
import LikelihoodPanel from "./components/likelihood/LikelihoodPanel";
import McmcPanel from "./components/mcmc/McmcPanel";

import type { AppConfig, RealParam, WeightParam } from "./types/config";

/* секции левой части */

type Tab = "States" | "Priors" | "Operators" | "Likelihood" | "MCMC";

/* App */

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("States");

    const [config, setConfig] = useState<AppConfig>({
        states: {
            dataPath: "",

            trees: [],
            internals: [],
            root: [],

            real: [],
            weights: [],
        },

        priors: {
            bounds: [],
            distributions: [],
            constantPopulation: [],
            yule: [],
        },

        operators: {
            upDown: [],
            randomWalk: [],
            deltaExchange: [],
            paramScale: [],

            nodeSlide: [],
            subtreeSlide: [],
            subtreeLeap: [],

            rootSlide: [],
            treeScale: [],
            epochScale: [],

            subtreePruneRegraft: [],
            beastNarrowExchange: [],
            beastWideExchange: [],
            narrowExchange: [],
            wideExchange: [],
            wilsonBalding: [],
        },

        likelihood: {
            cpu4: [],
            cuda: [],
            parallel: [],

            compound: [],
            weighted: [],
        },

        mcmc: {
            chainLength: 0,
            burnIn: 0,
            seed: 0,
        },
    });

    /* доп действие */

    function buildJson(cfg: AppConfig) {
        const result = {
            ...cfg,

            likelihood: {
                ...cfg.likelihood,

                compound: cfg.likelihood.compound.map((x) => x.id),

                weighted: {
                    ids: cfg.likelihood.weighted.map((x) => x.id),
                    weight: cfg.likelihood.weighted.length,
                },
            },
        };

        window.__APP_JSON__ = result;

        return result;
    }

    /* действия */

    function updateDataPath(value: string) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                dataPath: value,
            },
        }));
    }

    function updateTrees(value: string[]) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                trees: value,
            },
        }));
    }

    function updateInternals(value: string[]) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                internals: value,
            },
        }));
    }

    function updateRoot(value: string[]) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                root: value,
            },
        }));
    }

    function addReal(param: RealParam) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                real: [...prev.states.real, param],
            },
        }));
    }

    function deleteReal(id: string) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                real: prev.states.real.filter((x) => x.id !== id),
            },
        }));
    }

    function addWeight(item: WeightParam) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                weights: [...prev.states.weights, item],
            },
        }));
    }

    function deleteWeight(id: string) {
        setConfig((prev) => ({
            ...prev,
            states: {
                ...prev.states,
                weights: prev.states.weights.filter((x) => x.id !== id),
            },
        }));
    }

    /* отображение */

    return (
        <div className="h-screen bg-slate-50 px-10 py-8 overflow-hidden">
            <MainLayout
                left={
                    <div className="h-full flex flex-col overflow-hidden min-w-[700px]">
                        {/* вкладки */}

                        <TopTabs active={activeTab} onChange={setActiveTab} />

                        {/* панели */}

                        <div className="flex-1 overflow-hidden">
                            {activeTab === "States" && (
                                <StatesPanel
                                    dataPath={config.states.dataPath}
                                    trees={config.states.trees}
                                    internals={config.states.internals}
                                    root={config.states.root}
                                    real={config.states.real}
                                    weights={config.states.weights}
                                    onChangeDataPath={updateDataPath}
                                    onChangeTrees={updateTrees}
                                    onChangeInternals={updateInternals}
                                    onChangeRoot={updateRoot}
                                    onAddReal={addReal}
                                    onDeleteReal={deleteReal}
                                    onAddWeight={addWeight}
                                    onDeleteWeight={deleteWeight}
                                />
                            )}

                            {activeTab === "Priors" && (
                                <PriorsPanel
                                    priors={config.priors}
                                    availableParams={[
                                        ...config.states.real.map((x) => x.id),
                                        ...config.states.weights.map(
                                            (x) => x.id
                                        ),
                                    ]}
                                    availableTrees={config.states.trees}
                                    onChange={(v) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            priors: v,
                                        }))
                                    }
                                />
                            )}

                            {activeTab === "Operators" && (
                                <OperatorsPanel
                                    operators={config.operators}
                                    availableParams={[
                                        ...config.states.real.map((x) => x.id),
                                        ...config.states.weights.map(
                                            (x) => x.id
                                        ),
                                    ]}
                                    availableTrees={config.states.trees}
                                    onChange={(v) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            operators: v,
                                        }))
                                    }
                                />
                            )}

                            {activeTab === "Likelihood" && (
                                <LikelihoodPanel
                                    likelihood={config.likelihood}
                                    availableTrees={config.states.trees}
                                    onChange={(v) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            likelihood: v,
                                        }))
                                    }
                                />
                            )}

                            {activeTab === "MCMC" && (
                                <McmcPanel
                                    mcmc={config.mcmc}
                                    onChange={(v) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            mcmc: v,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                }
                right={<JsonViewer data={buildJson(config)} />}
            />
        </div>
    );
}
