"use client";

import { CircleAlert } from "lucide-react";
import { memo } from "react";
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
import { cn } from "@/lib/utils";
import { PRIORITY_ITEMS } from "../../project";
import type { Priority } from "../../types";

function PriorityBars({ count }: { count: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <rect height="4" rx="1" width="3" x="1" y="9" />
      <rect
        height="7"
        opacity={count >= 2 ? 1 : 0.3}
        rx="1"
        width="3"
        x="5.5"
        y="6"
      />
      <rect
        height="10"
        opacity={count >= 3 ? 1 : 0.3}
        rx="1"
        width="3"
        x="10"
        y="3"
      />
    </svg>
  );
}

const PRIORITY_CONFIG: Record<
  Priority,
  { icon: React.ReactNode; label: string }
> = {
  urgent: { icon: <CircleAlert size={14} />, label: "Urgent" },
  high: { icon: <PriorityBars count={3} />, label: "High" },
  medium: { icon: <PriorityBars count={2} />, label: "Medium" },
  low: { icon: <PriorityBars count={1} />, label: "Low" },
};

interface PrioritySelectProps {
  defaultValue: Priority;
  name: string;
}

export const PrioritySelect = memo(function PrioritySelect({
  defaultValue,
  name,
}: PrioritySelectProps) {
  return (
    <Select defaultValue={defaultValue} items={PRIORITY_ITEMS} name={name}>
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
          {(value) => (
            <>
              <span
                className={cn(
                  "flex items-center justify-center text-muted-foreground",
                  value === "urgent" && "text-[var(--urgent)]"
                )}
              >
                {PRIORITY_CONFIG[value as Priority].icon}
              </span>
              {PRIORITY_CONFIG[value as Priority].label}
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner
          align="start"
          alignItemWithTrigger={false}
          className="min-w-[120px]"
          sideOffset={6}
        >
          <SelectPopup
            className="w-[160px] shadow-[0_0_0_0.5px_oklch(from_var(--border)_l_c_h_/_0.8),var(--shadow-border-stack)]"
            data-slot="select-popup"
          >
            <SelectSpacer />
            <SelectList className="p-0">
              {PRIORITY_ITEMS.map((p) => (
                <SelectItem
                  className="mx-1 min-h-8 gap-3 px-2 pr-1.5"
                  key={p.value}
                  value={p.value}
                >
                  <span className="flex items-center justify-center text-muted-foreground">
                    {PRIORITY_CONFIG[p.value].icon}
                  </span>
                  <SelectItemText>{p.label}</SelectItemText>
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
