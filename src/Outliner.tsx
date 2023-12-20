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
