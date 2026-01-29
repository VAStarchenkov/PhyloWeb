import DeltaExchangeSection from "../sections/DeltaExchangeSection";

import type { DeltaExchangeParam } from "../../../types/config";

type Props = {
    items: DeltaExchangeParam[];

    availableParams: string[];

    onChange: (v: DeltaExchangeParam[]) => void;
};

export default function DeltaExchangeBlock({
    items,
    availableParams,
    onChange,
}: Props) {
    /* валидация */

    function validateParamId(id: string): string | null {
        if (!availableParams.includes(id)) {
            return "Такого параметра не существует в States";
        }

        return null;
    }

    /* действия */

    function add(v: DeltaExchangeParam) {
        onChange([...items, v]);
    }

    function remove(id: string) {
        onChange(items.filter((x) => x.id !== id));
    }

    /* ui */

    return (
        <DeltaExchangeSection
            items={items}
            onAdd={add}
            onDelete={remove}
            validateId={validateParamId}
        />
    );
}
