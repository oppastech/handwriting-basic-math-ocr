const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");
const cropButton = document.getElementById("cropButton");
const processButton = document.getElementById("processButton");
const croppedImagePreview = document.getElementById("croppedImagePreview");
const gradioApp = document.getElementById("gradioApp");

let image = new Image();
let startX, startY, endX, endY;

// Resize image to fit within a width of 640px
function resizeImage(img) {
    const MAX_WIDTH = 640;

    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
}

// Handle image upload
imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        image.src = e.target.result;

        image.onload = function () {
            resizeImage(image);
        };
    };
    reader.readAsDataURL(file);
});

// Select portion of the image for cropping
let isSelecting = false;

canvas.addEventListener("mousedown", (e) => {
    isSelecting = true;

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    ctx.strokeStyle = "red";
});

canvas.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;

    // Redraw the image and draw selection rectangle
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener("mouseup", () => {
    isSelecting = false;
});

// Crop the selected area
cropButton.addEventListener("click", () => {
    if (!startX || !startY || !endX || !endY) return;

    const cropWidth = endX - startX;
    const cropHeight = endY - startY;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(
        canvas,
        startX,
        startY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    );

    // Display cropped image preview
    croppedImagePreview.src = croppedCanvas.toDataURL();
});

// Process the cropped image (send to Hugging Face Gradio app)
processButton.addEventListener("click", () => {
    if (!croppedImagePreview.src) return;

    // Pass the cropped image to your Hugging Face Gradio app
    gradioApp.src =
        "https://your-huggingface-space-url.hf.space?image=" +
        encodeURIComponent(croppedImagePreview.src);
});
