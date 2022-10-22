import React from "react";
import { createRoot, Root } from "react-dom/client";
import type { BlockTool } from "@editorjs/editorjs";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const emotionCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

export class EditorBlockTool implements BlockTool {
  readonly container: HTMLElement;
  readonly root: Root;

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - tool constricting options
   * @param {CodeData} options.data — previously saved plugin code
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   */
  constructor() {
    this.container = document.createElement("div");
    this.root = createRoot(this.container);
  }

  render(): HTMLElement {
    this.renderContainer();
    return this.container;
  }

  save(block: HTMLElement) {}

  renderContainer() {
    this.root.render(
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={emotionCache}
        theme={{ defaultRadius: "sm" }}
      >
        <QueryClientProvider client={queryClient}>
          <div>{this.doRender()}</div>
        </QueryClientProvider>
      </MantineProvider>
    );
  }

  protected doRender(): React.ReactNode {
    return undefined;
  }
}
