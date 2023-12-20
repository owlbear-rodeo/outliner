import ListItemText from "@mui/material/ListItemText";
import { Item, RichText, TextContent, isShape } from "@owlbear-rodeo/sdk";
import { useMemo } from "react";
import { capitalize } from "./capitalize";
import { useOwlbearStore } from "./useOwlbearStore";

export function ItemText({ item }: { item: Item }) {
  const role = useOwlbearStore((state) => state.role);
  const name = useMemo(() => {
    if (role === "PLAYER") {
      let name = "Item";
      if (isShape(item)) {
        name = capitalize(item.shapeType);
      } else {
        name = capitalize(item.type);
      }
      return name;
    } else {
      return item.name;
    }
  }, [item.name, role]);

  if (isTextable(item)) {
    return <TextableText item={item} name={name} />;
  } else {
    return (
      <ListItemText primary={name} primaryTypographyProps={{ noWrap: true }} />
    );
  }
}

interface Textable {
  id: string;
  text: TextContent;
  name: string;
}

function isTextable(item: any): item is Textable {
  return typeof item.id === "string" && typeof item.text === "object";
}

export function isPlainObject(
  item: unknown
): item is Record<keyof any, unknown> {
  return (
    item !== null && typeof item === "object" && item.constructor === Object
  );
}

function TextableText({ item, name }: { item: Textable; name: string }) {
  const plainText = useMemo(() => {
    if (item.text.type === "PLAIN") {
      return item.text.plainText;
    } else {
      return toPlainText(item.text.richText);
    }
  }, [item.text]);

  return (
    <ListItemText
      primaryTypographyProps={{ noWrap: true }}
      primary={plainText || name}
    />
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

function toPlainText(node: RichText): string {
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
