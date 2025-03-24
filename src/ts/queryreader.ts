
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    // Checks for file as key
    const filename = params.get('file');

    if (filename) {
        // Update the image to display from the uploads folder
        const dynamicImage =document.getElementById("dynamicImage") as HTMLImageElement | null;
        if (dynamicImage) {
            dynamicImage.src = `/uploads/${filename}`;
          } else {
            console.error("Element with id 'dynamicImage' was not found.");
          }
    } else {
        console.error("No 'file' query parameter found.");
    }
});
