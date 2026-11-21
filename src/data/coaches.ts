import type { Coach } from "../types/coach";

export const coaches: Coach[] = [
  {
    id: "fernando-diniz",
    name: "Fernando Diniz",
    stints: [
      { club: "Vasco", endDate: "2026-02-22" },
      { club: "Corinthians", startDate: "2026-04-05", endDate: "2026-10-07" },
    ],
  },
  {
    id: "renato-gaucho",
    name: "Renato Gaúcho",
    stints: [
      { club: "Vasco", startDate: "2026-03-03", endDate: "2026-06-18" },
      { club: "Grêmio", startDate: "2026-09-14" },
    ],
  },
  {
    id: "pedro-emanuel",
    name: "Pedro Emanuel",
    stints: [{ club: "Vasco", startDate: "2026-07-10" }],
  },
  {
    id: "abel-ferreira",
    name: "Abel Ferreira",
    stints: [{ club: "Palmeiras" }],
  },
  {
    id: "rogerio-ceni",
    name: "Rogério Ceni",
    stints: [{ club: "Bahia" }],
  },
  {
    id: "odair-hellmann",
    name: "Odair Hellmann",
    stints: [{ club: "Athletico-PR" }],
  },
  {
    id: "rafael-guanaes",
    name: "Rafael Guanaes",
    stints: [{ club: "Mirassol" }],
  },
  {
    id: "vagner-mancini",
    name: "Vagner Mancini",
    stints: [{ club: "Bragantino" }],
  },
  {
    id: "leonardo-jardim",
    name: "Leonardo Jardim",
    stints: [{ club: "Flamengo", startDate: "2026-03-04" }],
  },
  {
    id: "filipe-luis",
    name: "Filipe Luís",
    stints: [{ club: "Flamengo", endDate: "2026-03-03" }],
  },
  {
    id: "artur-jorge",
    name: "Artur Jorge",
    stints: [{ club: "Cruzeiro", startDate: "2026-03-22" }],
  },
  {
    id: "tite",
    name: "Tite",
    stints: [
      { club: "Cruzeiro", endDate: "2026-03-15" },
      { club: "Botafogo", startDate: "2026-09-16" },
    ],
  },
  {
    id: "marcao",
    name: "Marcão",
    stints: [
      { club: "Fluminense", startDate: "2026-08-13", interim: true },
    ],
  },
  {
    id: "luis-zubeldia",
    name: "Luis Zubeldía",
    stints: [{ club: "Fluminense", endDate: "2026-08-13" }],
  },
  {
    id: "eduardo-dominguez",
    name: "Eduardo Domínguez",
    stints: [{ club: "Atlético-MG", startDate: "2026-02-25" }],
  },
  {
    id: "jorge-sampaoli",
    name: "Jorge Sampaoli",
    stints: [{ club: "Atlético-MG", endDate: "2026-02-12" }],
  },
  {
    id: "cuca",
    name: "Cuca",
    stints: [{ club: "Santos", startDate: "2026-03-19" }],
  },
  {
    id: "juan-pablo-vojvoda",
    name: "Juan Pablo Vojvoda",
    stints: [{ club: "Santos", endDate: "2026-03-19" }],
  },
  {
    id: "dorival-junior",
    name: "Dorival Júnior",
    stints: [
      { club: "Corinthians", endDate: "2026-04-05" },
      { club: "São Paulo", startDate: "2026-05-15" },
    ],
  },
  {
    id: "clarence-seedorf",
    name: "Clarence Seedorf",
    stints: [{ club: "Corinthians", startDate: "2026-10-11" }],
  },
  {
    id: "william-batista",
    name: "William Batista",
    stints: [
      { club: "Corinthians", startDate: "2026-10-07", endDate: "2026-10-11", interim: true },
    ],
  },
  {
    id: "hernan-crespo",
    name: "Hernán Crespo",
    stints: [{ club: "São Paulo", endDate: "2026-03-09" }],
  },
  {
    id: "roger-machado",
    name: "Roger Machado",
    stints: [{ club: "São Paulo", startDate: "2026-03-09", endDate: "2026-05-13" }],
  },
  {
    id: "luiz-castro",
    name: "Luís Castro",
    stints: [{ club: "Grêmio", endDate: "2026-09-13" }],
  },
  {
    id: "eduardo-baptista",
    name: "Eduardo Baptista",
    stints: [{ club: "Internacional", startDate: "2026-09-23" }],
  },
  {
    id: "paulo-pezzolano",
    name: "Paulo Pezzolano",
    stints: [{ club: "Internacional", endDate: "2026-09-20" }],
  },
  {
    id: "thiago-carpini",
    name: "Thiago Carpini",
    stints: [{ club: "Remo", startDate: "2026-09-16" }],
  },
  {
    id: "leo-conde",
    name: "Léo Condé",
    stints: [{ club: "Remo", startDate: "2026-03-05", endDate: "2026-09-15" }],
  },
  {
    id: "juan-carlos-osorio",
    name: "Juan Carlos Osorio",
    stints: [{ club: "Remo", endDate: "2026-03-01" }],
  },
  {
    id: "martin-anselmi",
    name: "Martín Anselmi",
    stints: [{ club: "Botafogo", endDate: "2026-03-22" }],
  },
  {
    id: "franclim-carvalho",
    name: "Franclim Carvalho",
    stints: [{ club: "Botafogo", startDate: "2026-03-22", endDate: "2026-08-18" }],
  },
  {
    id: "gilmar-dal-pozzo",
    name: "Gilmar Dal Pozzo",
    stints: [{ club: "Chapecoense", endDate: "2026-04-03" }],
  },
  {
    id: "fabio-matias",
    name: "Fábio Matias",
    stints: [{ club: "Chapecoense", startDate: "2026-04-03", endDate: "2026-05-25" }],
  },
  {
    id: "rafael-lacerda",
    name: "Rafael Lacerda",
    stints: [
      { club: "Chapecoense", startDate: "2026-05-25", endDate: "2026-11-09" },
      { club: "Vitória", startDate: "2026-11-10" },
    ],
  },
  {
    id: "rodrigo-chipp",
    name: "Rodrigo Chipp",
    stints: [{ club: "Chapecoense", startDate: "2026-11-09", interim: true }],
  },
  {
    id: "jair-ventura",
    name: "Jair Ventura",
    stints: [{ club: "Vitória", endDate: "2026-11-02" }],
  },
  {
    id: "cleber-dos-santos",
    name: "Cleber dos Santos",
    stints: [{ club: "Vitória", startDate: "2026-11-02", endDate: "2026-11-10", interim: true }],
  },
  {
    id: "fernando-seabra",
    name: "Fernando Seabra",
    stints: [{ club: "Coritiba", endDate: "2026-10-27" }],
  },
  {
    id: "guilherme-bossle",
    name: "Guilherme Bossle",
    stints: [{ club: "Coritiba", startDate: "2026-10-27", interim: true }],
  },
  {
  id: "bruno-lazaroni",
  name: "Bruno Lazaroni",
  stints: [{ club: "Vasco", startDate: "2026-02-22", endDate: "2026-03-03", interim: true }],
},
{
  id: "lucas-goncalves",
  name: "Lucas Gonçalves",
  stints: [{ club: "Atlético-MG", startDate: "2026-02-12", endDate: "2026-02-25", interim: true }],
},
{
  id: "flavio-garcia",
  name: "Flávio Garcia",
  stints: [{ club: "Remo", startDate: "2026-03-01", endDate: "2026-03-05", interim: true }],
},
{
  id: "rodrigo-bellao",
  name: "Rodrigo Bellão",
  stints: [
    { club: "Botafogo", startDate: "2026-08-18", endDate: "2026-09-16", interim: true }],
},
];