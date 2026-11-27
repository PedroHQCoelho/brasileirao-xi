import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Check,
  Copy,
  Download,
  LoaderCircle,
  Share2,
  X,
} from "lucide-react";

import { categories } from "../data/categories";
import { formations } from "../data/formations";
import { LineupShareCard } from "./LineupShareCard";

import type { Lineup } from "../types/lineup";

interface LineupSharePreviewProps {
  lineup: Lineup;
  onClose: () => void;
}

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;
const CARD_WIDTH = 540;
const CARD_HEIGHT = 675;

// Aguarda o carregamento e a decodificação de todas as imagens do cartão.
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll<HTMLImageElement>("img"));

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          const timeoutId = window.setTimeout(finish, 15000);

          function finish() {
            window.clearTimeout(timeoutId);
            image.removeEventListener("load", finish);
            image.removeEventListener("error", finish);
            resolve();
          }

          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
        });
      }

      if (image.complete && image.naturalWidth > 0 && image.decode) {
        try {
          await image.decode();
        } catch {
          // A validação de naturalWidth abaixo identifica imagens inutilizáveis.
        }
      }
    })
  );
}

function createFileName(name: string): string {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `brasileirao-xi-${normalizedName || "selecao"}.png`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "type" in error) {
    const eventType = String((error as { type?: unknown }).type ?? "erro");
    return `Falha ao carregar um recurso durante a exportação (${eventType}).`;
  }

  return "Não foi possível converter o cartão em PNG. Confira a conexão do proxy de imagens e tente novamente.";
}

// Gera e valida o mesmo arquivo usado tanto no download quanto no compartilhamento.
async function createPngFile(
  cardElement: HTMLDivElement,
  lineupName: string
): Promise<File> {
  await waitForImages(cardElement);

  const images = Array.from(
    cardElement.querySelectorAll<HTMLImageElement>("img")
  );

  const unavailableImages = images.filter(
    (image) => image.getAttribute("src") && image.naturalWidth === 0
  );

  if (unavailableImages.length > 0) {
    const imageNames = unavailableImages
      .map((image) => image.alt || "Imagem sem identificação")
      .filter((name, index, names) => names.indexOf(name) === index);

    const details = imageNames.slice(0, 5).join(", ");
    const remainingCount = imageNames.length - 5;
    const remainingText = remainingCount > 0 ? ` e mais ${remainingCount}` : "";

    throw new Error(
      `Não foi possível carregar ${unavailableImages.length} imagem(ns): ${details}${remainingText}. Verifique se o proxy /football-images está configurado.`
    );
  }

  // Impede que imagens externas não convertidas cheguem ao html-to-image.
  const externalImages = images.filter((image) => {
    const source = image.currentSrc || image.src;
    if (!source) return false;

    try {
      return new URL(source, window.location.href).origin !== window.location.origin;
    } catch {
      return true;
    }
  });

  if (externalImages.length > 0) {
    const names = externalImages
      .map((image) => image.alt || "Imagem externa")
      .slice(0, 4)
      .join(", ");

    throw new Error(
      `Ainda existem imagens hospedadas fora do projeto (${names}). Configure um proxy same-origin para esse domínio antes de exportar.`
    );
  }

  const dataUrl = await toPng(cardElement, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    canvasWidth: EXPORT_WIDTH,
    canvasHeight: EXPORT_HEIGHT,
    pixelRatio: 1,
    backgroundColor: "#071B16",
    cacheBust: false,
  });

  const exportedImage = document.createElement("img");
  exportedImage.src = dataUrl;
  await exportedImage.decode();

  if (
    exportedImage.naturalWidth !== EXPORT_WIDTH ||
    exportedImage.naturalHeight !== EXPORT_HEIGHT
  ) {
    throw new Error(
      `A imagem foi gerada com ${exportedImage.naturalWidth} × ${exportedImage.naturalHeight}px, em vez de 1080 × 1350px.`
    );
  }

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  if (blob.type !== "image/png" || blob.size === 0) {
    throw new Error("Não foi possível preparar o arquivo PNG para compartilhamento.");
  }

  return new File([blob], createFileName(lineupName), {
    type: "image/png",
  });
}

