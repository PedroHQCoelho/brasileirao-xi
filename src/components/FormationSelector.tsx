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
    <div className="p-5">
      <label
        htmlFor="formation"
        className="display mb-3 block text-2xl text-green-950 dark:text-white"
      >
        Formação tática
      </label>

      {/* Permite escolher uma das formações disponíveis */}
      <select
        id="formation"
        value={selectedFormation}
        onChange={(event) => onFormationChange(event.target.value)}
        className="tabular w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 font-bold text-green-950 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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