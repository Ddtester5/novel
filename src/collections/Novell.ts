import { transliterateToUrl } from "@/shared/lib/transliterate";
import cuid from "cuid";
import { CollectionConfig } from "payload";

export const Novells: CollectionConfig = {
  slug: "novells",
  labels: {
    singular: "Новелла",
    plural: "Новеллы",
  },
  dbName: "novells",
  disableDuplicate: true,
  admin: {
    useAsTitle: "ru_title",
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Слаг для URL",
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data !== undefined) {
              return transliterateToUrl(data.ru_title);
            }
          },
        ],
      },
    },
    {
      name: "original_title",
      type: "text",
      required: false,
      label: "Оригинальное название",
    },
    {
      name: "original_author",
      type: "text",
      required: false,
      label: "Оригинальный автор",
    },
    {
      name: "original_description",
      type: "textarea",
      required: false,
      label: "Оригинальное описание",
    },
    {
      name: "original_link",
      type: "text",
      required: false,
      label: "Ссылка на оригинал",
    },
    {
      name: "ru_title",
      type: "text",
      required: true,
      label: "Название новеллы",
    },
    {
      name: "ru_description",
      type: "textarea",
      required: true,
      label: "Описание новеллы",
    },
    {
      name: "tags",
      type: "relationship",
      label: "Тэги",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "chapters",
      type: "relationship",
      label: "Главы",
      relationTo: "chapters",
      hasMany: true,
    },
    {
      name: "status",
      type: "select",
      label: "Статус",
      options: [
        { label: "В процессе", value: "draft" },
        { label: "Завершена", value: "completed" },
        { label: "Заморожена", value: "hiatus" },
      ],
      defaultValue: "draft",
    },
  ],
};
