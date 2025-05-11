
let checkedModels: { [key: string]: string } = {};

/**
 * Updates the selected models based on the checked radio buttons.
 */
function updateSelectedModels(): void {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    const types = new Set(Array.from(radios).map(r => r.name));

    types.forEach(type => {
        const checked = document.querySelector<HTMLInputElement>(
            `input[name="${type}"]:checked`
        );
        if (checked) {
            checkedModels[type] = checked.id;
        } else {
            delete checkedModels[type];
        }
    });
}



/**
 * Function to get the selected model for a given type.
 * @param modelType The type of model you want to get the selected value for.
 * @returns Returns the selected model name for the given type.
 */
export function getSelectedModel(modelType: string): string {
    updateSelectedModels();
    console.log('Selected model:', checkedModels[modelType]);
    return checkedModels[modelType];
}


document.addEventListener('DOMContentLoaded', () => {
    // Function to get the selected models
    const getSelectedModels = () => {
        // Create an object to store the selected models
        // This will hold the model type as key and the selected radio button id as value

        // Select all radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        // Store the model types in a Set, this is to avoid duplicates
        const modelTypes = new Set(Array.from(radioButtons).map(radioButton => (radioButton as HTMLInputElement).name));

        // Iterate over the model types and find the checked radio button for each type
        modelTypes.forEach(modelType => {
            // Find the checked radio button for the current model type
            const checkedRadio = document.querySelector(`input[name="${modelType}"]:checked`);
            if (checkedRadio) {
                const modelName = checkedRadio.id
                // If a checked radio button is found, add it to the selectedModels object
                checkedModels[modelType] = modelName;
                setSessionItem(modelType, modelName);
                //console.log(`Name: ${(checkedRadio as HTMLInputElement).id}, Type: ${(checkedRadio as HTMLInputElement).name}`);
            }
        });
        return checkedModels;
    };


    // Run once on load
    checkedModels = getSelectedModels();
    postSelectedModels();
    console.log('Selected models:', checkedModels);

    // Add event listeners to update log on change
   document.querySelectorAll('input[type="radio"]').forEach(radioButton => {
  radioButton.addEventListener('change', async () => {
    updateSelectedModels();
    getSelectedModelsFromServer();
    let textModel = getSelectedModel("textrecognition");
    let lineModel = getSelectedModel("linesegmentation");
    console.log('Selected models:', checkedModels);
  });
});});


async function postSelectedModels() {
  updateSelectedModels();
  const textModel = getSessionItem("textrecognition");
  const lineModel = getSessionItem("linesegmentation");

  fetch("/api/selectedModels", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    textModel,
    lineModel
  })
})
  .then(response => response.json())
  .then(data => {
    console.log("Server response:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
}
  

function getSessionItem(modelType: string): string | null {
    return sessionStorage.getItem(modelType);
}

function setSessionItem(keyModelType:string, valueModelName:string): void {
    sessionStorage.setItem(keyModelType, valueModelName);
}

function getSelectedModelsFromServer() {
    throw new Error("Function not implemented.");
}
