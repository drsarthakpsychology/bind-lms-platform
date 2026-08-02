"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dr. Sarthak reviewed the data; this component only navigates to static,
 * pre-approved records. Never generates text at request time (Rule 1).
 *
 * Step 1 of the three-tap flow: name → dose chips → band view.
 * Autofocuses on load; type → arrow → enter. No submit button.
 */
export function PsychSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [list, setList] = React.useState<string[]>([]);
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const current = q.trim();
    if (!current) return; // empty handled in onChange
    let cancelled = false;
    // Deterministic prefix search over static data (no model).
    fetch(`/api/psychopharm/search?q=${encodeURIComponent(current)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setList(Array.isArray(d) ? d : []);
          setHighlight(0);
        }
      })
      .catch(() => {
        if (!cancelled) setList([]);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  function go(slug: string) {
    router.push(`/tools/psychopharm/${slug}`);
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = list[highlight] ?? list[0];
      if (target) go(slugFor(target));
    } else if (e.key === "Escape") {
      setList([]);
      setQ("");
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            const v = e.target.value;
            setQ(v);
            if (!v.trim()) {
              setList([]);
              setHighlight(0);
            }
          }}
          onKeyDown={onKey}
          type="text"
          role="combobox"
          aria-expanded={list.length > 0}
          aria-controls={list.length ? "psych-suggestions" : undefined}
          aria-label="Search medications"
          placeholder="Try clonazepam, risperidone, sertraline…"
          className="h-12 w-full rounded-md border-2 border-border bg-background pl-10 pr-4 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
      </div>

      {list.length > 0 ? (
        <ul
          id="psych-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border-2 border-border bg-card hard-shadow-sm"
        >
          {list.map((item, i) => (
            <li
              key={item}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                go(slugFor(item));
              }}
              className={cn(
                "flex flex-col px-3 py-2.5 text-sm",
                i === highlight ? "bg-primary/10" : "",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function slugFor(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}