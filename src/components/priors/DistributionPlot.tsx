import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/* типы */
type Props = {
    type: string;
    params: Record<string, number>;
};

/* вспомогательная функция */
function range(min: number, max: number, n = 300) {
    const step = (max - min) / (n - 1);
    return Array.from({ length: n }, (_, i) => min + i * step);
}

/* гамма-функция */
function gammaFunc(z: number): number {
    const g = 7;
    const p = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ];

    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gammaFunc(1 - z));
    }

    z -= 1;
    let x = p[0];

    for (let i = 1; i < g + 2; i++) {
        x += p[i] / (z + i);
    }

    const t = z + g + 0.5;

    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function betaFunc(a: number, b: number) {
    return (gammaFunc(a) * gammaFunc(b)) / gammaFunc(a + b);
}

function factorial(n: number): number {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

/* распределения */

function beta(x: number, a: number, b: number) {
    if (x <= 0 || x >= 1) return 0;

    const B = betaFunc(a, b);

    return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / B;
}

function normal(x: number, mu = 0, sigma = 1) {
    return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
    );
}

function exponential(x: number, lambda: number) {
    return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
}

function gammaDist(x: number, k: number, theta: number) {
    if (x < 0) return 0;

    return (
        (Math.pow(x, k - 1) * Math.exp(-x / theta)) /
        (gammaFunc(k) * Math.pow(theta, k))
    );
}

function inverseGamma(x: number, a: number, b: number) {
    if (x <= 0) return 0;

    return (
        (Math.pow(b, a) / gammaFunc(a)) * Math.pow(x, -a - 1) * Math.exp(-b / x)
    );
}

function laplace(x: number, mu: number, b: number) {
    return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
}

function logNormal(x: number, mu: number, sigma: number) {
    if (x <= 0) return 0;

    return (
        (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma))
    );
}

function poisson(k: number, lambda: number) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function uniform(x: number, a: number, b: number) {
    return x >= a && x <= b ? 1 / (b - a) : 0;
}

/* автоматическое масштабирование*/

function autoScale(ys: number[]) {
    const max = Math.max(...ys);
    return max > 0 ? max * 1.1 : 1;
}

/* основной компонент */

export default function DistributionPlot({ type, params }: Props) {
    let xs: number[] = [];
    let ys: number[] = [];
    let discrete = false;

    switch (type) {
        /* нормальное распределение */

        case "Normal": {
            const mu = params.location ?? 0;
            const s = params.scale ?? 1;

            xs = range(mu - 4 * s, mu + 4 * s);
            ys = xs.map((x) => normal(x, mu, s));
            break;
        }

        /* экспоненциальное распределение */

        case "Exp": {
            const r = params.rate ?? 1;

            xs = range(0, 10 / r);
            ys = xs.map((x) => exponential(x, r));
            break;
        }

        /* бета-распределение */

        case "Beta": {
            const a = params.shape_a ?? 2;
            const b = params.shape_b ?? 2;

            xs = range(0.001, 0.999);
            ys = xs.map((x) => beta(x, a, b));
            break;
        }

        /* гамма-распределение */

        case "Gamma": {
            const k = params.shape ?? 2;
            const t = params.rate ?? 1;

            xs = range(0, k * t * 6);
            ys = xs.map((x) => gammaDist(x, k, t));
            break;
        }

        /* распределение обратной гаммы */

        case "InverseGamma": {
            const a = params.shape ?? 3;
            const b = params.rate ?? 2;

            xs = range(0.001, 10);
            ys = xs.map((x) => inverseGamma(x, a, b));
            break;
        }

        /* распределение Лапласа */

        case "Laplace": {
            const mu = params.location ?? 0;
            const b = params.scale ?? 1;

            xs = range(mu - 8 * b, mu + 8 * b);
            ys = xs.map((x) => laplace(x, mu, b));
            break;
        }

        /* логнормальное распределение */

        case "LogNormal": {
            const mu = params.location ?? 0;
            const s = params.scale ?? 1;

            xs = range(0.001, Math.exp(mu + 4 * s));
            ys = xs.map((x) => logNormal(x, mu, s));
            break;
        }

        /* распределение Пуассона */

        case "Poisson": {
            const l = params.lambda ?? 3;

            discrete = true;

            const maxK = Math.max(15, Math.ceil(l * 4));

            xs = Array.from({ length: maxK + 1 }, (_, i) => i);
            ys = xs.map((k) => poisson(k, l));
            break;
        }

        /* равномерное распределение */

        case "Uniform": {
            const a = params.min ?? 0;
            const b = params.max ?? 1;

            if (a >= b) break;

            xs = range(a - (b - a) * 0.2, b + (b - a) * 0.2);

            ys = xs.map((x) => uniform(x, a, b));
            break;
        }

        default:
            return (
                <div className="h-full flex items-center justify-center text-slate-400">
                    Выберите распределение
                </div>
            );
    }

    if (!xs.length || !ys.length) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400">
                Некорректные параметры
            </div>
        );
    }

    /* подготовка данных */

    const maxY = autoScale(ys);

    const data = xs.map((x, i) => ({
        x: Number(x.toFixed(4)),
        y: Number(ys[i].toFixed(6)),
    }));

    /* отрисовка */

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="x" />

                    <YAxis
                        domain={[0, maxY]}
                        tickFormatter={(v) =>
                            v < 0.001 ? v.toExponential(1) : v.toFixed(3)
                        }
                    />

                    <Tooltip />

                    <Line
                        type={discrete ? "stepAfter" : "monotone"}
                        dataKey="y"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={discrete}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
