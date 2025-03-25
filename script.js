const form = document.getElementById("uploadForm");
const resultsDiv = document.getElementById("results");
const originalExpressionEl = document.getElementById("originalExpression");
const displayExpressionEl = document.getElementById("displayExpression");
const spaceExpressionEl = document.getElementById("spaceExpression");
const solvedExpressionEl = document.getElementById("solvedExpression");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("imageInput");
  
  if (!fileInput.files.length) {
    alert("Please upload an image.");
    return;
  }

  const file = fileInput.files[0];
  
  // Prepare form data
  const formData = new FormData();
  formData.append("data", file);

  try {
    // Replace 'your_huggingface_space_url' with your actual Hugging Face Space API URL
    // Note: This URL is likely incorrect; you need to use the actual API endpoint for your Space
    const response = await fetch("https://api-inference.huggingface.co/models/oppastech/handwriting-math-ocr", {
      method: "POST",
      body: formData,
      headers: {
        // If authentication is required, include your API token here
        "Authorization": "Bearer YOUR_API_TOKEN",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();

    // Update results section
    // Note: The structure of 'result' might vary based on your API's response format
    originalExpressionEl.textContent = result.original_expression || "N/A";
    displayExpressionEl.textContent = result.display_expression || "N/A";
    spaceExpressionEl.textContent = result.space_expression || "N/A";
    solvedExpressionEl.textContent = result.solved_expression || "N/A";

    resultsDiv.classList.remove("hidden");
    
  } catch (error) {
    alert(`Failed to process the image. ${error.message}`);
    console.error(error);
  }
});
