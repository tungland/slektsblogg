import { config, collection, fields, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "Slektsblogg Admin",
    },
  },
  collections: {
    posts: collection({
      label: "Blogginnlegg",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: { label: "Tittel", validation: { isRequired: true } },
        }),
        date: fields.date({
          label: "Dato",
          defaultValue: { kind: "today" },
        }),
        author: fields.text({
          label: "Forfatter",
        }),
        excerpt: fields.text({
          label: "Utdrag",
          multiline: true,
        }),
        coverImage: fields.text({
          label: "Forsidebilde (URL eller sti til /photos/...)",
        }),
        content: fields.mdx({
          label: "Innhold",
          components: {},
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: "Nettstedsinnstillinger",
      path: "content/settings",
      schema: {
        siteTitle: fields.text({
          label: "Nettstedstittel",
          defaultValue: "Slektsblogg",
        }),
        siteDescription: fields.text({
          label: "Beskrivelse",
          defaultValue: "Familiehistorier, bilder og slektstre",
          multiline: true,
        }),
        heroText: fields.text({
          label: "Velkomsttekst på forsiden",
          multiline: true,
        }),
      },
    }),
    gedcomUpload: singleton({
      label: "Slektsfil (GEDCOM)",
      path: "content/gedcom-info",
      schema: {
        note: fields.text({
          label: "Om GEDCOM-opplasting",
          defaultValue:
            "Last opp GEDCOM-filen din (.ged) manuelt til content/family/family.ged. Dette kan gjøres via filbehandleren eller terminal.",
          multiline: true,
        }),
        lastUpdated: fields.date({
          label: "Sist oppdatert",
        }),
      },
    }),
  },
});
