import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

export type ColorScheme = {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
};

export function buildColorScheme(colors: ColorScheme): Extension {
  return syntaxHighlighting(
    HighlightStyle.define([
      {
        tag: t.comment,
        color: colors.base03,
      },
      {
        tag: [
          t.variableName,
          t.typeName,
          t.tagName,
          t.className,
          t.labelName,
          t.namespace,
          t.macroName,
        ],
        color: colors.base08,
      },
      {
        tag: t.string,
        color: colors.base0B,
      },
      {
        tag: [t.regexp, t.escape, t.quote],
        color: colors.base0C,
      },
      {
        tag: [t.number, t.bool, t.url],
        color: colors.base09,
      },
      {
        tag: t.keyword,
        color: colors.base0E,
      },
      {
        tag: t.operator,
        color: colors.base05,
      },
      {
        tag: t.function(t.variableName),
        color: colors.base0D,
      },
      {
        tag: t.heading,
        color: colors.base0D,
        fontWeight: "bold",
      },
      {
        tag: t.link,
        color: colors.base09,
        textDecoration: "underline",
        textUnderlinePosition: "under",
      },
    ])
  );
}
