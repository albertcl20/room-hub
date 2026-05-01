"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/rooms", label: "Rooms" },
  { href: "/meetings", label: "Meetings" },
  { href: "/desks", label: "Desks" },
  { href: "/visitors", label: "Visitors" },
  { href: "/analytics", label: "Analytics" },
];

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="platform-shell">
      <aside className="sidebar card">
        <div className="brand-lockup">
          <span className="eyebrow">Room Hub</span>
          <h1>Workplace OS</h1>
          <p>Meeting management, room scheduling, desk booking, visitors, and workplace ops in one place.</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>Inspired by modern workplace software, but built as its own product shell.</p>
        </div>
      </aside>

      <div className="platform-main">{children}</div>
    </div>
  );
}
