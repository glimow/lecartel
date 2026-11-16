import { getCollection, type CollectionEntry } from 'astro:content';

const longFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
const jourFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export const dateLongue = (d: Date) => longFmt.format(d);
export const dateDuJour = (d: Date) => {
  const s = jourFmt.format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};
/** 18.01.27 */
export const dateCourte = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${String(d.getUTCFullYear()).slice(2)}`;
};

export function tempsDeLecture(body = '') {
  const mots = body.replace(/[#>*_\[\]()!`|-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 230));
}

const estPublie = (e: { data: { brouillon?: boolean } }) => import.meta.env.DEV || !e.data.brouillon;

export async function articlesPublies() {
  const all = await getCollection('articles', estPublie);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function cartelsPublies() {
  const all = await getCollection('cartels', estPublie);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Événements de l’agenda non terminés à la date de construction du site, triés par date de fin. */
export async function agendaEnCours(maintenant = new Date()) {
  const debutJour = new Date(maintenant);
  debutJour.setUTCHours(0, 0, 0, 0);
  const all = await getCollection('agenda');
  return all
    .filter((e) => e.data.fin >= debutJour)
    .sort((a, b) => a.data.fin.valueOf() - b.data.fin.valueOf());
}

/** « 20–22.11.26 » pour un événement court, « → 18.01.27 » si déjà commencé. */
export function datesAgenda(e: CollectionEntry<'agenda'>, maintenant = new Date()) {
  const { debut, fin } = e.data;
  if (debut > maintenant) {
    const memeMois = debut.getUTCMonth() === fin.getUTCMonth() && debut.getUTCFullYear() === fin.getUTCFullYear();
    return memeMois ? `${String(debut.getUTCDate()).padStart(2, '0')}–${dateCourte(fin)}` : `${dateCourte(debut)} → ${dateCourte(fin)}`;
  }
  return `→ ${dateCourte(fin)}`;
}
