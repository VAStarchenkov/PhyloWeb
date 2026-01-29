type Props = {
    left: React.ReactNode;
    right: React.ReactNode;
};

export default function MainLayout({ left, right }: Props) {
    return (
        <div className="h-full flex gap-6 min-w-0">
            {/* левая часть занимает 60% */}
            <div
                className="
                    flex-[3]
                    min-w-0
                    flex
                    flex-col

                    overflow-x-auto
                "
            >
                {left}
            </div>

            {/* правая часть занимает 40% */}
            <div
                className="
                    flex-[2]
                    min-w-0
                    flex
                    flex-col
                    rounded-3xl
                    bg-gradient-to-b
                    from-slate-900
                    to-slate-800
                    shadow-xl
                    overflow-hidden
                "
            >
                {/* заголовок */}
                <div
                    className="
                        px-6
                        py-4
                        text-lg
                        font-semibold
                        text-slate-200
                        border-b
                        border-slate-700
                        shrink-0
                    "
                >
                    JSON configuration
                </div>

                {/* содержимое */}
                <div className="flex-1 min-h-0 overflow-y-auto">{right}</div>
            </div>
        </div>
    );
}
