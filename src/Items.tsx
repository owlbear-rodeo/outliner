import OBR, { Item, Math2, Vector2 } from "@owlbear-rodeo/sdk";
import { useMemo, useState } from "react";
import { ItemList } from "./ItemList";
import { useOwlbearStore } from "./useOwlbearStore";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ItemDragOverlay } from "./ItemDragOverlay";
import { lerp } from "./lerp";

const VALID_LAYERS = new Set<Item["layer"]>([
  "MAP",
  "DRAWING",
  "PROP",
  "MOUNT",
  "CHARACTER",
  "ATTACHMENT",
  "NOTE",
  "TEXT",
  "RULER",
]);

export function Items() {
  const items = useOwlbearStore((state) => state.items);
  const role = useOwlbearStore((state) => state.role);
  const selection = useOwlbearStore((state) => state.selection);

  const [shownItemsByLayer, shownIds] = useMemo(() => {
    const layers: Record<Item["layer"], Item[]> = {
      MAP: [],
      DRAWING: [],
      PROP: [],
      MOUNT: [],
      CHARACTER: [],
      ATTACHMENT: [],
      NOTE: [],
      TEXT: [],
      RULER: [],
      FOG: [],
      CONTROL: [],
      GRID: [],
      POINTER: [],
      POPOVER: [],
    };

    const sortedItems = items.sort((a, b) => a.zIndex - b.zIndex);

    for (const item of sortedItems) {
      const hidden = !item.visible && role === "PLAYER";
      const valid =
        VALID_LAYERS.has(item.layer) || (item.layer === "FOG" && role === "GM");
      if (!hidden && valid) {
        layers[item.layer].push(item);
      }
    }

    const allIds: string[] = [];
    for (const layer of Object.keys(layers)) {
      allIds.push(...layers[layer as Item["layer"]].map((item) => item.id));
    }

    return [layers, allIds];
  }, [items, role]);

  async function handleItemSelect(
    item: Item,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    let newSelection: string[] = [];
    const currentSelection = selection ?? [];
    const { id } = item;
    if (event.metaKey || event.ctrlKey) {
      // Make a multi selection
      if (currentSelection.includes(id)) {
        newSelection = currentSelection.filter((c) => c !== id);
      } else {
        newSelection = [...currentSelection, id];
      }
    } else if (event.shiftKey) {
      // Make a range selection
      if (currentSelection.length > 0) {
        const currentIndex = shownIds.indexOf(id);
        const lastIndex = shownIds.indexOf(
          currentSelection[currentSelection.length - 1]
        );
        const idsToAdd: string[] = [];
        const idsToRemove: string[] = [];
        const direction = currentIndex > lastIndex ? 1 : -1;
        for (
          let i = lastIndex + direction;
          direction < 0 ? i >= currentIndex : i <= currentIndex;
          i += direction
        ) {
          const localId = shownIds[i];
          if (currentSelection.includes(localId)) {
            idsToRemove.push(localId);
          } else {
            idsToAdd.push(localId);
          }
        }
        newSelection = [...currentSelection, ...idsToAdd].filter(
          (id) => !idsToRemove.includes(id)
        );
      } else {
        newSelection = [id];
      }
    } else {
      // Single selection
      newSelection = [id];
    }

    if (newSelection.length === 0) {
      await OBR.player.deselect();
    } else {
      await OBR.player.select(newSelection);
    }
  }

  async function handleItemFocus(item: Item) {
    const focusedIds = [...new Set([...(selection ?? []), item.id])];

    // Convert the center of the selected item to screen-space
    const bounds = await OBR.scene.items.getItemBounds(focusedIds);
    const boundsAbsoluteCenter = await OBR.viewport.transformPoint(
      bounds.center
    );

    // Get the center of the viewport in screen-space
    const viewportWidth = await OBR.viewport.getWidth();
    const viewportHeight = await OBR.viewport.getHeight();
    const viewportCenter: Vector2 = {
      x: viewportWidth / 2,
      y: viewportHeight / 2,
    };

    // Offset the item center by the viewport center
    const absoluteCenter = Math2.subtract(boundsAbsoluteCenter, viewportCenter);

    // Convert the center to world-space
    const relativeCenter = await OBR.viewport.inverseTransformPoint(
      absoluteCenter
    );

    // Invert and scale the world-space position to match a viewport position offset
    const viewportScale = await OBR.viewport.getScale();
    const viewportPosition = Math2.multiply(relativeCenter, -viewportScale);

    await OBR.viewport.animateTo({
      scale: viewportScale,
      position: viewportPosition,
    });
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 3 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [dragId, setDragId] = useState<UniqueIdentifier | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (typeof active.id !== "string") {
      return;
    }

    if (!selection || !selection.includes(active.id)) {
      OBR.player.select([active.id]);
    }

    setDragId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (typeof event.over?.id === "string") {
      // If we're over the START pseudo element move to the start of the layer
      if (event.over && event.over.id.startsWith("START_")) {
        const layer = event.over.id.slice(6) as Item["layer"];
        // Move selection descending from the first zIndex of this layer
        const firstItem = shownItemsByLayer[layer][0];
        if (firstItem) {
          moveSelectionBefore(firstItem.zIndex, firstItem.layer);
        }
      } else {
        const overIndex = shownIds.indexOf(event.over.id);
        const overItem = items.find((item) => item.id === event.over?.id);
        const draggingItem = items.find((item) => item.id === dragId);
        // If we're over another item
        if (draggingItem && overItem && draggingItem !== overItem) {
          const nextIndex = overIndex + 1;
          const nextId = shownIds[nextIndex];
          const nextItem = items.find((item) => item.id === nextId);

          // If we're between two items on the same layer
          if (nextItem && nextItem.layer === overItem.layer) {
            // Insert selection between items on the same layer
            const minZIndex = overItem.zIndex;
            const maxZIndex = nextItem.zIndex;
            moveSelectionBetween(minZIndex, maxZIndex, overItem.layer);
          } else {
            // If we're at the end of the list
            moveSelectionAfter(overItem.zIndex, overItem.layer);
          }
        }
      }
    }

    setDragId(null);
  }

  // Move the current selection between the input zIndex's
  async function moveSelectionBetween(
    minZIndex: number,
    maxZIndex: number,
    layer?: Item["layer"]
  ) {
    if (!selection) {
      return;
    }

    // Evenly distribute the items between the min and max by
    // lerping between them with an alpha determined by the
    // selection length
    const lerpAlpha = 1 / (selection.length + 1);
    await OBR.scene.items.updateItems(
      selection.sort((a, b) => shownIds.indexOf(a) - shownIds.indexOf(b)),
      (items) => {
        let i = 1;
        for (const item of items) {
          item.zIndex = lerp(minZIndex, maxZIndex, lerpAlpha * i);
          i++;
          if (layer) {
            item.layer = layer;
          }
        }
      }
    );
  }

  // Move the current selection to before the input zIndex
  async function moveSelectionBefore(
    startZIndex: number,
    layer?: Item["layer"]
  ) {
    if (!selection) {
      return;
    }

    await OBR.scene.items.updateItems(
      selection.sort((a, b) => shownIds.indexOf(b) - shownIds.indexOf(a)),
      (items) => {
        let i = 1;
        for (const item of items) {
          item.zIndex = startZIndex - i;
          i++;
          if (layer) {
            item.layer = layer;
          }
        }
      }
    );
  }

  // Move the current selection to after the input zIndex
  async function moveSelectionAfter(endZIndex: number, layer?: Item["layer"]) {
    if (!selection) {
      return;
    }

    await OBR.scene.items.updateItems(
      selection.sort((a, b) => shownIds.indexOf(a) - shownIds.indexOf(b)),
      (items) => {
        let i = 1;
        for (const item of items) {
          item.zIndex = endZIndex + i;
          i++;
          if (layer) {
            item.layer = layer;
          }
        }
      }
    );
  }

  function handleDragCancel() {
    setDragId(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <SortableContext items={shownIds} strategy={verticalListSortingStrategy}>
        {Object.entries(shownItemsByLayer).map(([layer, items]) => (
          <ItemList
            key={layer}
            items={items}
            layer={layer as Item["layer"]}
            onItemSelect={handleItemSelect}
            onItemFocus={handleItemFocus}
          />
        ))}
        <ItemDragOverlay dragId={dragId} />
      </SortableContext>
    </DndContext>
  );
}
