import { ReactNode } from "react";
import { Button } from "../components/ui/button";
import { supabase } from "../lib/supabase";

type NavItem = { label: string; onClick?: () => void };

export default function AppShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-gray-200 bg-white p-4">
          <div className="text-lg font-semibold mb-6">TMS</div>
          <div className="space-y-2">
            {nav.map((n, idx) => (
              <Button key={idx} variant="ghost" className="w-full justify-start" onClick={n.onClick}>
                {n.label}
              </Button>
            ))}
          </div>
          <div className="mt-10">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => supabase.auth.signOut()}
            >
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}