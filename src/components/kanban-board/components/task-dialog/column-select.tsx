"use client";

import { CheckCircle2, Circle, CircleDashed, CircleDot } from "lucide-react";
import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectSpacer,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Column } from "../../types";

const COLUMN_ICONS: Record<string, React.ReactNode> = {
  backlog: <CircleDashed size={14} />,
  todo: <Circle size={14} />,
  "in-progress": <CircleDot size={14} />,
  done: <CheckCircle2 size={14} />,
};

const defaultIcon = <Circle size={14} />;

interface ColumnSelectProps {
  columns: Column[];
  defaultValue: string;
  name: string;
}

export const ColumnSelect = memo(function ColumnSelect({
  columns,
  defaultValue,
  name,
}: ColumnSelectProps) {
  const columnById = useMemo(
    () => new Map(columns.map((col) => [col.id, col])),
    [columns]
  );

  const items = useMemo(
    () => columns.map((col) => ({ value: col.id, label: col.name })),
    [columns]
  );

  return (
    <Select defaultValue={defaultValue} items={items} name={name}>
      <SelectTrigger
        className="!min-w-0 inline-flex items-center gap-2 whitespace-nowrap [&_[data-slot=select-value]]:flex [&_[data-slot=select-value]]:items-center [&_[data-slot=select-value]]:gap-2"
        render={
          <Button
            className="!min-w-0 shadow-[0_0_0_1px_oklch(from_var(--border)_l_c_h_/_0.4)]"
            size="sm"
            variant="outline"
          />
        }
      >
        <SelectValue>
          {(value) => {
            const col = columnById.get(value);
            return (
              <>
                <span className="flex items-center justify-center text-muted-foreground">
                  {COLUMN_ICONS[value] ?? defaultIcon}
                </span>
                {col?.name ?? "Select column"}
              </>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner
          align="start"
          alignItemWithTrigger={false}
          className="min-w-[160px]"
          sideOffset={6}
        >
          <SelectPopup
            className="w-[160px] shadow-[0_0_0_0.5px_oklch(from_var(--border)_l_c_h_/_0.8),var(--shadow-border-stack)]"
            data-slot="select-popup"
          >
            <SelectSpacer />
            <SelectList className="p-0">
              {columns.map((col) => (
                <SelectItem
                  className="mx-1 min-h-8 gap-3 px-2 pr-1.5"
                  key={col.id}
                  value={col.id}
                >
                  <span className="flex items-center justify-center text-muted-foreground">
                    {COLUMN_ICONS[col.id] ?? defaultIcon}
                  </span>
                  <SelectItemText>{col.name}</SelectItemText>
                  <SelectItemIndicator className="text-muted-foreground" />
                </SelectItem>
              ))}
            </SelectList>
            <SelectSpacer />
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  );
});
