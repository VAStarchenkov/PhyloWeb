import { useState } from "react";

import TreeDistSimpleSection from "../sections/TreeDistSimpleSection";
import DistributionEditor from "../../priors/DistributionEditor";

type Item = {
    id: string;

    type: string;
    params: Record<string, number>;

    weight: number;
};

type Props = {
    title: string;
    icon?: string;

    items: Item[];

    availableTrees: string[];

    onChange: (v: Item[]) => void;
};

export default function TreeDistSimpleBlock({
    title,
    icon,

    items,
    availableTrees,

    onChange,
}: Props) {
    const [activeId, setActiveId] = useState<string | null>(null);

    /* действия */

    function add(v: Item) {
        onChange([...items, v]);
    }

    function remove(id: string) {
        onChange(items.filter((x) => x.id !== id));

        if (activeId === id) {
            setActiveId(null);
        }
    }

    function updateDist(updated: {
        id: string;
        type: string;
        params: Record<string, number>;
    }) {
        onChange(
            items.map((x) =>
                x.id === updated.id
                    ? {
                          ...x,
                          type: updated.type,
                          params: updated.params,
                      }
                    : x
            )
        );
    }

    function clearDist(id: string) {
        onChange(
            items.map((x) => (x.id === id ? { ...x, type: "", params: {} } : x))
        );
    }

    /* ui */

    return (
        <>
            <TreeDistSimpleSection
                title={title}
                icon={icon}
                items={items}
                availableTrees={availableTrees}
                activeId={activeId}
                onSelect={setActiveId}
                onAdd={add}
                onDelete={remove}
            />

            {activeId && (
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
                        item={items.find((x) => x.id === activeId) || null}
                        onChange={updateDist}
                        onClear={clearDist}
                        onClose={() => setActiveId(null)}
                    />
                </div>
            )}
        </>
    );
}
