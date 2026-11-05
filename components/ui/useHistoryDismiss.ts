"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Integração entre overlays (modal, drawer) e o botão "voltar" do navegador.
 *
 * Comportamento:
 * - Ao abrir, o overlay empilha uma entrada no histórico (flag `__bpmnOverlay`).
 * - Fechar de forma explícita (X, Esc, backdrop) remove a entrada com
 *   `history.back()`, então o histórico não cresce a cada abertura.
 * - Pressionar "voltar" com o overlay aberto fecha o overlay em vez de
 *   navegar para a página anterior.
 * - Se a navegação acontecer com o overlay aberto, a entrada fica órfã e é
 *   pulada automaticamente na primeira volta (quando a Navigation API está
 *   disponível), evitando um "voltar" morto.
 */

const FLAG = "__bpmnOverlay";

/** Fechamentos dos overlays abertos, do mais recente ao mais antigo. */
const openStack: Array<() => void> = [];
/**
 * Entradas órfãs estradas por navegação feita com o overlay aberto.
 * Cada órfã é pulada na primeira volta sobre ela (ver popstate abaixo).
 */
let strandedOrphans = 0;
let globalHandlerInstalled = false;

function hasOverlayFlag(state: unknown): boolean {
  return (
    !!state &&
    typeof state === "object" &&
    (state as Record<string, unknown>)[FLAG] === true
  );
}

function installGlobalHandler() {
  if (globalHandlerInstalled || typeof window === "undefined") return;
  globalHandlerInstalled = true;

  window.addEventListener("popstate", () => {
    const top = openStack[openStack.length - 1];
    if (top) {
      // Voltar com overlay aberto (ou um fechamento explícito removendo a
      // entrada): fecha apenas o overlay do topo — o histórico já avançou.
      top();
      return;
    }

    // Nenhum overlay aberto: se a entrada atual é uma órfã registrada,
    // pula para a página de origem (mesma URL), evitando um "voltar" morto.
    // O contador garante que só entradas efetivamente estradas são puladas
    // — sem ele, o avançar do histórico entraria em loop.
    if (strandedOrphans > 0 && hasOverlayFlag(window.history.state)) {
      strandedOrphans -= 1;
      window.history.back();
    }
  });
}

/**
 * Gerencia o histórico do navegador de um overlay.
 *
 * @param open  se o overlay está aberto
 * @param onClose chamado para fechar o overlay
 * @returns `requestClose` — use em vez de `onClose` nos controles de
 *          fechamento (X, Esc, backdrop) para também limpar o histórico.
 */
export function useHistoryDismiss(
  open: boolean,
  onClose: () => void
): () => void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const closingRef = useRef(false);
  const pushedRef = useRef(false);
  const closeFromPopRef = useRef<(() => void) | null>(null);
  const orphanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!closeFromPopRef.current) {
    closeFromPopRef.current = () => {
      if (closingRef.current) return;
      closingRef.current = true;
      pushedRef.current = false; // o navegador já removeu a entrada
      onCloseRef.current();
    };
  }

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (pushedRef.current && hasOverlayFlag(window.history.state)) {
      pushedRef.current = false;
      window.history.back(); // remove a entrada; o popstate fecha por nós
    }
    onCloseRef.current();
  }, []);

  useEffect(() => {
    installGlobalHandler();
    if (!open) return;

    closingRef.current = false;
    if (orphanTimerRef.current !== null) {
      clearTimeout(orphanTimerRef.current);
      orphanTimerRef.current = null;
    }

    if (!pushedRef.current) {
      const state = window.history.state;
      window.history.pushState(
        { ...(state && typeof state === "object" ? state : {}), [FLAG]: true },
        ""
      );
      pushedRef.current = true;
    }

    const closeFromPop = closeFromPopRef.current!;
    openStack.push(closeFromPop);

    return () => {
      const index = openStack.indexOf(closeFromPop);
      if (index >= 0) openStack.splice(index, 1);

      // Fechado de fora (propriedade `open`) ou desmontado: remove a
      // entrada órfã no próximo tick — um re-mount imediato (StrictMode,
      // reabertura rápida) pode cancelar a remoção.
      orphanTimerRef.current = setTimeout(() => {
        orphanTimerRef.current = null;
        if (closingRef.current || !pushedRef.current) return;
        pushedRef.current = false;
        if (hasOverlayFlag(window.history.state)) {
          window.history.back();
        } else {
          // Navegou com o overlay aberto: a entrada ficou para trás.
          strandedOrphans += 1;
        }
      }, 0);
    };
  }, [open]);

  return requestClose;
}
