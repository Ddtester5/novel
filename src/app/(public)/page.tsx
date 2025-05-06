import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <Link href="/tags_and_genres">
      <Button>tags</Button>
    </Link>
  );
}
