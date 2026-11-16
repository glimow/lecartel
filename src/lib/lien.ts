/**
 * Préfixe un chemin interne avec la base du site (vide sur lecartel.art,
 * « /lecartel » pour l’aperçu GitHub Pages). Toujours l’utiliser pour les liens internes.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const lien = (chemin: string) => `${base}${chemin}`;
