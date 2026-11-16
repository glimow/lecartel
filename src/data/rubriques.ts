export const RUBRIQUES = [
  { id: 'critiques', label: 'Critiques', singulier: 'Critique', description: 'Des expositions jugées, pas résumées.' },
  { id: 'essais', label: 'Essais', singulier: 'Essai', description: 'Prendre une actualité au sérieux, et la relire avec l’histoire, les lettres et la psychanalyse.' },
  { id: 'enquetes', label: 'Enquêtes', singulier: 'Enquête', description: 'Institutions, marché, pouvoir : ce que l’art contemporain ne montre pas.' },
  { id: 'design', label: 'Design', singulier: 'Design', description: 'Objets, mode, architecture et les musées qui les conservent.' },
  { id: 'histoire', label: 'Histoire', singulier: 'Histoire', description: 'Ce que le passé fait au présent de l’art.' },
  { id: 'psyche', label: 'Psyché', singulier: 'Psyché', description: 'L’art au divan, et le divan dans l’art.' },
] as const;

export type RubriqueId = (typeof RUBRIQUES)[number]['id'];

export function rubrique(id: string) {
  const r = RUBRIQUES.find((r) => r.id === id);
  if (!r) throw new Error(`Rubrique inconnue : ${id}`);
  return r;
}
