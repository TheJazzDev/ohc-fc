export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Squad", href: "/squad" },
  { label: "Matchday", href: "/matchday" },
  { label: "Fixtures", href: "/fixtures" },
  { label: "News", href: "/news" },
  { label: "Club", href: "/club" },
];
