import { createElement, type ReactNode } from "react";

export interface NewsTextFormat {
  start: number;
  end: number;
  type: "bold" | "italic" | "underline" | "font-size";
  fontSize?: number;
}

const FORMAT_TAG_PATTERN =
  /(<\/?(?:strong|em|u)>|<span data-font-size="(?:12|14|16|18|24)">|<\/span>)/g;

export function parseNewsText(text: string): {
  text: string;
  formats: NewsTextFormat[];
} {
  const formats: NewsTextFormat[] = [];
  const openFormats: Array<{
    type: NewsTextFormat["type"];
    start: number;
    fontSize?: number;
  }> = [];
  let plainText = "";
  let sourceIndex = 0;
  let match: RegExpExecArray | null;
  const tags = new RegExp(FORMAT_TAG_PATTERN.source, "g");

  while ((match = tags.exec(text)) !== null) {
    plainText += text.slice(sourceIndex, match.index);
    const tag = match[0];
    const fontSize = tag.match(/^<span data-font-size="(12|14|16|18|24)">$/)?.[1];
    const openingType =
      tag === "<strong>"
        ? "bold"
        : tag === "<em>"
          ? "italic"
          : tag === "<u>"
            ? "underline"
            : fontSize
              ? "font-size"
              : null;

    if (openingType) {
      openFormats.push({
        type: openingType,
        start: plainText.length,
        ...(fontSize ? { fontSize: Number(fontSize) } : {}),
      });
    } else {
      const closingType =
        tag === "</strong>"
          ? "bold"
          : tag === "</em>"
            ? "italic"
            : tag === "</u>"
              ? "underline"
              : "font-size";
      const openIndex = openFormats.length - 1;
      const openFormat = openFormats[openIndex];
      if (openFormat?.type === closingType) {
        openFormats.pop();
        if (plainText.length > openFormat.start) {
          formats.push({
            ...openFormat,
            end: plainText.length,
          });
        }
      } else {
        plainText += tag;
      }
    }

    sourceIndex = tags.lastIndex;
  }

  plainText += text.slice(sourceIndex);
  return { text: plainText, formats };
}

export function serializeNewsText(
  text: string,
  formats: NewsTextFormat[] = [],
): string {
  const validFormats = formats.filter(
    (format) =>
      Number.isInteger(format.start) &&
      Number.isInteger(format.end) &&
      format.start >= 0 &&
      format.end <= text.length &&
      format.end > format.start,
  );
  const boundaries = [
    ...new Set([
      0,
      text.length,
      ...validFormats.flatMap((format) => [format.start, format.end]),
    ]),
  ].sort((a, b) => a - b);

  return boundaries.slice(0, -1).reduce((serialized, start, index) => {
    const end = boundaries[index + 1];
    const activeFormats = validFormats.filter(
      (format) => format.start <= start && format.end >= end,
    );
    const formatOrder: NewsTextFormat["type"][] = [
      "bold",
      "italic",
      "underline",
      "font-size",
    ];
    let segment = text.slice(start, end);

    for (const type of formatOrder) {
      const format = activeFormats
        .filter((active) => active.type === type)
        .pop();
      if (!format) continue;

      const [openingTag, closingTag] =
        type === "bold"
          ? ["<strong>", "</strong>"]
          : type === "italic"
            ? ["<em>", "</em>"]
            : type === "underline"
              ? ["<u>", "</u>"]
              : [
                  `<span data-font-size="${format.fontSize}">`,
                  "</span>",
                ];
      segment = `${openingTag}${segment}${closingTag}`;
    }

    return serialized + segment;
  }, "");
}

function parseFormattedNodes(
  tokens: string[],
  startIndex: number,
  expectedClose?: string,
): { nodes: ReactNode[]; nextIndex: number } {
  const nodes: ReactNode[] = [];
  let index = startIndex;

  while (index < tokens.length) {
    const token = tokens[index];
    const closingTag = token.match(/^<\/(strong|em|u|span)>$/)?.[1];
    if (closingTag) {
      if (closingTag === expectedClose) {
        return { nodes, nextIndex: index + 1 };
      }
      nodes.push(token);
      index += 1;
      continue;
    }

    const openingTag = token.match(/^<(strong|em|u)>$/)?.[1];
    const fontSize = token.match(
      /^<span data-font-size="(12|14|16|18|24)">$/,
    )?.[1];
    if (openingTag || fontSize) {
      const tag = openingTag || "span";
      const parsedChildren = parseFormattedNodes(tokens, index + 1, tag);
      const props =
        fontSize === undefined
          ? { key: index }
          : { key: index, style: { fontSize: `${fontSize}px` } };
      nodes.push(
        createElement(tag, props, ...parsedChildren.nodes),
      );
      index = parsedChildren.nextIndex;
      continue;
    }

    nodes.push(token);
    index += 1;
  }

  return { nodes, nextIndex: index };
}

export function renderNewsText(text: string): ReactNode {
  const tokens = text.split(FORMAT_TAG_PATTERN);
  return parseFormattedNodes(tokens, 0).nodes;
}
