import {
  Item,
  isCurve,
  isImage,
  isLabel,
  isLine,
  isPath,
  isRuler,
  isShape,
  isText,
} from "@owlbear-rodeo/sdk";
import { ShapeIcon } from "./icons/items/ShapeIcon";
import { ImageIcon } from "./icons/items/ImageIcon";
import { TextIcon } from "./icons/items/TextIcon";
import { LineIcon } from "./icons/items/LineIcon";
import { PathIcon } from "./icons/items/PathIcon";
import { CurveIcon } from "./icons/items/CurveIcon";
import { RulerIcon } from "./icons/items/RulerIcon";

export function ItemIcon({ item }: { item: Item }) {
  if (isText(item) || isLabel(item)) {
    return <TextIcon />;
  } else if (isImage(item)) {
    return <ImageIcon />;
  } else if (isShape(item)) {
    return <ShapeIcon item={item} />;
  } else if (isLine(item)) {
    return <LineIcon item={item} />;
  } else if (isPath(item)) {
    return <PathIcon item={item} />;
  } else if (isCurve(item)) {
    return <CurveIcon item={item} />;
  } else if (isRuler(item)) {
    return <RulerIcon />;
  } else {
    return null;
  }
}
