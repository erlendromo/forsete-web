export async function checkApiStatus(apiUrl: string): Promise<boolean> {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // or 'HEAD' if you only care about the headers
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the status code is in the range of successful responses (200-299)
      if (response.ok) {
        console.log("API is up and running!");
        return true;
      } else {
        console.error(`API returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      return false;
    }
  }
  

  export async function getModels(apiUrl: string): Promise<Model[]> {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const models: Model[] = await response.json();
        return models;
      } else {
        console.error("Error: Unable to get response. Status code:", response.status);
        return []; // Return an empty array or handle it as per your use case
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      return []; // Return an empty array in case of an error
    }
  }
  

