"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Plus, Tag as TagIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
} from "@/components/ui/combobox";
import type { Tag } from "../../types";

function TagDot({ color }: { color: string }) {
  return (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

interface TagsComboboxProps {
  tags: Tag[];
  selectedTags: Tag[];
  onValueChange: (tags: Tag[]) => void;
  onAddTagClick: () => void;
}

export const TagsCombobox = memo(function TagsCombobox({
  tags,
  selectedTags,
  onValueChange,
  onAddTagClick,
}: TagsComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Combobox<Tag, true>
      items={tags}
      multiple
      name="tags"
      onOpenChange={setOpen}
      onValueChange={onValueChange}
      open={open}
      value={selectedTags}
    >
      <ComboboxPrimitive.Trigger
        render={
          <Button
            className="inline-flex items-center gap-2 whitespace-nowrap shadow-[0_0_0_1px_oklch(from_var(--border)_l_c_h_/_0.4)]"
            size="sm"
            variant="outline"
          />
        }
      >
        <span className="flex items-center justify-center text-muted-foreground">
          <TagIcon size={14} />
        </span>
        <ComboboxPrimitive.Value>
          {(value) =>
            Array.isArray(value) && value.length > 0 ? (
              <div className="flex items-center">
                {value.map((tag, index) => (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full border border-background"
                    key={tag.id}
                    style={{
                      backgroundColor: tag.color,
                      marginLeft: index > 0 ? "-4px" : 0,
                    }}
                  />
                ))}
              </div>
            ) : (
              "Tags"
            )
          }
        </ComboboxPrimitive.Value>
      </ComboboxPrimitive.Trigger>
      <ComboboxPortal>
        <ComboboxPositioner side="bottom" sideOffset={6}>
          <ComboboxPopup className="min-w-[200px]">
            <ComboboxInput
              className="!rounded-none !bg-transparent !shadow-[inset_0_-1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)] focus:!shadow-[inset_0_-1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)]"
              placeholder="Search tags..."
            />
            <ComboboxEmpty>No tags found</ComboboxEmpty>
            <div className="h-1 w-full shrink-0" />
            <ComboboxList>
              {(tag: Tag) => (
                <ComboboxItem
                  indicatorPosition="right"
                  key={tag.id}
                  value={tag}
                >
                  <TagDot color={tag.color} />
                  <span style={{ flex: 1 }}>{tag.name}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
            <div className="h-1 w-full shrink-0" />
            <div className="px-1 shadow-[inset_0_1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)]">
              <div className="h-1 w-full shrink-0" />
              <button
                className="flex w-full cursor-pointer items-center gap-2 rounded-[calc(var(--radius)-4px)] border-none bg-transparent px-2 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-[var(--accent)] hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  onAddTagClick();
                }}
                type="button"
              >
                <Plus size={14} />
                <span>Add tag</span>
              </button>
            </div>
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </Combobox>
  );
});
