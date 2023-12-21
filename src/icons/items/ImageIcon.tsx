import styled from "@mui/material/styles/styled";
import { Image } from "@owlbear-rodeo/sdk";
import { useState } from "react";
import createSvgIcon from "@mui/material/utils/createSvgIcon";

const StyledImage = styled("img")({
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  objectFit: "cover",
});

const ImageSvg = createSvgIcon(
  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z" />,
  "Image"
);

export function ImageIcon({ item }: { item: Image }) {
  const [error, setError] = useState(false);

  if (error) {
    return <ImageSvg />;
  }

  return (
    <StyledImage
      aria-hidden="true"
      src={item.image.url}
      onError={() => setError(true)}
    />
  );
}
