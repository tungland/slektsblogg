"use client";

import { useState, useMemo } from "react";
import { TreePerson } from "@/lib/gedcom";

interface Props {
  persons: TreePerson[];
}

function PersonCard({
  person,
  selected,
  onClick,
}: {
  person: TreePerson;
  selected: boolean;
  onClick: () => void;
}) {
  const bgColor =
    person.gender === "male"
      ? "bg-blue-50 border-blue-200"
      : person.gender === "female"
      ? "bg-pink-50 border-pink-200"
      : "bg-warm-50 border-warm-200";

  const selectedRing = selected ? "ring-2 ring-warm-500" : "";

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${selectedRing} border rounded-lg p-3 text-left hover:shadow-md transition-all min-w-[140px] max-w-[180px]`}
    >
      <div className="font-serif font-semibold text-stone-800 text-sm leading-tight truncate">
        {person.name}
      </div>
      {person.birthDate && (
        <div className="text-xs text-stone-500 mt-1">
          * {person.birthDate}
        </div>
      )}
      {person.deathDate && (
        <div className="text-xs text-stone-500">† {person.deathDate}</div>
      )}
    </button>
  );
}

function PersonDetail({ person, onClose }: { person: TreePerson; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-warm-200 shadow-xl z-40 overflow-y-auto">
      <div className="p-6">
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 mb-4 text-sm flex items-center gap-1"
        >
          ✕ Lukk
        </button>
        <h2 className="font-serif text-2xl font-semibold text-stone-800 mb-1">
          {person.name}
        </h2>
        <p className="text-sm text-stone-400 mb-6 capitalize">
          {person.gender === "male" ? "Mann" : person.gender === "female" ? "Kvinne" : "Ukjent kjønn"}
        </p>

        {(person.birthDate || person.birthPlace) && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Fødsel</h3>
            {person.birthDate && <p className="text-stone-700 text-sm">{person.birthDate}</p>}
            {person.birthPlace && <p className="text-stone-500 text-sm">{person.birthPlace}</p>}
          </div>
        )}

        {(person.deathDate || person.deathPlace) && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Død</h3>
            {person.deathDate && <p className="text-stone-700 text-sm">{person.deathDate}</p>}
            {person.deathPlace && <p className="text-stone-500 text-sm">{person.deathPlace}</p>}
          </div>
        )}

        {person.spouses.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Ektefelle(r)</h3>
            <p className="text-stone-600 text-sm">{person.spouses.length} ektefelle(r) registrert</p>
          </div>
        )}

        {person.children.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Barn</h3>
            <p className="text-stone-600 text-sm">{person.children.length} barn registrert</p>
          </div>
        )}

        {person.parents.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Foreldre</h3>
            <p className="text-stone-600 text-sm">{person.parents.length} foreldre registrert</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FamilyTree({ persons }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TreePerson | null>(null);

  const personMap = useMemo(() => {
    const map = new Map<string, TreePerson>();
    for (const p of persons) map.set(p.id, p);
    return map;
  }, [persons]);

  const filtered = useMemo(() => {
    if (!search.trim()) return persons;
    const q = search.toLowerCase();
    return persons.filter((p) => p.name.toLowerCase().includes(q));
  }, [persons, search]);

  // Group by generation depth (simple BFS from roots)
  const generations = useMemo(() => {
    const roots = persons.filter((p) => p.parents.length === 0);
    const visited = new Map<string, number>();
    const queue: { id: string; gen: number }[] = roots.map((r) => ({ id: r.id, gen: 0 }));

    while (queue.length > 0) {
      const { id, gen } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.set(id, gen);
      const person = personMap.get(id);
      if (person) {
        for (const childId of person.children) {
          if (!visited.has(childId)) queue.push({ id: childId, gen: gen + 1 });
        }
      }
    }

    // Assign unvisited persons
    for (const p of persons) {
      if (!visited.has(p.id)) visited.set(p.id, 0);
    }

    const maxGen = Math.max(...Array.from(visited.values()));
    const gens: TreePerson[][] = Array.from({ length: maxGen + 1 }, () => []);
    for (const [id, gen] of visited) {
      const person = personMap.get(id);
      if (person) gens[gen].push(person);
    }
    return gens;
  }, [persons, personMap]);

  const displayPersons = search.trim() ? filtered : null;

  return (
    <div className="relative">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Søk etter navn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
        />
        <span className="ml-3 text-sm text-stone-400">{persons.length} personer</span>
      </div>

      {/* Tree or search results */}
      {displayPersons ? (
        <div>
          <p className="text-sm text-stone-500 mb-3">{displayPersons.length} treff</p>
          <div className="flex flex-wrap gap-3">
            {displayPersons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                selected={selected?.id === person.id}
                onClick={() => setSelected(selected?.id === person.id ? null : person)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {generations.map((gen, gi) => (
              <div key={gi} className="flex gap-4 mb-6 items-start">
                <div className="w-20 shrink-0 text-xs text-stone-400 font-medium pt-3 text-right pr-2 border-r border-warm-200">
                  Gen. {gi + 1}
                </div>
                <div className="flex flex-wrap gap-3">
                  {gen.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      selected={selected?.id === person.id}
                      onClick={() => setSelected(selected?.id === person.id ? null : person)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <PersonDetail person={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
