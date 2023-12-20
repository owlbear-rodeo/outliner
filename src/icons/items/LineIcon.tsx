import SvgIcon from "@mui/material/SvgIcon/SvgIcon";
import { Line, Math2 } from "@owlbear-rodeo/sdk";
import { useMemo } from "react";
import { BOX_SIZE, SHAPE_SIZE, STROKE_WIDTH } from "./common";

export function LineIcon({ item }: { item: Line }) {
  const [x1, y1, x2, y2] = useMemo<[number, number, number, number]>(() => {
    const bounds = Math2.boundingBox([item.startPosition, item.endPosition]);
    const scale = Math.max(bounds.width, bounds.height);

    // Offset so the position is relative to the line bounds
    const offsetStart = Math2.subtract(item.startPosition, bounds.min);
    const offsetEnd = Math2.subtract(item.endPosition, bounds.min);
    // Normalize between 0 and 1
    const relativeStart = Math2.divide(offsetStart, scale === 0 ? 1 : scale);
    const relativeEnd = Math2.divide(offsetEnd, scale === 0 ? 1 : scale);
    // Scale up to the shape size
    const scaledStart = Math2.multiply(relativeStart, SHAPE_SIZE);
    const scaledEnd = Math2.multiply(relativeEnd, SHAPE_SIZE);
    // Center new line
    const scaledBounds = Math2.boundingBox([scaledStart, scaledEnd]);
    const offsetX = BOX_SIZE / 2 - scaledBounds.width / 2;
    const offsetY = BOX_SIZE / 2 - scaledBounds.height / 2;

    const x1 = scaledStart.x + offsetX;
    const y1 = scaledStart.y + offsetY;
    const x2 = scaledEnd.x + offsetX;
    const y2 = scaledEnd.y + offsetY;

    return [x1, y1, x2, y2];
  }, [item.startPosition, item.endPosition]);

  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      >
        <line
          transform={`rotate(${item.rotation}, ${BOX_SIZE / 2}, ${
            BOX_SIZE / 2
          })`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      </svg>
    </SvgIcon>
  );
}
