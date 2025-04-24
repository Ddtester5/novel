import { transliterateToUrl } from "@/shared/lib/transliterate";
import cuid from "cuid";
import { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  labels: {
    singular: "Тэг",
    plural: "Тэги",
  },
  dbName: "tags",
  disableDuplicate: true,
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
      name: "title",
      type: "text",
      label: "Название",
      required: true,
      unique: true,
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
              return transliterateToUrl(data.title);
            }
          },
        ],
      },
    },
  ],
};
