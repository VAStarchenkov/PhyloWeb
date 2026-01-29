import type {
    LikelihoodConfig,
    Cpu4LikelihoodParam,
    CudaLikelihoodParam,
    ParallelLikelihoodParam,
} from "../../types/config";

import Cpu4Section from "./Cpu4Section";
import CudaSection from "./CudaSection";
import ParallelSection from "./ParallelSection";
import CompoundSection from "./CompoundSection";
import WeightedSection from "./WeightedSection";

type Props = {
    likelihood: LikelihoodConfig;

    availableTrees: string[];

    onChange: (v: LikelihoodConfig) => void;
};

export default function LikelihoodPanel({
    likelihood,
    availableTrees,
    onChange,
}: Props) {
    /* для Cpu4 */

    function addCpu4(v: Cpu4LikelihoodParam) {
        onChange({
            ...likelihood,
            cpu4: [...likelihood.cpu4, v],
        });
    }

    function deleteCpu4(id: string) {
        onChange({
            ...likelihood,
            cpu4: likelihood.cpu4.filter((x) => x.id !== id),
        });
    }

    /* для Cuda */

    function addCuda(v: CudaLikelihoodParam) {
        onChange({
            ...likelihood,
            cuda: [...likelihood.cuda, v],
        });
    }

    function deleteCuda(id: string) {
        onChange({
            ...likelihood,
            cuda: likelihood.cuda.filter((x) => x.id !== id),
        });
    }

    /* для Parallel */

    function addParallel(v: ParallelLikelihoodParam) {
        onChange({
            ...likelihood,
            parallel: [...likelihood.parallel, v],
        });
    }

    function deleteParallel(id: string) {
        onChange({
            ...likelihood,
            parallel: likelihood.parallel.filter((x) => x.id !== id),
        });
    }

    /* для Compound */

    function addCompound(v: { id: string }) {
        onChange({
            ...likelihood,
            compound: [...likelihood.compound, v],
        });
    }

    function deleteCompound(id: string) {
        onChange({
            ...likelihood,
            compound: likelihood.compound.filter((x) => x.id !== id),
        });
    }

    /* для Weighted */

    function addWeighted(v: { id: string }) {
        onChange({
            ...likelihood,
            weighted: [...likelihood.weighted, v],
        });
    }

    function deleteWeighted(id: string) {
        onChange({
            ...likelihood,
            weighted: likelihood.weighted.filter((x) => x.id !== id),
        });
    }

    /* ui */

    return (
        <div className="flex h-full min-h-0 flex-col p-8 gap-6 overflow-hidden">
            {/* заголовок */}

            <div className="shrink-0">
                <h2 className="text-5xl font-bold text-slate-800">
                    Likelihood
                </h2>

                <p className="mt-2 text-2xl text-slate-600">
                    настройка функции правдоподобия
                </p>
            </div>

            {/* содержимое */}

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
                {/* для Cpu4 */}

                <Cpu4Section
                    items={likelihood.cpu4}
                    availableTrees={availableTrees}
                    usedOtherIds={[
                        ...likelihood.cuda.map((x) => x.id),
                        ...likelihood.parallel.map((x) => x.id),
                    ]}
                    onAdd={addCpu4}
                    onDelete={deleteCpu4}
                />

                {/* для Cuda */}

                <CudaSection
                    items={likelihood.cuda}
                    availableTrees={availableTrees}
                    usedOtherIds={[
                        ...likelihood.cpu4.map((x) => x.id),
                        ...likelihood.parallel.map((x) => x.id),
                    ]}
                    onAdd={addCuda}
                    onDelete={deleteCuda}
                />

                {/* для Parallel */}

                <ParallelSection
                    items={likelihood.parallel}
                    availableTrees={availableTrees}
                    usedOtherIds={[
                        ...likelihood.cpu4.map((x) => x.id),
                        ...likelihood.cuda.map((x) => x.id),
                    ]}
                    onAdd={addParallel}
                    onDelete={deleteParallel}
                />

                {/* для Compound */}

                <CompoundSection
                    items={likelihood.compound}
                    availableIds={[
                        ...likelihood.cpu4.map((x) => x.id),
                        ...likelihood.cuda.map((x) => x.id),
                        ...likelihood.parallel.map((x) => x.id),
                    ]}
                    onAdd={addCompound}
                    onDelete={deleteCompound}
                />

                {/* для Weighted */}

                <WeightedSection
                    items={likelihood.weighted}
                    availableIds={[
                        ...likelihood.cpu4.map((x) => x.id),
                        ...likelihood.cuda.map((x) => x.id),
                        ...likelihood.parallel.map((x) => x.id),
                    ]}
                    onAdd={addWeighted}
                    onDelete={deleteWeighted}
                />
            </div>
        </div>
    );
}
