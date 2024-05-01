import { Item, Permission, Player } from "@owlbear-rodeo/sdk";

export function hasPermission(
  permission: Permission,
  permissions: Permission[],
  role: Player["role"]
) {
  if (role === "PLAYER") {
    return permissions.includes(permission);
  } else {
    return true;
  }
}

export function getPermissionsForItem(item: Item):
  | {
      create: Permission;
      update: Permission;
      delete: Permission;
    }
  | undefined {
  if (item.layer === "MAP") {
    return {
      create: "MAP_CREATE",
      update: "MAP_UPDATE",
      delete: "MAP_DELETE",
    };
  } else if (item.layer === "PROP") {
    return {
      create: "PROP_CREATE",
      update: "PROP_UPDATE",
      delete: "PROP_DELETE",
    };
  } else if (item.layer === "MOUNT") {
    return {
      create: "MOUNT_CREATE",
      update: "MOUNT_UPDATE",
      delete: "MOUNT_DELETE",
    };
  } else if (item.layer === "CHARACTER") {
    return {
      create: "CHARACTER_CREATE",
      update: "CHARACTER_UPDATE",
      delete: "CHARACTER_DELETE",
    };
  } else if (item.layer === "ATTACHMENT") {
    return {
      create: "ATTACHMENT_CREATE",
      update: "ATTACHMENT_UPDATE",
      delete: "ATTACHMENT_DELETE",
    };
  } else if (item.layer === "NOTE") {
    return {
      create: "NOTE_CREATE",
      update: "NOTE_UPDATE",
      delete: "NOTE_DELETE",
    };
  } else if (item.layer === "RULER") {
    return {
      create: "RULER_CREATE",
      update: "RULER_UPDATE",
      delete: "RULER_DELETE",
    };
  } else if (item.layer === "POINTER") {
    return {
      create: "POINTER_CREATE",
      update: "POINTER_UPDATE",
      delete: "POINTER_DELETE",
    };
  } else if (item.layer === "TEXT") {
    return {
      create: "TEXT_CREATE",
      update: "TEXT_UPDATE",
      delete: "TEXT_DELETE",
    };
  } else if (item.layer === "FOG") {
    return {
      create: "FOG_CREATE",
      update: "FOG_UPDATE",
      delete: "FOG_DELETE",
    };
  } else if (item.layer === "DRAWING") {
    return {
      create: "DRAWING_CREATE",
      update: "DRAWING_UPDATE",
      delete: "DRAWING_DELETE",
    };
  } else {
    return undefined;
  }
}

export function itemHasOwnerOnlyPermission(
  item: Item,
  permissions: Permission[]
): boolean {
  return (
    item.layer === "CHARACTER" && permissions.includes("CHARACTER_OWNER_ONLY")
  );
}

export function itemHasPermission(
  item: Item,
  type: "CREATE" | "UPDATE" | "DELETE",
  permissions: Permission[],
  role: Player["role"],
  playerId: string
) {
  if (role === "GM") {
    return true;
  }
  const permission = getPermissionsForItem(item);
  if (!permission) {
    return false;
  }
  if (type === "CREATE") {
    return hasPermission(permission.create, permissions, role);
  } else if (type === "UPDATE") {
    const hasUpdatePermission = hasPermission(
      permission.update,
      permissions,
      role
    );
    if (hasUpdatePermission && itemHasOwnerOnlyPermission(item, permissions)) {
      return item.createdUserId === playerId;
    }
    return hasUpdatePermission;
  } else if (type === "DELETE") {
    const hasDeletePermission = hasPermission(
      permission.delete,
      permissions,
      role
    );
    if (hasDeletePermission && itemHasOwnerOnlyPermission(item, permissions)) {
      return item.createdUserId === playerId;
    }
    return hasDeletePermission;
  }
  return false;
}
