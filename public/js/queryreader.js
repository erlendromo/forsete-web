
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    // Checks for file as key
    const filename = params.get('file');

    if (filename) {
        // Update the image to display from the uploads folder
        document.getElementById("dynamicImage").src = `/uploads/${filename}`;
    } else {
        console.error("No 'file' query parameter found.");
    }
});
