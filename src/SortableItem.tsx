import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import Box from "@mui/material/Box";

export function SortableItem({
  itemId,
  children,
}: {
  itemId: string;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable(
    { id: itemId }
  );

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: "relative",
        "::after":
          isOver && !isDragging
            ? {
                content: "''",
                position: "absolute",
                bottom: 0,
                left: "16px",
                right: "16px",
                height: "2px",
                backgroundColor: "primary.main",
              }
            : undefined,
        outline: "none",
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </Box>
  );
}
