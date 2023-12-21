import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Item } from "@owlbear-rodeo/sdk";
import { ItemIcon } from "./ItemIcon";
import { ItemText } from "./ItemText";
import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";
import LockedIcon from "@mui/icons-material/LockRounded";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { useOwlbearStore } from "./useOwlbearStore";
import { memo } from "react";
import useTheme from "@mui/material/styles/useTheme";

export const ItemListItem = memo(function ({
  item,
  onClick,
  onDoubleClick,
  dragging,
}: {
  item: Item;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  dragging?: boolean;
}) {
  const selected = useOwlbearStore(
    (state) => state.selection?.includes(item.id) ?? false
  );

  const [ref, inView] = useInView();

  const theme = useTheme();

  return (
    <ListItemButton
      sx={{
        margin: "4px 8px",
        borderRadius: "12px",
        backgroundColor: dragging
          ? `${theme.palette.primary.main} !important`
          : undefined,
        boxShadow: dragging ? theme.shadows[5] : undefined,
        color: dragging
          ? `${theme.palette.primary.contrastText} !important`
          : undefined,
        cursor: dragging ? "grabbing" : undefined,
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      selected={selected}
      dense
      ref={ref}
    >
      {inView ? (
        <>
          <ListItemIcon
            sx={{
              opacity: "0.75",
              minWidth: "28px",
              "& svg": { fontSize: "1.25rem" },
              color: "inherit",
            }}
          >
            <ItemIcon item={item} />
          </ListItemIcon>
          <ItemText item={item} />
          {item.locked && (
            <ListItemIcon
              sx={{ minWidth: "28px", opacity: "0.5", color: "inherit" }}
            >
              <Tooltip title="Locked">
                <LockedIcon fontSize="small" />
              </Tooltip>
            </ListItemIcon>
          )}
          {!item.visible && (
            <ListItemIcon
              sx={{ minWidth: "28px", opacity: "0.5", color: "inherit" }}
            >
              <Tooltip title="Hidden">
                <HiddenIcon fontSize="small" />
              </Tooltip>
            </ListItemIcon>
          )}
        </>
      ) : (
        <Box height="28px" />
      )}
    </ListItemButton>
  );
});
