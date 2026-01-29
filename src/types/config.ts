/* типы States */

export type RealParam = {
    id: string;
    value: number;
};

export type WeightParam = {
    id: string;
    value: number[];
};

export type StatesConfig = {
    dataPath: string;
    trees: string[];
    internals: string[];
    root: string[];
    real: RealParam[];
    weights: WeightParam[];
};

/* типы Priors */

export type BoundParam = {
    id: string;
    lower: number;
    upper: number;
};

export type DistributionParam = {
    id: string;
    type: string;
    params: Record<string, number>;
};

export type TreeParamRef = {
    treeId: string;
    paramId: string;
};

export type PriorsConfig = {
    bounds: BoundParam[];
    distributions: DistributionParam[];

    constantPopulation: TreeParamRef[];
    yule: TreeParamRef[];
};

/* типы Operators */

export type DeltaExchangeParam = {
    id: string;
    factor: number;
    weight: number;
};

export type NodeSlideParam = {
    id: string;
    type: string;
    params: Record<string, number>;
    weight: number;
};

export type ParamScaleParam = {
    id: string;
    factor: number;

    type: string;
    params: Record<string, number>;

    weight: number;
};

export type RootSlideParam = {
    id: string;
    factor: number;
    type: string;
    params: Record<string, number>;
    weight: number;
};

export type SimpleTreeParam = {
    id: string;
    weight: number;
};

export type UpDownParam = {
    up: string;
    down: string;

    factor: number;

    type: string;
    params: Record<string, number>;

    weight: number;
};

export type RandomWalkParam = {
    id: string;

    window: number;
    lower: number;
    upper: number;
    boundary: number;

    weight: number;
};

export type OperatorsConfig = {
    randomWalk: RandomWalkParam[];
    upDown: UpDownParam[];
    deltaExchange: DeltaExchangeParam[];
    paramScale: ParamScaleParam[];

    nodeSlide: NodeSlideParam[];
    subtreeSlide: NodeSlideParam[];
    subtreeLeap: NodeSlideParam[];

    rootSlide: RootSlideParam[];
    treeScale: RootSlideParam[];
    epochScale: RootSlideParam[];

    subtreePruneRegraft: SimpleTreeParam[];
    beastNarrowExchange: SimpleTreeParam[];
    beastWideExchange: SimpleTreeParam[];
    narrowExchange: SimpleTreeParam[];
    wideExchange: SimpleTreeParam[];
    wilsonBalding: SimpleTreeParam[];
};

/* типы Likelihood */

export type LikelihoodIdParam = {
    id: string;
};

export type Cpu4LikelihoodParam = {
    id: string;

    substitution: string;

    strictClock: number;

    treeId: string;

    frequencies: number[];

    kappa: number;
};

export type CudaLikelihoodParam = Cpu4LikelihoodParam & {
    device: number;
};

export type ParallelLikelihoodParam = Cpu4LikelihoodParam & {
    threads: number;
};

export type LikelihoodConfig = {
    cpu4: Cpu4LikelihoodParam[];

    cuda: CudaLikelihoodParam[];

    parallel: ParallelLikelihoodParam[];

    compound: LikelihoodIdParam[];

    weighted: LikelihoodIdParam[];
};

export type McmcConfig = {
    chainLength: number;
    burnIn: number;
    seed: number;
};

/* типы App */

export type AppConfig = {
    states: StatesConfig;
    priors: PriorsConfig;
    operators: OperatorsConfig;
    likelihood: LikelihoodConfig;
    mcmc: McmcConfig;
};
