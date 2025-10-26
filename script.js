const imageUpload = document.getElementById("imageUpload");
const generateBtn = document.getElementById("generateBtn");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

let uploadedImage = null;

// Upload image
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      uploadedImage = img;
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(file);
});

// Generate caption (currently random)

const HUGGINGFACE_API_KEY = "process.env.HUGGINGFACE_API_KEY;"; 

async function getCaption(promptText = "funny meme caption about daily life") {
  const API_URL = "https://api-inference.huggingface.co/models/gpt2";

  const headers = {
    "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json"
  };

  const body = JSON.stringify({
    inputs: promptText,
    parameters: {
      max_new_tokens: 20,
      temperature: 0.9,
      top_p: 0.9
    }
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body
    });

    const result = await response.json();
    console.log(result); // optional: for debugging

    // Extract the generated text
    if (result && Array.isArray(result) && result[0]?.generated_text) {
      let caption = result[0].generated_text.trim();
      caption = caption.replace(/\n/g, " ").slice(0, 120); // shorten if too long
      return caption;
    } else {
      return "When code works on the first try 😂";
    }
  } catch (error) {
    console.error(error);
    return "AI lost connection... meme later!";
  }
}

// Draw caption on canvas
generateBtn.addEventListener("click", () => {
  if (!uploadedImage) return alert("Please upload an image first!");
  
  const caption = getCaption();

  ctx.drawImage(uploadedImage, 0, 0);
  ctx.font = "40px Impact";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.textAlign = "center";
  ctx.fillText(caption, canvas.width / 2, 50);
  ctx.strokeText(caption, canvas.width / 2, 50);
});

// Download meme
downloadBtn.addEventListener("click", () => {
  const link = canvas.toDataURL("image/png");
  downloadBtn.href = link;
});

