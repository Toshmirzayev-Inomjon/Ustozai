// Ustoz AI — kasb → fanlar bazasi (mobil ilova bilan bir xil).
import { colors } from "./theme";

export type Palette = { color: string; bg: string };

const PALETTE: Palette[] = [
  { color: colors.cobalt, bg: colors.cobalt50 },
  { color: colors.saffron, bg: colors.saffron50 },
  { color: colors.teal, bg: colors.teal50 },
  { color: colors.clay, bg: colors.clay50 },
];

export const paletteFor = (i: number): Palette => PALETTE[i % PALETTE.length];

export const PROFESSION_SUBJECTS: Record<string, string[]> = {
  Hamshira: ["Biologiya", "Kimyo", "Anatomiya", "Tibbiyot asoslari"],
  Shifokor: ["Biologiya", "Kimyo", "Fizika", "Anatomiya"],
  Farmatsevt: ["Kimyo", "Biologiya", "Farmakologiya", "Botanika"],
  Dasturchi: ["Matematika", "Informatika", "Ingliz tili", "Mantiq"],
  "IT muhandisi": ["Matematika", "Informatika", "Fizika", "Ingliz tili"],
  Iqtisodchi: ["Matematika", "Iqtisod", "Ingliz tili", "Statistika"],
  Bankir: ["Matematika", "Iqtisod", "Buxgalteriya", "Ingliz tili"],
  Muhandis: ["Matematika", "Fizika", "Chizmachilik", "Informatika"],
  Arxitektor: ["Matematika", "Chizmachilik", "Fizika", "Tarix"],
  Huquqshunos: ["Tarix", "Huquq asoslari", "Ona tili", "Ingliz tili"],
  "O‘qituvchi": ["Pedagogika", "Psixologiya", "Ona tili", "Tarix"],
  Psixolog: ["Psixologiya", "Biologiya", "Ona tili", "Falsafa"],
  Tarjimon: ["Ingliz tili", "Ona tili", "Adabiyot", "Tarix"],
  Jurnalist: ["Ona tili", "Adabiyot", "Tarix", "Ingliz tili"],
  Tadbirkor: ["Iqtisod", "Matematika", "Marketing", "Ingliz tili"],
  Veterinar: ["Biologiya", "Kimyo", "Anatomiya", "Zoologiya"],
  Agronom: ["Biologiya", "Kimyo", "Botanika", "Geografiya"],
  Diplomat: ["Tarix", "Ingliz tili", "Geografiya", "Huquq asoslari"],
};

export const PROFESSION_LIST = Object.keys(PROFESSION_SUBJECTS);

export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg‘ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog‘iston",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
];

export function knownSubjectsFor(profession: string): string[] | null {
  const key = PROFESSION_LIST.find(
    (p) => p.toLowerCase() === profession.trim().toLowerCase(),
  );
  return key ? PROFESSION_SUBJECTS[key] : null;
}
