import SvgIcon from "@mui/material/SvgIcon/SvgIcon";
import { Shape } from "@owlbear-rodeo/sdk";
import { useMemo } from "react";
import { BOX_SIZE, SHAPE_SIZE, STROKE_WIDTH } from "./common";

export function ShapeIcon({ item }: { item: Shape }) {
  if (item.shapeType === "CIRCLE") {
    return <CircleIcon />;
  } else if (item.shapeType === "RECTANGLE") {
    return <RectIcon item={item} />;
  } else if (item.shapeType === "HEXAGON") {
    return <HexagonIcon item={item} />;
  } else if (item.shapeType === "TRIANGLE") {
    return <TriangleIcon item={item} />;
  } else {
    return null;
  }
}

export function CircleIcon() {
  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      >
        <circle cx={BOX_SIZE / 2} cy={BOX_SIZE / 2} r={SHAPE_SIZE / 2} />
      </svg>
    </SvgIcon>
  );
}

export function RectIcon({ item }: { item: Shape }) {
  const [x, y, width, height] = useMemo<
    [number, number, number, number]
  >(() => {
    let width = 0;
    let height = 0;
    let x = 0;
    let y = 0;
    const ratio = item.height !== 0 ? item.width / item.height : 1;
    if (ratio > 1) {
      width = SHAPE_SIZE;
      height = SHAPE_SIZE / ratio;
    } else {
      height = SHAPE_SIZE;
      width = SHAPE_SIZE * ratio;
    }

    x = BOX_SIZE / 2 - width / 2;
    y = BOX_SIZE / 2 - height / 2;

    return [x, y, width, height];
  }, [item.width, item.height]);

  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      >
        <rect
          transform={`rotate(${item.rotation}, ${BOX_SIZE / 2}, ${
            BOX_SIZE / 2
          })`}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      </svg>
    </SvgIcon>
  );
}

export function HexagonIcon({ item }: { item: Shape }) {
  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      >
        <path
          transform={`rotate(${item.rotation}, ${BOX_SIZE / 2}, ${
            BOX_SIZE / 2
          })`}
          d="M12,3.57735027 L19.2942286,7.78867513 L19.2942286,16.2113249 L12,20.4226497 L4.70577137,16.2113249 L4.70577137,7.78867513 L12,3.57735027 Z"
        />
      </svg>
    </SvgIcon>
  );
}

export function TriangleIcon({ item }: { item: Shape }) {
  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        strokeWidth={STROKE_WIDTH}
        stroke="currentColor"
      >
        <path
          transform={`rotate(${item.rotation}, ${BOX_SIZE / 2}, ${
            BOX_SIZE / 2
          })`}
          d="M12,4.11803399 L20.190983,20.5 L3.80901699,20.5 L12,4.11803399 Z"
        />
      </svg>
    </SvgIcon>
  );
}
