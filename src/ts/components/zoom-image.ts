// Function-based image zoom implementation with robust TypeScript null checking

/**
 * Initialize zoom functionality for an image container
 * @param imageContainerId The ID of the image container element
 * @param zoomControlsConfig Optional configuration for zoom control element IDs
 */
function initializeImageZoom(
    imageContainerId: string,
    zoomControlsConfig: {
      zoomInBtnId?: string,
      zoomOutBtnId?: string,
      zoomResetBtnId?: string,
      zoomLevelDisplayId?: string
    } = {}
  ): void {
    // State variables
    let zoomLevel: number = 1;
    let isDragging: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let translateX: number = 0;
    let translateY: number = 0;
    
    // Constants
    const MIN_ZOOM: number = 1;
    const MAX_ZOOM: number = 4;
    const ZOOM_STEP: number = 0.25;
    
    // Get DOM elements with robust type checking
    const imageContainerEl = document.getElementById(imageContainerId);
    if (!imageContainerEl) {
      console.error(`Image container with ID "${imageContainerId}" not found`);
      return;
    }
    // Store as a definite HTMLElement (not null)
    const imageContainer: HTMLElement = imageContainerEl;
    
    // Get zoom control elements
    const zoomInBtnEl = document.getElementById(zoomControlsConfig.zoomInBtnId || 'zoom-in');
    const zoomOutBtnEl = document.getElementById(zoomControlsConfig.zoomOutBtnId || 'zoom-out');
    const zoomResetBtnEl = document.getElementById(zoomControlsConfig.zoomResetBtnId || 'zoom-reset');
    const zoomLevelDisplayEl = document.getElementById(zoomControlsConfig.zoomLevelDisplayId || 'zoom-level');
    
    if (!zoomInBtnEl || !zoomOutBtnEl || !zoomResetBtnEl || !zoomLevelDisplayEl) {
      console.error('One or more zoom control elements not found');
      return;
    }
    
    // Store as definite HTMLElements (not null)
    const zoomInBtn: HTMLElement = zoomInBtnEl;
    const zoomOutBtn: HTMLElement = zoomOutBtnEl;
    const zoomResetBtn: HTMLElement = zoomResetBtnEl;
    const zoomLevelDisplay: HTMLElement = zoomLevelDisplayEl;
    
    // Center the image initially
    centerImage();
    
    // Apply zoom transformation
    function applyZoomTransform(): void {
      imageContainer.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
      zoomLevelDisplay.textContent = `${Math.round(zoomLevel * 100)}%`;
      
      if (zoomLevel > 1) {
        imageContainer.classList.add('zoomed');
      } else {
        imageContainer.classList.remove('zoomed');
        // Reset translation when at 100%
        translateX = 0;
        translateY = 0;
        // Re-center the image
        centerImage();
      }
    }
    
    // Center the image in the container
    function centerImage(): void {
      const images = imageContainer.querySelectorAll('img');
      if (images.length === 0) {
        // If no images found, set up a mutation observer to detect when they're added
        const observer = new MutationObserver((mutations) => {
          if (imageContainer.querySelectorAll('img').length > 0) {
            observer.disconnect();
            centerImage(); // Try again once images are found
          }
        });
        observer.observe(imageContainer, { childList: true, subtree: true });
        return;
      }
      
      // Ensure images are properly positioned and sized
      images.forEach(img => {
        if (img.complete) {
          // Apply centering styles
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          img.style.margin = 'auto';
          img.style.display = 'block';
        } else {
          // Wait for image to load
          img.addEventListener('load', () => {
            // Apply centering styles
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.margin = 'auto';
            img.style.display = 'block';
          });
        }
      });
    }
    
    // Zoom in function
    function zoomIn(): void {
      if (zoomLevel < MAX_ZOOM) {
        zoomLevel += ZOOM_STEP;
        applyZoomTransform();
      }
    }
    
    // Zoom out function
    function zoomOut(): void {
      if (zoomLevel > MIN_ZOOM) {
        zoomLevel -= ZOOM_STEP;
        applyZoomTransform();
      }
    }
    
    // Reset zoom function
    function resetZoom(): void {
      zoomLevel = 1;
      translateX = 0;
      translateY = 0;
      applyZoomTransform();
      centerImage();
    }
    
    // Handle mouse wheel zoom
    function handleWheel(e: WheelEvent): void {
      e.preventDefault();
      
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
    
    // Mouse events for panning
    function handleMouseDown(e: MouseEvent): void {
      if (zoomLevel > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        imageContainer.classList.add('panning');
      }
    }
    
    function handleMouseMove(e: MouseEvent): void {
      if (!isDragging) return;
      
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      
      imageContainer.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
    }
    
    function handleMouseUp(): void {
      if (isDragging) {
        isDragging = false;
        imageContainer.classList.remove('panning');
      }
    }
    
    // Touch events for mobile panning
    function handleTouchStart(e: TouchEvent): void {
      if (zoomLevel > 1 && e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        imageContainer.classList.add('panning');
      }
    }
    
    function handleTouchMove(e: TouchEvent): void {
      if (!isDragging) return;
      
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      
      imageContainer.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
    }
    
    function handleTouchEnd(): void {
      if (isDragging) {
        isDragging = false;
        imageContainer.classList.remove('panning');
      }
    }
    
    // Set up event listeners
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomResetBtn.addEventListener('click', resetZoom);
    
    imageContainer.addEventListener('wheel', handleWheel);
    imageContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    imageContainer.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Double-click to reset zoom
    imageContainer.addEventListener('dblclick', resetZoom);
    
    // Initialize with default state
    applyZoomTransform();
    
    // Handle window resize to maintain proper centering
    window.addEventListener('resize', centerImage);
  }
  
  // Export the function for use in other modules
  export { initializeImageZoom };