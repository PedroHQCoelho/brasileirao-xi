import {
  SiGithub,
  SiInstagram,
  SiX,
  SiFacebook,
} from "@icons-pack/react-simple-icons";
import { FaLinkedin, FaItchIo } from "react-icons/fa6";
import { Globe } from "lucide-react";

const socialLinks = [
    {
    icon: Globe,
    href: "https://pedrohqcoelho.netlify.app",
    label: "Portfólio",
    },
    {
    icon: SiGithub,
    href: "https://github.com/PedroHQCoelho",
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/in/pedrohqcoelho",
    label: "LinkedIn",
  },
  {
    icon: SiInstagram,
    href: "https://instagram.com/pedro.hq.coelho",
    label: "Instagram",
  },
  {
    icon: SiX,
    href: "https://x.com/pedrohqcoelho",
    label: "X",
  },
  {
    icon: FaItchIo,
    href: "https://pedrocoelho.itch.io",
    label: "itch.io",
  },
  {
    icon: SiFacebook,
    href: "https://facebook.com/pedrohqcoelho",
    label: "Facebook",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white transition-colors hover:text-emerald-400"
          >
            Pedro Coelho
          </a>

          <p className="mt-2 text-sm text-slate-400">
            © {currentYear} Pedro Coelho. Todos os direitos reservados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="rounded-full p-2 text-slate-400 transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}