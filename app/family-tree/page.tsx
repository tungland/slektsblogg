import { getGedcomPersons } from "@/lib/gedcom";
import FamilyTree from "@/components/FamilyTree";
import Link from "next/link";

export default function FamilyTreePage() {
  const persons = getGedcomPersons();

  return (
    <div>
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-stone-800 mb-2">Slektstre</h1>
          <p className="text-stone-500">Familien gjennom generasjoner</p>
        </div>
        <Link
          href="/keystatic"
          className="text-sm border border-warm-300 text-warm-700 px-4 py-2 rounded-lg hover:bg-warm-50 transition-colors"
        >
          Last opp GEDCOM-fil →
        </Link>
      </div>

      {persons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-warm-200">
          <div className="text-4xl mb-4">🌳</div>
          <p className="text-stone-600 font-serif text-lg mb-2">Ingen slektsdata lastet opp ennå.</p>
          <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
            Eksporter en GEDCOM-fil fra MyHeritage, Ancestry eller FamilySearch, og last den opp via Admin-panelet.
          </p>
          <div className="bg-warm-50 border border-warm-200 rounded-lg p-4 text-left max-w-sm mx-auto text-sm text-stone-600">
            <p className="font-semibold mb-2">Slik gjør du det i MyHeritage:</p>
            <ol className="list-decimal list-inside space-y-1 text-stone-500">
              <li>Gå til «Familienettsted» → «Mer»</li>
              <li>Velg «Eksporter slektstre»</li>
              <li>Last ned .ged-filen</li>
              <li>Last den opp via <Link href="/keystatic" className="text-warm-600 underline">Admin-panelet</Link></li>
            </ol>
          </div>
        </div>
      ) : (
        <FamilyTree persons={persons} />
      )}
    </div>
  );
}
