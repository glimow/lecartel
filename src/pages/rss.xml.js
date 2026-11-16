import rss from '@astrojs/rss';
import { articlesPublies } from '../lib/format';
import { SITE } from '../data/site';

export async function GET(context) {
  const articles = await articlesPublies();
  return rss({
    title: SITE.nom,
    description: SITE.description,
    site: context.site,
    customData: '<language>fr-FR</language>',
    items: articles.map((a) => ({
      title: a.data.titre,
      description: a.data.chapo,
      pubDate: a.data.date,
      author: a.data.auteur,
      categories: [a.data.rubrique, ...a.data.tags],
      link: `/articles/${a.id}/`,
    })),
  });
}
