import { RichText, TextContent } from "@owlbear-rodeo/sdk";

export interface Textable {
  id: string;
  text: TextContent;
  name: string;
}

export function isTextable(item: any): item is Textable {
  return typeof item.id === "string" && typeof item.text === "object";
}

export function isPlainObject(
  item: unknown
): item is Record<keyof any, unknown> {
  return (
    item !== null && typeof item === "object" && item.constructor === Object
  );
}

interface TextNode {
  text: string;
}

function isTextNode(node: any): node is TextNode {
  return isPlainObject(node) && typeof node.text === "string";
}

interface Descendent {
  children: any[];
}

function isDescendent(node: any): node is Descendent {
  return isPlainObject(node) && Array.isArray(node.children);
}

export function toPlainText(node: RichText): string {
  if (isTextNode(node)) {
    return node.text;
  } else if (isDescendent(node)) {
    return node.children.map((n) => toPlainText(n)).join(" ");
  } else if (Array.isArray(node)) {
    return node.map((n) => toPlainText(n)).join(" ");
  } else {
    return "";
  }
}

export function capitalize(text: string): string {
  return text[0] + text.slice(1).toLowerCase();
}

export function lerp(from: number, to: number, alpha: number): number {
  return from * (1 - alpha) + to * alpha;
}
