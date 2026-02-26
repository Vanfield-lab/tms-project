// src/app/AppShell.tsx  (REPLACE FULL FILE)

import { ReactNode, useMemo, useState } from "react";

type ClickNavItem = { label: string; onClick: () => void };
type ElementNavItem = { label: string; element: ReactNode };
type NavItem = ClickNavItem | ElementNavItem;

type Props = {
  title: string;
  nav?: ClickNavItem[]; // legacy
  navItems?: ElementNavItem[]; // new
  children?: ReactNode;
};

function isElementItem(item: NavItem): item is ElementNavItem {
  return "element" in item;
}

export default function AppShell({ title, nav, navItems, children }: Props) {
  const items = useMemo<NavItem[]>(() => {
    if (navItems && navItems.length) return navItems;
    if (nav && nav.length) return nav;
    return [];
  }, [nav, navItems]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = items[activeIndex];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              if (!isElementItem(item)) item.onClick();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              i === activeIndex ? "bg-black text-white" : "hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6">
        {activeItem && isElementItem(activeItem) ? activeItem.element : children}
      </main>
    </div>
  );
}