import { useState } from "react";
import { Box, IconButton, Typography, styled } from "@mui/material";
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

// Styled Components
const ImageContainer = styled(Box)({
  flex: 1,
  height: "100%",
  position: "relative",
  backgroundColor: "#000",
  overflow: "hidden",
});

const ImageElement = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
});

const NavButton = styled(IconButton)({
  position: "absolute",
  top: "calc(50vh - 24px)",
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "white",
  width: 48,
  height: 48,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});

const OverlayBox = styled(Box)({
  position: "absolute",
  backgroundColor: "rgba(0,0,0,0.8)",
  color: "white",
  padding: "8px 16px",
  borderRadius: 4,
});

const TitleBox = styled(OverlayBox)({
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
});

const PlaceholderContainer = styled(Box)({
  flex: 1,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#000",
  color: "white",
});

const NoImagesPlaceholder = () => (
  <PlaceholderContainer>
    <Typography>No images available</Typography>
  </PlaceholderContainer>
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
    <ImageContainer>
      <ImageElement src={`https:${url}`} alt={current.title} />

      {totalImages > 1 && (
        <>
          <NavButton onClick={goPrev} sx={{ left: 20 }}>
            <ArrowBack />
          </NavButton>
          <NavButton onClick={goNext} sx={{ right: 20 }}>
            <ArrowForward />
          </NavButton>
        </>
      )}

      <OverlayBox sx={{ top: 20, right: 20, fontWeight: "bold" }}>
        {currentIndex + 1} / {totalImages}
      </OverlayBox>

      {current.title && (
        <TitleBox sx={{ top: 20, left: 20 }}>{current.title}</TitleBox>
      )}
    </ImageContainer>
  );
};

export default CountryImages;
