import { Path } from "@owlbear-rodeo/sdk";
import { useMemo } from "react";
import { getPathKit } from "../../pathkit";
import { BOX_SIZE, STROKE_WIDTH, SHAPE_SIZE } from "./common";
import SvgIcon from "@mui/material/SvgIcon/SvgIcon";

export function PathIcon({ item }: { item: Path }) {
  const [svgString, left, top, right, bottom] = useMemo<
    [string, number, number, number, number]
  >(() => {
    const pk = getPathKit();
    const path = pk.FromCmds(item.commands);
    const fillType =
      item.fillRule === "nonzero" ? pk.FillType.WINDING : pk.FillType.EVENODD;
    path.setFillType(fillType);

    const bounds = path.getBounds();
    const str = path.toSVGString();

    path.delete();

    return [str, bounds.fLeft, bounds.fTop, bounds.fRight, bounds.fBottom];
  }, [item.commands, item.fillRule]);

  const width = Math.max(right - left, 1);
  const height = Math.max(bottom - top, 1);
  const strokeScale = Math.max(width, height) / BOX_SIZE;
  const padding = (BOX_SIZE - SHAPE_SIZE) / 2;
  const paddingX = padding * (width / BOX_SIZE);
  const paddingY = padding * (height / BOX_SIZE);

  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={`${left - paddingX} ${top - paddingY} ${
          width + paddingX * 2
        } ${height + paddingY * 2}`}
        strokeWidth={STROKE_WIDTH * strokeScale}
        stroke="currentColor"
      >
        <path
          transform={`rotate(${item.rotation}, ${left + width / 2}, ${
            top + height / 2
          })`}
          d={svgString}
        />
      </svg>
    </SvgIcon>
  );
}
