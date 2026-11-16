import { RUBRIQUES } from '../data/rubriques';
import { articlesPublies } from './format';

/** Rubriques ayant au moins un article publié : les autres n’apparaissent pas dans les menus. */
export async function rubriquesActives() {
  const articles = await articlesPublies();
  const utilisees = new Set(articles.map((a) => a.data.rubrique));
  return RUBRIQUES.filter((r) => utilisees.has(r.id));
}
