"use client";

import { Check, Filter, Layers, X } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemIndicator,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRadioItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuSpacer,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { capitalize, GROUP_BY_ITEMS, PRIORITY_ITEMS } from "../project";
import type { FilterConfig, GroupByField, Priority, Tag } from "../types";

function CheckIcon() {
  return <Check size={12} />;
}

export type FilterBarProps = {
  className?: string;
  filters: FilterConfig;
  tags: Tag[];
  groupBy: GroupByField;
  onTogglePriority: (priority: Priority, checked: boolean) => void;
  onToggleTag: (tag: string, checked: boolean) => void;
  onGroupByChange: (groupBy: GroupByField) => void;
};

export function FilterBar({
  className,
  filters,
  tags,
  groupBy,
  onTogglePriority,
  onToggleTag,
  onGroupByChange,
}: FilterBarProps) {
  const activeFilterCount = useMemo(
    () => filters.priority.length + filters.tags.length,
    [filters.priority.length, filters.tags.length]
  );

  const currentGroupByLabel = useMemo(
    () =>
      GROUP_BY_ITEMS.find((item) => item.value === groupBy)?.label ??
      "Group by",
    [groupBy]
  );

  const prioritySet = useMemo(
    () => new Set(filters.priority),
    [filters.priority]
  );
  const tagSet = useMemo(() => new Set(filters.tags), [filters.tags]);
  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2 px-4 py-3", className)}
      data-slot="filter-bar"
    >
      {/* Filter Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className="gap-2" size="sm" variant="outline">
              <Filter className="text-muted-foreground" size={14} />
              Filters
              {activeFilterCount > 0 && (
                <Badge size="sm" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          }
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner align="start" side="bottom" sideOffset={8}>
            <DropdownMenuPopup>
              <DropdownMenuSpacer />

              <DropdownMenuGroup>
                <DropdownMenuGroupLabel>Priority</DropdownMenuGroupLabel>
                {PRIORITY_ITEMS.map((item) => (
                  <DropdownMenuCheckboxItem
                    checked={prioritySet.has(item.value)}
                    key={item.value}
                    onCheckedChange={(checked) =>
                      onTogglePriority(item.value, checked)
                    }
                  >
                    <span>{item.label}</span>
                    <DropdownMenuCheckboxItemIndicator>
                      <CheckIcon />
                    </DropdownMenuCheckboxItemIndicator>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuGroupLabel>Tags</DropdownMenuGroupLabel>
                {tags.length === 0 ? (
                  <div className="px-3 py-1.5 text-muted-foreground text-sm">
                    No tags created yet
                  </div>
                ) : (
                  tags.map((tag) => (
                    <DropdownMenuCheckboxItem
                      checked={tagSet.has(tag.id)}
                      key={tag.id}
                      onCheckedChange={(checked) =>
                        onToggleTag(tag.id, checked)
                      }
                    >
                      <span
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.name}</span>
                      <DropdownMenuCheckboxItemIndicator>
                        <CheckIcon />
                      </DropdownMenuCheckboxItemIndicator>
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuGroup>

              <DropdownMenuSpacer />
            </DropdownMenuPopup>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenu>

      {/* Group By Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className="gap-2" size="sm" variant="outline">
              <Layers className="text-muted-foreground" size={14} />
              {currentGroupByLabel}
            </Button>
          }
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner align="start" side="bottom" sideOffset={8}>
            <DropdownMenuPopup>
              <DropdownMenuSpacer />

              <DropdownMenuGroup>
                <DropdownMenuGroupLabel>Group by</DropdownMenuGroupLabel>
                <DropdownMenuRadioGroup
                  onValueChange={(value) =>
                    onGroupByChange(value as GroupByField)
                  }
                  value={groupBy}
                >
                  {GROUP_BY_ITEMS.map((item) => (
                    <DropdownMenuRadioItem key={item.value} value={item.value}>
                      {item.label}
                      <DropdownMenuRadioItemIndicator>
                        <CheckIcon />
                      </DropdownMenuRadioItemIndicator>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSpacer />
            </DropdownMenuPopup>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenu>

      {/* Active Filters - inline */}
      {filters.priority.map((p) => (
        <Badge className="flex items-center gap-1" key={p} variant="secondary">
          {capitalize(p)}
          <button
            aria-label={`Remove ${capitalize(p)} priority filter`}
            className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 opacity-70 transition-opacity duration-150 hover:opacity-100"
            onClick={() => onTogglePriority(p, false)}
            type="button"
          >
            <X aria-hidden="true" size={12} />
          </button>
        </Badge>
      ))}
      {filters.tags.map((tagId) => {
        const tag = tagMap.get(tagId);
        if (!tag) return null;
        return (
          <Badge
            className="flex items-center gap-1"
            key={tagId}
            variant="secondary"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            <button
              aria-label={`Remove ${tag.name} tag filter`}
              className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 opacity-70 transition-opacity duration-150 hover:opacity-100"
              onClick={() => onToggleTag(tagId, false)}
              type="button"
            >
              <X aria-hidden="true" size={12} />
            </button>
          </Badge>
        );
      })}
    </div>
  );
}

export type ActiveFiltersProps = {
  className?: string;
  filters: FilterConfig;
  tags: Tag[];
  onRemovePriority: (priority: Priority) => void;
  onRemoveTag: (tag: string) => void;
};

export function ActiveFilters({
  className,
  filters,
  tags,
  onRemovePriority,
  onRemoveTag,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.priority.length > 0 || filters.tags.length > 0;
  const tagMap = new Map(tags.map((t) => [t.id, t]));

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      data-slot="active-filters"
    >
      {filters.priority.map((p) => (
        <Badge className="flex items-center gap-1" key={p} variant="secondary">
          {capitalize(p)}
          <button
            aria-label={`Remove ${capitalize(p)} priority filter`}
            className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 opacity-70 transition-opacity duration-150 hover:opacity-100"
            onClick={() => onRemovePriority(p)}
            type="button"
          >
            <X aria-hidden="true" size={12} />
          </button>
        </Badge>
      ))}
      {filters.tags.map((tagId) => {
        const tag = tagMap.get(tagId);
        if (!tag) return null;
        return (
          <Badge
            className="flex items-center gap-1"
            key={tagId}
            variant="secondary"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            <button
              aria-label={`Remove ${tag.name} tag filter`}
              className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 opacity-70 transition-opacity duration-150 hover:opacity-100"
              onClick={() => onRemoveTag(tagId)}
              type="button"
            >
              <X aria-hidden="true" size={12} />
            </button>
          </Badge>
        );
      })}
    </div>
  );
}
