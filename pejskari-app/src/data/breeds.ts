import type { Breed } from '@/types';

/**
 * Výběr nejčastějších plemen v ČR + univerzální volby "Kříženec" a "Nevím".
 * Hodnoty energy/trainability jsou orientační (1–5) a slouží k personalizaci plánu.
 */
export const BREEDS: Breed[] = [
  { id: 'mix', name: 'Kříženec', size: 'medium', energy: 3, trainability: 3, group: 'Bez průkazu', note: 'Každý kříženec je originál — plán přizpůsobíme podle věku a pokroku.' },
  { id: 'unknown', name: 'Nevím / zatím neurčeno', size: 'medium', energy: 3, trainability: 3, group: 'Neurčeno', note: 'Klidně doplníte později. Začneme univerzálním plánem.' },

  { id: 'labrador', name: 'Labradorský retrívr', size: 'large', energy: 4, trainability: 5, group: 'Retrívři', note: 'Přátelský, učenlivý, miluje aporty a jídlo — skvělý do výcviku.' },
  { id: 'golden', name: 'Zlatý retrívr', size: 'large', energy: 4, trainability: 5, group: 'Retrívři', note: 'Mírný a chytrý, ideální rodinný pes, rád spolupracuje.' },
  { id: 'german-shepherd', name: 'Německý ovčák', size: 'large', energy: 5, trainability: 5, group: 'Pastevecká plemena', note: 'Pracovitý a oddaný, potřebuje úkoly a důsledné vedení.' },
  { id: 'border-collie', name: 'Border kolie', size: 'medium', energy: 5, trainability: 5, group: 'Pastevecká plemena', note: 'Nejchytřejší pracant — vyžaduje hodně pohybu i hlavu zaměstnat.' },
  { id: 'aussie', name: 'Australský ovčák', size: 'medium', energy: 5, trainability: 5, group: 'Pastevecká plemena', note: 'Energický a bystrý, miluje psí sporty a triky.' },
  { id: 'jack-russell', name: 'Jack Russell teriér', size: 'small', energy: 5, trainability: 3, group: 'Teriéři', note: 'Malý balík energie, lovecký pud, potřebuje pevné hranice.' },
  { id: 'frenchie', name: 'Francouzský buldoček', size: 'small', energy: 2, trainability: 3, group: 'Společenská plemena', note: 'Klidný společník, pozor na zátěž v horku (krátká tlama).' },
  { id: 'dachshund', name: 'Jezevčík', size: 'small', energy: 3, trainability: 3, group: 'Honiči a barváři', note: 'Svéhlavý lovec, odměny a trpělivost dělají divy.' },
  { id: 'chihuahua', name: 'Čivava', size: 'toy', energy: 3, trainability: 3, group: 'Společenská plemena', note: 'Malá, ale sebevědomá — důležitá je socializace.' },
  { id: 'yorkshire', name: 'Yorkshirský teriér', size: 'toy', energy: 3, trainability: 3, group: 'Teriéři', note: 'Živý a odvážný společník, dbejte na čistotnost.' },
  { id: 'poodle', name: 'Pudl', size: 'medium', energy: 4, trainability: 5, group: 'Společenská plemena', note: 'Velmi chytrý, nelíná, výborně se učí triky.' },
  { id: 'beagle', name: 'Bígl', size: 'medium', energy: 4, trainability: 3, group: 'Honiči a barváři', note: 'Nos vede tělo — trénujte přivolání s vysokou odměnou.' },
  { id: 'bernese', name: 'Bernský salašnický pes', size: 'giant', energy: 3, trainability: 4, group: 'Pinčové a knírači, plemena molossoidní', note: 'Klidný obr, mírná povaha, rychlý růst — šetřete klouby.' },
  { id: 'cavalier', name: 'Kavalír King Charles', size: 'small', energy: 3, trainability: 4, group: 'Společenská plemena', note: 'Mazlivý a přizpůsobivý, snadno se zapojí do tréninku.' },
  { id: 'husky', name: 'Sibiřský husky', size: 'large', energy: 5, trainability: 3, group: 'Severská plemena', note: 'Vytrvalý a nezávislý, přivolání chce hodně práce.' },
  { id: 'rottweiler', name: 'Rotvajler', size: 'large', energy: 3, trainability: 4, group: 'Pinčové a knírači, plemena molossoidní', note: 'Sebevědomý strážce, potřebuje klidné a důsledné vedení.' },
  { id: 'shihtzu', name: 'Shih-tzu', size: 'small', energy: 2, trainability: 3, group: 'Společenská plemena', note: 'Pohodový společník do bytu, dbejte na péči o srst.' },
];

export const BREEDS_BY_ID: Record<string, Breed> = Object.fromEntries(
  BREEDS.map((b) => [b.id, b]),
);

export function getBreed(id: string | undefined): Breed | undefined {
  return id ? BREEDS_BY_ID[id] : undefined;
}
