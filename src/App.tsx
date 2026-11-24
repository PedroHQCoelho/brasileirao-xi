import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import type { Theme } from "./types/theme";

import { Home } from "./pages/Home";
import { CreateTeam } from "./pages/CreateTeam";
import { MyTeams } from "./pages/MyTeams";

function App() {
  // Recupera o tema salvo anteriormente ou utiliza o tema claro como padrão.
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("brasileirao-xi-theme");

    return savedTheme === "dark" ? "dark" : "light";
  });

  // Sincroniza o tema com o elemento HTML e salva a preferência do usuário.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("brasileirao-xi-theme", theme);
  }, [theme]);

  // Alterna entre os temas claro e escuro.
  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        {/* Navbar presente em todas as páginas */}
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        {/* Conteúdo principal das rotas */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Página de criação e montagem da escalação */}
            <Route path="/criar" element={<CreateTeam />} />

            <Route
              path="/minhas-selecoes"
              element={<MyTeams />}
            />
          </Routes>
        </main>

        {/* Footer presente em todas as páginas */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;