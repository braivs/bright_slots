import {Application} from "pixi.js";
import {SlotGame} from "./SlotGame.ts";

// Base game dimensions (design size - keep this fixed for internal calculations)
const BASE_WIDTH = 800
const BASE_HEIGHT = 700

// Calculate optimal scale for current screen
const calculateScale = () => {
  const maxWidth = window.innerWidth
  const maxHeight = window.innerHeight
  
  // Calculate scale to fit screen while maintaining aspect ratio
  const scaleX = maxWidth / BASE_WIDTH
  const scaleY = maxHeight / BASE_HEIGHT
  const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
  
  return scale
}

// Resize handler - scales canvas via CSS
const handleResize = (app: Application) => {
  const scale = calculateScale()
  const scaledWidth = BASE_WIDTH * scale
  const scaledHeight = BASE_HEIGHT * scale
  
  if (app.canvas) {
    // Scale canvas via CSS (simpler and more reliable)
    app.canvas.style.width = `${scaledWidth}px`
    app.canvas.style.height = `${scaledHeight}px`
  }
}

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize with fixed base size (internal resolution stays 800x700)
  await app.init({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    background: 0x1a1a2e,
    // antialias: true
  });

  // Set initial scale
  const initialScale = calculateScale()
  const scaledWidth = BASE_WIDTH * initialScale
  const scaledHeight = BASE_HEIGHT * initialScale
  
  app.canvas.style.width = `${scaledWidth}px`
  app.canvas.style.height = `${scaledHeight}px`

  document.body.appendChild(app.canvas);

  // Add resize listener
  window.addEventListener('resize', () => handleResize(app))
  
  // Handle orientation change on mobile
  window.addEventListener('orientationchange', () => {
    setTimeout(() => handleResize(app), 100)
  })

  SlotGame(app)

})();