function downloadFile(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");

  downloadLink.href = objectUrl;
  downloadLink.download = file.name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Alternativa para navegadores sem Clipboard API disponível.
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Não foi possível copiar a legenda automaticamente.");
  }
}

function getPublicAppUrl(): string {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();

  // Ignora valores de exemplo que podem ter ficado no arquivo .env.
  const isPlaceholder = configuredUrl
    ? /(seu[-_ ]endere[cç]o|your[-_ ]?(public[-_ ]?)?url|example\.com)/i.test(
        configuredUrl
      )
    : false;

  if (!configuredUrl || isPlaceholder) {
    return window.location.origin;
  }

  try {
    const parsedUrl = new URL(configuredUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return window.location.origin;
    }

    return parsedUrl.origin;
  } catch {
    return window.location.origin;
  }
}

function isLocalUrl(address: string): boolean {
  try {
    const hostname = new URL(address).hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".local")
    ) {
      return true;
    }

    const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!ipv4) return false;

    const [, first, second] = ipv4.map(Number);
    return (
      first === 10 ||
      first === 127 ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    );
  } catch {
    return true;
  }
}

function canShareFile(file: File): boolean {
  try {
    return (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}



export function LineupSharePreview({
  lineup,
  onClose,
}: LineupSharePreviewProps) {
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [pngFile, setPngFile] = useState<File | null>(null);
  const [isPreparingFile, setIsPreparingFile] = useState(true);
  const [preparationError, setPreparationError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const publicAppUrl = getPublicAppUrl();
  const isLocalAddress = isLocalUrl(publicAppUrl);

  const caption = useMemo(() => {
    const categoryName =
      categories.find((category) => category.id === lineup.category)?.name ??
      "Minha seleção";
    const formationName =
      formations.find((formation) => formation.id === lineup.formation)?.name ??
      lineup.formation;

    const lines = [
      `⚽ Minha seleção: ${lineup.name}`,
      `🏆 ${categoryName} • Brasileirão Série A ${lineup.season}`,
      `📋 Formação: ${formationName}`,
    ];

    if (!isLocalAddress) {
      lines.push("", "Monte a sua também no Brasileirão XI:", publicAppUrl);
    }

    lines.push(
      "",
      "Desenvolvido por Pedro Coelho",
      "",
      `#BrasileirãoXI #Brasileirão${lineup.season} #FutebolBrasileiro`
    );

    return lines.join("\n");
  }, [lineup, publicAppUrl, isLocalAddress]);

  // Prepara o PNG ao abrir a prévia. Assim, o toque no botão de compartilhar
  // chama navigator.share diretamente, sem aguardar a geração da imagem.
  useEffect(() => {
    let isCurrent = true;

    async function prepareFile() {
      const cardElement = exportCardRef.current;
      if (!cardElement) return;

      setIsPreparingFile(true);
      setPreparationError(null);
      setPngFile(null);

      try {
        const file = await createPngFile(cardElement, lineup.name);
        if (isCurrent) setPngFile(file);
      } catch (error) {
        if (isCurrent) setPreparationError(getErrorMessage(error));
      } finally {
        if (isCurrent) setIsPreparingFile(false);
      }
    }

    void prepareFile();

    return () => {
      isCurrent = false;
    };
  }, [lineup.id, lineup.name]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleExportPng() {
    if (!pngFile) {
      setPreparationError(
        preparationError ?? "O cartão ainda está sendo preparado. Tente novamente em instantes."
      );
      return;
    }

    try {
      downloadFile(pngFile);
      setExportSuccess(true);
      setShareMessage(null);
      setShareError(null);
    } catch (error) {
      setPreparationError(getErrorMessage(error));
    }
  }

  async function handleCopyCaption() {
    setShareError(null);
    setShareMessage(null);
    setCopySuccess(false);

    try {
      await copyTextToClipboard(caption);
      setCopySuccess(true);
    } catch (error) {
      setShareError(getErrorMessage(error));
    }
  }

  async function handleShareCard() {
    if (!pngFile) {
      setShareError(
        preparationError ?? "O cartão ainda está sendo preparado. Tente novamente em instantes."
      );
      return;
    }

    setShareError(null);
    setShareMessage(null);
    setCopySuccess(false);

    const shareData: ShareData = {
      files: [pngFile],
      title: `${lineup.name} • Brasileirão XI`,
      text: caption,
    };

    const supportsFileSharing = canShareFile(pngFile);

    if (supportsFileSharing) {
      try {
        // A chamada ocorre diretamente no clique, preservando a ativação do usuário.
        await navigator.share(shareData);
        setShareMessage(
          "Menu de compartilhamento aberto. Escolha o aplicativo e o destinatário."
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Erro ao compartilhar cartão:", error);
        setShareError(
          "Não foi possível concluir o compartilhamento nativo. Você ainda pode baixar o PNG e copiar a legenda separadamente."
        );
      }

      return;
    }

    // Fallback: baixa o cartão e copia a legenda com o link para colar no app escolhido.
    try {
      downloadFile(pngFile);
      await copyTextToClipboard(caption);
      setShareMessage(
        "Seu navegador não compartilha arquivos diretamente. O PNG foi baixado e a legenda com o link foi copiada; agora é só anexar a imagem e colar o texto no aplicativo desejado."
      );
    } catch (error) {
      console.error("Fallback de compartilhamento:", error);
      setShareError(
        "O PNG foi baixado, mas não foi possível copiar a legenda. Use o botão Copiar legenda e link."
      );
    }
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar pré-visualização"
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Pré-visualização da seleção ${lineup.name}`}
        className="relative z-10 flex max-h-full w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:p-6"
      >
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-gray-950 dark:text-white">
              Pré-visualização do cartão
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Confira sua escalação e prepare o compartilhamento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={21} />
          </button>
        </header>

        <div className="mx-auto w-full max-w-135">
          <LineupShareCard lineup={lineup} />
        </div>

        <div className="mt-5 flex flex-col gap-3">

          {isPreparingFile && (
            <p className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <LoaderCircle size={16} className="animate-spin" />
              Preparando imagem para download e compartilhamento...
            </p>
          )}

          {preparationError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            >
              {preparationError}
            </div>
          )}

          <section className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {isLocalAddress ? "Legenda para publicação" : "Legenda e link da aplicação"}
              </h3>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-950/50"
              >
                {copySuccess ? <Check size={15} /> : <Copy size={15} />}
                {copySuccess ? "Copiada" : isLocalAddress ? "Copiar legenda" : "Copiar legenda e link"}
              </button>
            </div>
            <p className="whitespace-pre-line wrap-break-word text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {caption}
            </p>
            {isLocalAddress && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                O endereço público ainda não está configurado. O link será incluído automaticamente depois que o site estiver publicado ou quando VITE_PUBLIC_APP_URL receber o endereço real do Brasileirão XI.
              </p>
            )}
          </section>

          {shareError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            >
              {shareError}
            </div>
          )}

          {shareMessage && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200"
            >
              {shareMessage}
            </p>
          )}

          {exportSuccess && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200"
            >
              PNG exportado com sucesso!
            </p>
          )}

          <button
            type="button"
            onClick={handleShareCard}
            disabled={isPreparingFile || !pngFile}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-500"
          >
            {isPreparingFile ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Preparando compartilhamento...
              </>
            ) : (
              <>
                <Share2 size={19} />
                Compartilhar
              </>
            )}
          </button>


          <button
            type="button"
            onClick={handleExportPng}
            disabled={isPreparingFile || !pngFile}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-700 px-5 py-3 font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-wait disabled:opacity-60 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-950/40"
          >
            <Download size={19} />
            Download
          </button>
        </div>
      </section>

      {/* Cópia de tamanho fixo usada para gerar o PNG e o arquivo compartilhado. */}
      <div
        className="pointer-events-none fixed right-full top-0 w-135"
        aria-hidden="true"
      >
        <LineupShareCard ref={exportCardRef} lineup={lineup} />
      </div>
    </div>
  );
}
