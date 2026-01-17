"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button aria-label="Toggle theme" size="icon" variant="ghost">
        <Sun aria-hidden="true" size={16} />
      </Button>
    );
  }

  return (
    <Button
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      {resolvedTheme === "dark" ? (
        <Sun aria-hidden="true" size={16} />
      ) : (
        <Moon aria-hidden="true" size={16} />
      )}
    </Button>
  );
}
