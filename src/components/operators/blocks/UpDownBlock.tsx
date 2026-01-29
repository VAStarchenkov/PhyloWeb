import { useState } from "react";

import UpDownSection from "../sections/UpDownSection";
import DistributionEditor from "../../priors/DistributionEditor";

import type { UpDownParam } from "../../../types/config";

type Props = {
    items: UpDownParam[];

    availableParams: string[];

    onChange: (v: UpDownParam[]) => void;
};

function makeEditorId(x: UpDownParam) {
    return `${x.up}__${x.down}`;
}

export default function UpDownBlock({
    items,
    availableParams,
    onChange,
}: Props) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    /* действия */

    function add(v: UpDownParam) {
        onChange([...items, v]);
    }

    function remove(i: number) {
        onChange(items.filter((_, idx) => idx !== i));

        if (activeIndex === i) {
            setActiveIndex(null);
        }
    }

    function updateDist(
        i: number,
        updated: {
            type: string;
            params: Record<string, number>;
        }
    ) {
        onChange(
            items.map((x, idx) =>
                idx === i
                    ? {
                          ...x,
                          type: updated.type,
                          params: updated.params,
                      }
                    : x
            )
        );
    }

    function clearDist(i: number) {
        onChange(
            items.map((x, idx) =>
                idx === i ? { ...x, type: "", params: {} } : x
            )
        );
    }

    /* ui */

    const activeItem = activeIndex !== null ? items[activeIndex] : null;

    return (
        <>
            <UpDownSection
                items={items}
                availableParams={availableParams}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                onAdd={add}
                onDelete={remove}
            />

            {activeItem && activeIndex !== null && (
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
                        item={{
                            id: makeEditorId(activeItem),
                            type: activeItem.type,
                            params: activeItem.params,
                        }}
                        onChange={(v) =>
                            updateDist(activeIndex, {
                                type: v.type,
                                params: v.params,
                            })
                        }
                        onClear={() => clearDist(activeIndex)}
                        onClose={() => setActiveIndex(null)}
                    />
                </div>
            )}
        </>
    );
}
