import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import type { WikipediaImage } from "../types/api";

const EXCLUDED_KEYWORDS = [
  "logo",
  "icon",
  "commons",
  "cscr-featured",
  "oojs",
  "semi-protection",
  "wiktionary",
];

const overlayBoxSx = {
  position: "absolute",
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "white",
  px: 2,
  py: 1,
  borderRadius: 1,
};

const navButtonSx = {
  position: "absolute",
  top: "calc(50vh - 24px)",
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "white",
  width: 48,
  height: 48,
  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
};

const NoImagesPlaceholder = () => (
  <Box
    sx={{
      flex: 1,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      color: "white",
    }}
  >
    No images available
  </Box>
);

// Filter valid images
const filterImages = (images: WikipediaImage[]) =>
  images.filter((img) => {
    const title = img.title.toLowerCase();
    const isValidType = img.preferred?.mediatype === "BITMAP";
    const isLargeEnough = (img.preferred?.width || 0) > 200;
    const hasNoExcludedKeyword = !EXCLUDED_KEYWORDS.some((kw) =>
      title.includes(kw)
    );
    return isValidType && isLargeEnough && hasNoExcludedKeyword;
  });

const CountryImages = ({ images }: { images?: WikipediaImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images?.length) return <NoImagesPlaceholder />;

  const filteredImages = filterImages(images);
  if (!filteredImages.length) return <NoImagesPlaceholder />;

  const current = filteredImages[currentIndex];
  const url = current.preferred?.url || current.original?.url;
  if (!url) return <NoImagesPlaceholder />;

  const totalImages = filteredImages.length;
  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? totalImages - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === totalImages - 1 ? 0 : i + 1));

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={`https:${url}`}
        alt={current.title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Navigation Buttons */}
      {totalImages > 1 && (
        <>
          <IconButton onClick={goPrev} sx={{ ...navButtonSx, left: 20 }}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={goNext} sx={{ ...navButtonSx, right: 20 }}>
            <ArrowForward />
          </IconButton>
        </>
      )}

      {/* Image Counter */}
      <Box
        sx={{
          ...overlayBoxSx,
          top: 20,
          right: 20,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        {currentIndex + 1} / {totalImages}
      </Box>

      {/* Image Title */}
      {current.title && (
        <Box
          sx={{
            ...overlayBoxSx,
            top: 20,
            left: 20,
            fontSize: 12,
            maxWidth: 300,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "all 0.25s ease",
            cursor: "default",
            "&:hover": {
              whiteSpace: "normal",
              overflow: "visible",
              maxWidth: "none",
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 9999,
            },
          }}
        >
          {current.title}
        </Box>
      )}
    </Box>
  );
};

export default CountryImages;
