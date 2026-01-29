import RandomWalkSection from "../sections/RandomWalkSection";

import type { RandomWalkParam } from "../../../types/config";

type Props = {
    items: RandomWalkParam[];

    availableParams: string[];

    onChange: (v: RandomWalkParam[]) => void;
};

export default function RandomWalkBlock({
    items,
    availableParams,
    onChange,
}: Props) {
    function add(v: RandomWalkParam) {
        onChange([...items, v]);
    }

    function remove(id: string) {
        onChange(items.filter((x) => x.id !== id));
    }

    return (
        <RandomWalkSection
            items={items}
            availableParams={availableParams}
            onAdd={add}
            onDelete={remove}
        />
    );
}
