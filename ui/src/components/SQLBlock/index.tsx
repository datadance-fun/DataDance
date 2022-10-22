import { ReactNode } from "react";
import { EditorBlockTool } from "../Editor/types";
import { Filter, FilterFormValues } from "../Filter";
import { BlockToolConstructorOptions, BlockToolData } from "@editorjs/editorjs";

export class SQLBlock extends EditorBlockTool {
  private options: BlockToolConstructorOptions;
  private data: BlockToolData<FilterFormValues>;

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
    </svg>
    `,
      title: "Visualization",
    };
  }

  constructor(options: BlockToolConstructorOptions) {
    super();
    this.options = options;
    this.data = options.data;
  }

  protected doRender(): ReactNode {
    return (
      <Filter
        api={this.options.api}
        data={this.data}
        onChange={(value) => (this.data = value)}
        thisBlock={this.options.block!}
      />
    );
  }

  save(block: HTMLElement) {
    return {
      ...this.data,
    };
  }

  validate() {
    return true;
  }
}
