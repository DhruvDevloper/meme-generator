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
const HUGGING_FACE_TOKEN = process.env.HF_TOKEN;

async function generateCaption() {
  const image = document.getElementById("uploadedImage")?.src;
  const promptInput = document.getElementById("promptInput")?.value || "";

  const finalPrompt = `
You are a viral meme caption writer. Write a short, punchy, hilarious, and relatable meme caption for the uploaded image.
Avoid describing the image literally. Never use {} or []. Be sarcastic, ironic, or darkly funny.
Example tones:
- When you realize tomorrow is Monday 😩
- Me trying to act normal after 3 hours of crying 💀
- POV: you said “I’ll sleep early”
User custom idea: ${promptInput}
  `;

  const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + HUGGING_FACE_TOKEN, // replace this
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: finalPrompt })
  });

  const data = await response.json();
  const caption = data[0]?.generated_text || "When AI forgets how to joke 😂";
  document.getElementById("captionDisplay").innerText = caption;
}


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



