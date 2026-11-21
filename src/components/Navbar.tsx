import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Trophy } from "lucide-react";
import type { Theme } from "../types/theme";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  // Define as classes dos links de acordo com a página e o tema atual.
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive
        ? "text-green-700 dark:text-green-400"
        : "text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-400"
    }`;

  return (
    <header className="border-b border-green-100 bg-white transition-colors dark:border-green-900 dark:bg-gray-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo e identidade visual do projeto */}
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-green-700 p-2 text-white">
            <Trophy size={22} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-green-950 dark:text-white">
            Brasileirão <span className="text-green-600 dark:text-green-400">XI</span>
          </span>
        </Link>

        {/* Links principais e controle de aparência */}
        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" className={navLinkClass}>
            Início
          </NavLink>

          <NavLink to="/minhas-selecoes" className={navLinkClass}>
            Minhas seleções
          </NavLink>

          {/* Alterna entre o tema claro e o escuro */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === "light"
                ? "Ativar tema escuro"
                : "Ativar tema claro"
            }
            title={
              theme === "light"
                ? "Ativar tema escuro"
                : "Ativar tema claro"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-800 transition hover:bg-green-100 dark:border-gray-700 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700"
          >
            {theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}