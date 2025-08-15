export function Layout({
  logo,
  nav,
  profile,
  actions,
  mobileNav,
}: {
  logo?: React.ReactNode;
  nav?: React.ReactNode;
  profile?: React.ReactNode;
  actions?: React.ReactNode;
  mobileNav?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-center  w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="xl:container w-full justify-between  flex h-14 items-center lg:py-6 py-2">
        <div className="md:hidden mr-2 flex flex-row gap-2 items-center justify-center">
          {logo}
          {mobileNav}
        </div>

        <div className=" hidden md:flex mr-4">{logo}</div>
        <div className="items-center flex-1 flex">
          <div className="hidden md:flex">{nav}</div>
          <div className="flex flex-1 items-center justify-end gap-2 ">
            {actions}
            {profile}
          </div>
        </div>
      </div>
    </header>
  );
}
