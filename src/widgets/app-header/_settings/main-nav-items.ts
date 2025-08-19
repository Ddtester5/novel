export interface NavItems {
  name: string;
  path: string;
}

export const mainNavItems: NavItems[] = [
  {
    name: "Главная",
    path: "/",
  },
  {
    name: "Поиск",
    path: "/seaarch",
  },
  {
    name: "Рейтинги",
    path: "/rating",
  },
];
