import { formations } from "../data/formations";

interface FormationSelectorProps {
  selectedFormation: string;
  onFormationChange: (formation: string) => void;
}

export function FormationSelector({
  selectedFormation,
  onFormationChange,
}: FormationSelectorProps) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <label
        htmlFor="formation"
        className="mb-3 block text-sm font-bold text-green-950 dark:text-white"
      >
        Formação tática
      </label>

      {/* Permite escolher uma das formações disponíveis */}
      <select
        id="formation"
        value={selectedFormation}
        onChange={(event) => onFormationChange(event.target.value)}
        className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {formations.map((formation) => (
          <option key={formation.id} value={formation.id}>
            {formation.name}
          </option>
        ))}
      </select>
    </div>
  );
}