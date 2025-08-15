// import { LastModels } from "@/entities/models/_ui/last_models";
// import { PopularTags } from "@/entities/tags/_ui/popular_tags";
import { Container } from "@/shared/components/custom/app-container";
import { AppFooter } from "@/widgets/app-footer/app-footer";
import { AppHeader } from "@/widgets/app-header/app-header";
import { Sidebar } from "@/widgets/sidebar/app-sidebar";
import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col gap-2 lg:gap-6 ">
      <AppHeader />
      <Container className="h-full flex  flex-1  gap-2 lg:gap-6  ">
        <div className="flex-1 max-w-full ">{children}</div>

        <Sidebar /*children1={<PopularTags count={20} />} children2={<LastModels count={5} />}*/ />
      </Container>
      <AppFooter />
    </div>
  );
}
