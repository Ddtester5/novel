import { getAllNovels } from "@/entities/novells/_actions/get_novell";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const novels = await getAllNovels();
  return (
    <>
      <Link href="/tags_and_genres">
        <Button>tags</Button>
      </Link>
      <div className="w-full h-full flex flex-wrap gap-6 p-6  shadow-lg">
        {novels.map((nov) => {
          return (
            <Card key={nov.id} className="max-w-[160px] relative p-0 m-0  ">
              <div className="relative    max-w-[160px] h-full  w-full ">
                <Image
                  src={nov.image_path || "/placeholder.png"}
                  alt="картинка карточки"
                  width={160}
                  height={213}
                  className="  object-fill rounded-md"
                  priority
                />
              </div>
              <div className="absolute top-1 left-1 ">{nov.ru_title}</div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
