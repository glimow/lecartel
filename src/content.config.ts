import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { RUBRIQUES } from './data/rubriques';

const rubriqueIds = RUBRIQUES.map((r) => r.id) as [string, ...string[]];

/** Une exposition ou un événement cité dans le cartel d’un article. */
const ligneCartel = z.object({
  titre: z.string(),
  lieu: z.string(),
  dates: z.string(),
  details: z.string().optional(),
});

/** Visuel : image optionnelle. Sans `src`, le site affiche un emplacement légendé. */
const visuel = (image: any) =>
  z.object({
    src: image().optional(),
    alt: z.string(),
    legende: z.string().optional(),
    credit: z.string().optional(),
  });

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      chapo: z.string(),
      rubrique: z.enum(rubriqueIds),
      sujet: z.string(),
      date: z.coerce.date(),
      auteur: z.string(),
      une: z.boolean().default(false),
      dossier: reference('dossiers').optional(),
      image: visuel(image).optional(),
      cartel: z.array(ligneCartel).default([]),
      tags: z.array(z.string()).default([]),
      brouillon: z.boolean().default(false),
    }),
});

const cartels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cartels' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      chapo: z.string(),
      date: z.coerce.date(),
      auteur: z.string(),
      artiste: z.string(),
      oeuvre: z.string(),
      technique: z.string(),
      details: z.array(z.string()).default([]),
      mention: z.string().optional(),
      image: visuel(image).optional(),
      brouillon: z.boolean().default(false),
    }),
});

const dossiers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dossiers' }),
  schema: z.object({
    titre: z.string(),
    intro: z.string(),
    date: z.coerce.date(),
    accueil: z.boolean().default(false),
    encadre: z
      .object({
        titre: z.string(),
        items: z.array(z.object({ date: z.string(), texte: z.string() })),
      })
      .optional(),
  }),
});

const agenda = defineCollection({
  loader: file('src/content/agenda.yaml'),
  schema: z.object({
    titre: z.string(),
    artiste: z.string().optional(),
    lieu: z.string(),
    debut: z.coerce.date(),
    fin: z.coerce.date(),
    lien: z.string().url().optional(),
  }),
});

export const collections = { articles, cartels, dossiers, agenda };
