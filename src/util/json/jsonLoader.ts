// jsonLoader.ts
  
  export async function getData() {
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    try {
      const res = await fetch(`uploads/${encodeURIComponent(fileParam || "")}.json`);
      const jsonData = await res.json();
      return jsonData;
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      return {};
    }
  }
  
  // Call main function on page load
  window.addEventListener('DOMContentLoaded', getData);
  