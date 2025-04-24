import { transliterateToUrl } from "@/shared/lib/transliterate";
import cuid from "cuid";
import { CollectionConfig } from "payload";

export const Chapters: CollectionConfig = {
  slug: "chapters",
  labels: {
    singular: "Глава",
    plural: "Главы",
  },
  dbName: "chapters",
  disableDuplicate: true,
  admin: {
    useAsTitle: "novell",
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data === undefined || !data.id) {
              return cuid();
            }
            return data.id;
          },
        ],
      },
    },
    {
      name: "novell",
      type: "relationship",
      label: "Новелла",
      relationTo: "novells",
      hasMany: false,
      required: true,
    },
    {
      name: "number",
      type: "number",
      label: "Номер главы",
      required: true,
      unique: true,
    },
    {
      name: "title",
      type: "text",
      label: "Название главы",
      required: false,
    },
    {
      name: "content",
      type: "richText",
      label: "Контент",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Слаг для URL",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data !== undefined) {
              return transliterateToUrl(`${data.novell}_${data.number}`);
            }
          },
        ],
      },
    },
  ],
};
