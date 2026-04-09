---
name: react-mock-patterns
description: Common patterns for building React+Vite UI mocks with Tailwind, shadcn/ui, MSW, and React Router. Load when implementing pages or components.
---

# React Mock Patterns

Reference patterns for the builder and fixer agents. Load on demand — don't dump into the main context.

## Page skeleton
```tsx
// src/pages/MyPage.tsx
export default function MyPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Title</h1>
      </header>
      {/* content */}
    </section>
  );
}
```
Then register in `src/App.tsx`:
```tsx
<Route path="/my-page" element={<MyPage />} />
```

## Fetching mocked data
```tsx
import { useEffect, useState } from "react";

type Item = { id: number; name: string };

export function useItems() {
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then(setItems);
  }, []);
  return items;
}
```
Add the matching handler in `src/mocks/handlers.ts`:
```ts
http.get("/api/items", () =>
  HttpResponse.json([{ id: 1, name: "Sample" }] satisfies Item[]),
),
```

## Loading & empty states
```tsx
if (items === null) return <p className="text-gray-500">Loading…</p>;
if (items.length === 0) return <p className="text-gray-500">No items yet.</p>;
```

## Composing with shadcn/ui Button
```tsx
import { Button } from "@/components/ui/button";
<Button variant="outline" size="sm">Edit</Button>
```

## When to add a new ui/ component
Only when:
1. The component appears on 2+ pages, AND
2. None of the existing `src/components/ui/*` fit.

Otherwise inline the JSX in the page.

## Anti-patterns to avoid
- Inline `style={{...}}` — use Tailwind classes
- `any` types — define a `type` even for one-off shapes
- Direct `fetch` to real APIs — always go through MSW
- New CSS files — extend `src/index.css` only if absolutely necessary
- Creating `index.ts` barrel files for one or two exports
