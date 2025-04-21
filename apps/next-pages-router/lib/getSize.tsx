export function getSize(postSize: string | number) {
  // Get current window width using the custom hook
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  // Determine square sizes based on screen width
  let squareSizes: number[];

  if (windowWidth < 640) {
    // Mobile
    squareSizes = [80, 110, 140, 170, 200];
  } else if (windowWidth < 768) {
    // Small tablets
    squareSizes = [100, 140, 180, 220, 260];
  } else if (windowWidth < 1024) {
    // Tablets/small laptops
    squareSizes = [120, 170, 210, 250, 300];
  } else {
    // Desktops
    squareSizes = [140, 190, 240, 290, 340];
  }

  // Convert string to number if needed
  const size =
    typeof postSize === "string" ? parseInt(postSize, 10) || 0 : postSize;

  if (size === 2 || size === 1) {
    return squareSizes[0];
  }
  if (size === 3) {
    return squareSizes[1];
  }
  if (size === 5) {
    return squareSizes[3];
  }
  if (size >= 6) {
    return squareSizes[4];
  }
  return squareSizes[2];
}
