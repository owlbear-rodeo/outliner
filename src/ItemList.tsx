import ExpandLess from "@mui/icons-material/ExpandLessRounded";
import ExpandMore from "@mui/icons-material/ExpandMoreRounded";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Item } from "@owlbear-rodeo/sdk";
import { useState } from "react";
import { ItemListItem } from "./ItemListItem";
import { LayerIcon } from "./LayerIcon";
import { SortableItem } from "./SortableItem";
import { capitalize } from "./helpers";

export function ItemList({
  layer,
  items,
  onItemSelect,
  onItemFocus,
}: {
  layer: Item["layer"];
  items: Item[];
  onItemSelect: (
    item: Item,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onItemFocus: (
    item: Item,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleLayerToggle() {
    setOpen(!open);
  }

  const layerName = `${capitalize(layer)}${
    layer !== "FOG" && layer !== "TEXT" ? "s" : ""
  }`;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ListItemButton dense onClick={handleLayerToggle} divider>
        <ListItemIcon
          sx={{
            color: "text.secondary",
            minWidth: "28px",
            "& svg": { fontSize: "1.25rem" },
          }}
        >
          <LayerIcon layer={layer} />
        </ListItemIcon>
        <ListItemText primary={layerName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <List component="div" dense>
          {/* A pseudo element that shows a sort indicator for the start of the list */}
          <SortableItem itemId={`START_${layer}`} />
          {items.map((item) => (
            <SortableItem key={item.id} itemId={item.id}>
              <ItemListItem
                item={item}
                onClick={(e) => onItemSelect(item, e)}
                onDoubleClick={(e) => onItemFocus(item, e)}
              />
            </SortableItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}
