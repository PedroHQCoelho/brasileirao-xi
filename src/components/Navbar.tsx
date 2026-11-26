import { Link, NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import type { Theme } from "../types/theme";
import { CrestLogo } from "./CrestLogo";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  // Link ativo ganha um sublinhado grosso (como o marcador das transmissões).
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-[3px] py-1 text-sm font-semibold whitespace-nowrap transition-colors ${
      isActive
        ? "border-yellow-400 text-green-950 dark:text-white"
        : "border-transparent text-gray-500 hover:text-green-950 dark:text-gray-400 dark:hover:text-white"
    }`;

  return (
    <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Escudo e nome do projeto */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Brasileirão XI, página inicial">
          <CrestLogo size={38} />

          <span className="display hidden text-[26px] text-green-950 min-[400px]:inline dark:text-white">
            Brasileirão XI
          </span>
        </Link>

        {/* Links principais e controle de aparência */}
        <div className="flex items-center gap-4 sm:gap-7">
          <NavLink to="/" className={({ isActive }) => `${navLinkClass({ isActive })} hidden sm:inline-block`}>
            Início
          </NavLink>

          <NavLink to="/minhas-selecoes" className={navLinkClass}>
            Minhas seleções
          </NavLink>

          {/* Alterna entre o tema claro e o escuro */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            title={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:text-green-950 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
