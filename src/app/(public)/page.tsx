import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <Link href="/tags">
      <Button>tags</Button>
    </Link>
  );
}
