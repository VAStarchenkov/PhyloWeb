type Props = {
    data: unknown;
};

export default function JsonViewer({ data }: Props) {
    return (
        <pre
            className="
                h-full
                px-6
                py-4
                text-sm
                font-mono
                text-emerald-400
                whitespace-pre-wrap
                break-words
                leading-relaxed
            "
        >
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}
