import fs from "fs";
import path from "path";

export interface TreePerson {
  id: string;
  name: string;
  gender: "male" | "female" | "unknown";
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  parents: string[];
  children: string[];
  spouses: string[];
}

const gedcomPath = path.join(process.cwd(), "content/family/family.ged");

export function getGedcomPersons(): TreePerson[] {
  if (!fs.existsSync(gedcomPath)) {
    return [];
  }

  const raw = fs.readFileSync(gedcomPath, "utf8");
  return parseGedcom(raw);
}

function parseGedcom(raw: string): TreePerson[] {
  const lines = raw.split(/\r?\n/);

  // Parse all records
  const individuals = new Map<string, Record<string, string>>();
  const families = new Map<string, { husb?: string; wife?: string; chil: string[] }>();

  let currentType = "";
  let currentId = "";
  let currentTag = "";

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(@\S+@|\S+)\s*(.*)?$/);
    if (!match) continue;

    const level = parseInt(match[1]);
    const tag = match[2];
    const value = (match[3] ?? "").trim();

    if (level === 0) {
      if (tag.startsWith("@") && value === "INDI") {
        currentType = "INDI";
        currentId = tag.replace(/@/g, "");
        individuals.set(currentId, { id: currentId });
      } else if (tag.startsWith("@") && value === "FAM") {
        currentType = "FAM";
        currentId = tag.replace(/@/g, "");
        families.set(currentId, { chil: [] });
      } else {
        currentType = "";
        currentId = "";
      }
      currentTag = "";
      continue;
    }

    if (!currentId) continue;

    if (currentType === "INDI") {
      const indi = individuals.get(currentId)!;
      if (level === 1) {
        currentTag = tag;
        if (tag === "SEX") indi.sex = value;
        if (tag === "NAME") indi.name = value.replace(/\//g, "").trim();
        if (tag === "FAMS") indi.fams = (indi.fams ? indi.fams + "," : "") + value.replace(/@/g, "");
        if (tag === "FAMC") indi.famc = value.replace(/@/g, "");
      } else if (level === 2) {
        if (currentTag === "BIRT") {
          if (tag === "DATE") indi.birthDate = value;
          if (tag === "PLAC") indi.birthPlace = value;
        }
        if (currentTag === "DEAT") {
          if (tag === "DATE") indi.deathDate = value;
          if (tag === "PLAC") indi.deathPlace = value;
        }
      }
    }

    if (currentType === "FAM") {
      const fam = families.get(currentId)!;
      if (level === 1) {
        if (tag === "HUSB") fam.husb = value.replace(/@/g, "");
        if (tag === "WIFE") fam.wife = value.replace(/@/g, "");
        if (tag === "CHIL") fam.chil.push(value.replace(/@/g, ""));
      }
    }
  }

  // Build persons with resolved relationships
  const persons: TreePerson[] = [];

  for (const [id, indi] of individuals) {
    const spouseIds = new Set<string>();
    const childIds = new Set<string>();

    // Find families where this person is a spouse
    const famIds = indi.fams ? indi.fams.split(",") : [];
    for (const famId of famIds) {
      const fam = families.get(famId.trim());
      if (!fam) continue;
      if (fam.husb && fam.husb !== id) spouseIds.add(fam.husb);
      if (fam.wife && fam.wife !== id) spouseIds.add(fam.wife);
      for (const child of fam.chil) childIds.add(child);
    }

    // Find parents from family of child
    const parentIds: string[] = [];
    if (indi.famc) {
      const fam = families.get(indi.famc.trim());
      if (fam) {
        if (fam.husb) parentIds.push(fam.husb);
        if (fam.wife) parentIds.push(fam.wife);
      }
    }

    let gender: "male" | "female" | "unknown" = "unknown";
    if (indi.sex === "M") gender = "male";
    else if (indi.sex === "F") gender = "female";

    persons.push({
      id,
      name: indi.name ?? "Ukjent",
      gender,
      birthDate: indi.birthDate,
      birthPlace: indi.birthPlace,
      deathDate: indi.deathDate,
      deathPlace: indi.deathPlace,
      parents: parentIds,
      children: Array.from(childIds),
      spouses: Array.from(spouseIds),
    });
  }

  return persons;
}
