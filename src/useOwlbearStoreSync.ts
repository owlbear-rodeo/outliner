import OBR, { Player } from "@owlbear-rodeo/sdk";
import { useOwlbearStore } from "./useOwlbearStore";
import { useEffect } from "react";

// Sync OBR with the apps Zustand store
export function useOwlbearStoreSync() {
  const setSceneReady = useOwlbearStore((state) => state.setSceneReady);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  const sceneReady = useOwlbearStore((state) => state.sceneReady);
  const setItems = useOwlbearStore((state) => state.setItems);
  useEffect(() => {
    if (sceneReady) {
      OBR.scene.items.getItems().then(setItems);
      return OBR.scene.items.onChange(setItems);
    } else {
      setItems([]);
    }
  }, [sceneReady]);

  const setRole = useOwlbearStore((state) => state.setRole);
  const setSelection = useOwlbearStore((state) => state.setSelection);
  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
      setSelection(player.selection);
    };
    OBR.player.getRole().then(setRole);
    OBR.player.getSelection().then(setSelection);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  const setPermissions = useOwlbearStore((state) => state.setPermissions);
  useEffect(() => {
    OBR.room.getPermissions().then(setPermissions);
    return OBR.room.onPermissionsChange(setPermissions);
  }, []);
}
