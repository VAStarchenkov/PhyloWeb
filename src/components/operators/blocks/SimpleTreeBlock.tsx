import SimpleTreeSection from "../sections/SimpleTreeSection";

import type { SimpleTreeParam } from "../../../types/config";

type Props = {
    title: string;
    icon?: string;

    items: SimpleTreeParam[];

    availableTrees: string[];

    onChange: (v: SimpleTreeParam[]) => void;
};

export default function SimpleTreeBlock({
    title,
    icon,

    items,
    availableTrees,

    onChange,
}: Props) {
    function add(v: SimpleTreeParam) {
        onChange([...items, v]);
    }

    function remove(id: string) {
        onChange(items.filter((x) => x.id !== id));
    }

    return (
        <SimpleTreeSection
            title={title}
            icon={icon}
            items={items}
            availableTrees={availableTrees}
            onAdd={add}
            onDelete={remove}
        />
    );
}
