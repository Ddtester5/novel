import { Layout } from "./_ui/layout";
import { Logo } from "../../shared/components/custom/logo";
import { FooterNav } from "./_ui/footer-nav";
import { FooterNavItems } from "./_settings/footer-nav-items";
import { Container } from "@/shared/components/custom/app-container";

export function AppFooter() {
  return (
    <Container>
      <Layout
        logo={<Logo className="h-6 w-6" />}
        footerNav={<FooterNav items={FooterNavItems} />}
      />
    </Container>
  );
}
