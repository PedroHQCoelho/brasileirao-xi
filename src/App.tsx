import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import type { Theme } from "./types/theme";
import { CreateTeam } from "./pages/CreateTeam";

// Define os dois temas disponíveis na aplicação.

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
      {/* A navbar recebe o tema atual e a função responsável pela alternância. */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rotas provisórias que serão desenvolvidas posteriormente. */}
        {/* Página de criação e montagem da escalação */}
        <Route path="/criar" element={<CreateTeam />} />

        <Route
          path="/minhas-selecoes"
          element={
            <div className="p-10 text-center text-gray-800 dark:text-gray-100">
              Suas seleções aparecerão aqui.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;