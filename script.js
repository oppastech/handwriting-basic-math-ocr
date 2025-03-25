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
    // Replace 'your_huggingface_space_url' with your actual Hugging Face Space URL
    const response = await fetch("https://huggingface.co/spaces/oppastech/handwriting-math-ocr", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();

    // Update results section
    originalExpressionEl.textContent = result.data[0].original_expression || "N/A";
    displayExpressionEl.textContent = result.data[0].display_expression || "N/A";
    spaceExpressionEl.textContent = result.data[0].space_expression || "N/A";
    solvedExpressionEl.textContent = result.data[0].solved_expression || "N/A";

    resultsDiv.classList.remove("hidden");
    
  } catch (error) {
    alert(`Failed to process the image. ${error.message}`);
    console.error(error);
  }
});
