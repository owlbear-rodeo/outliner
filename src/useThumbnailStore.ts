import { Image as ImageType } from "@owlbear-rodeo/sdk";
import { create } from "zustand";
import { useOwlbearStore } from "./useOwlbearStore";

interface ThumbnailState {
  thumbnails: Record<string, HTMLCanvasElement>;

  createThumbnailIfNeeded: (item: ImageType) => void;
}

const THUMBNAIL_SIZE = 20;

// Cache image item images as a 20x20 canvas thumbnail
// This prevents potentially expensive re-draws of larger images
export const useThumbnailStore = create<ThumbnailState>()((set, get) => {
  // Clear thumbnails when a scene changes as a form of garbage collection
  useOwlbearStore.subscribe((state) => {
    if (!state.sceneReady) {
      set({ thumbnails: {} });
    }
  });

  return {
    thumbnails: {},
    createThumbnailIfNeeded: (item) => {
      if (item.image.url in get().thumbnails) {
        return;
      }

      const image = new Image(item.image.width, item.image.height);

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = THUMBNAIL_SIZE;
        canvas.height = THUMBNAIL_SIZE;
        const context = canvas.getContext("2d");
        if (context) {
          const w = item.image.width;
          const h = item.image.height;
          let sw = 0;
          let sh = 0;
          let sx = 0;
          let sy = 0;
          if (w > h) {
            // Fit height
            sh = h;
            sw = h;
            sx = w / 2 - h / 2;
          } else {
            // Fit width
            sw = w;
            sh = w;
            sy = h / 2 - w / 2;
          }
          context.drawImage(
            image,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            THUMBNAIL_SIZE,
            THUMBNAIL_SIZE
          );
          set((state) => ({
            thumbnails: { ...state.thumbnails, [item.image.url]: canvas },
          }));
        }
      };

      image.src = item.image.url;
    },
  };
});
