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
    name: "Рейтинги",
    path: "/news",
  },
  {
    name: "Новинки",
    path: "/reviews",
  },
  {
    name: "Жанры",
    path: "/brands",
  },
  {
    name: "Тэги",
    path: "/tags",
  },
  // {
  //   name: "Сравнение моделей",
  //   path: "/compare",
  // },
];
