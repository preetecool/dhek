"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { formatDateString, parseDateString } from "../../project";

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const DueDatePicker = memo(function DueDatePicker({
  value,
  onChange,
}: DueDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center gap-2"
        render={
          <Button
            className="shadow-[0_0_0_1px_oklch(from_var(--border)_l_c_h_/_0.4)]"
            size="sm"
            variant="outline"
          />
        }
      >
        <span className="flex items-center justify-center text-muted-foreground">
          <CalendarIcon size={14} />
        </span>
        {value ? parseDateString(value).toLocaleDateString() : "Due date"}
      </PopoverTrigger>
      <PopoverPopup
        align="start"
        arrow={false}
        className="z-[200]"
        sideOffset={6}
      >
        <Calendar
          className="p-0"
          mode="single"
          onSelect={(date) => {
            onChange(date ? formatDateString(date) : "");
          }}
          selected={value.length > 0 ? parseDateString(value) : undefined}
        />
      </PopoverPopup>
    </Popover>
  );
});
