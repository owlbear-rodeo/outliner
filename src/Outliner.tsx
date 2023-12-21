import Stack from "@mui/material/Stack";
import { Header } from "./Header";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useRef } from "react";
import List from "@mui/material/List";
import { Items } from "./Items";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export function Outliner() {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight, 64);
          // Set the action height to the list height + the card header height + padding
          OBR.action.setHeight(listHeight + 64 + 8);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, []);

  useEffect(() => {
    // When a common key is pressed ensure the action is performed in OBR
    // This is done because the OBR window might not have focus so the
    // key won't be triggered
    async function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing into an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const role = useOwlbearStore.getState().role;
      const selection = useOwlbearStore.getState().selection;
      if (e.key === "Delete" || e.key === "Backspace") {
        // Only allow deleting if your the GM to avoid permissions issues
        if (role === "GM" && selection) {
          e.preventDefault();
          e.stopPropagation();
          await OBR.scene.items.deleteItems(selection);
          await OBR.player.deselect();
        }
      }
      if (e.key === "z") {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          if (e.shiftKey) {
            await OBR.scene.history.redo();
          } else {
            await OBR.scene.history.undo();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Stack height="100vh">
      <Header />
      <SimpleBar style={{ maxHeight: "calc(100vh - 72px)" }}>
        <List ref={listRef} disablePadding>
          <Items />
        </List>
      </SimpleBar>
    </Stack>
  );
}
