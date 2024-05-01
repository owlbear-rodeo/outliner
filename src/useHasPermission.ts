import OBR, { Item, Permission } from "@owlbear-rodeo/sdk";
import { useOwlbearStore } from "./useOwlbearStore";
import { useMemo } from "react";
import { hasPermission, itemHasPermission } from "./hasPermission";

export function useHasPermission(permission: Permission) {
  const permissions = useOwlbearStore((state) => state.permissions);
  const role = useOwlbearStore((state) => state.role);

  const value = useMemo(
    () => hasPermission(permission, permissions, role),
    [permission, permissions, role]
  );

  return value;
}

export function useItemHsaPermission(
  item: Item,
  type: "CREATE" | "UPDATE" | "DELETE"
) {
  const permissions = useOwlbearStore((state) => state.permissions);
  const role = useOwlbearStore((state) => state.role);

  const value = useMemo(
    () => itemHasPermission(item, type, permissions, role, OBR.player.id),
    [item, type, permissions, role]
  );

  return value;
}
