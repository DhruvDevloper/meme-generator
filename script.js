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
function getCaption() {
  const captions = [
    "When you realize it's Monday again",
    "That moment you forgot your homework",
    "AI knows your pain",
    "Me trying to be productive",
    "Just one more meme..."
  ];
  return captions[Math.floor(Math.random() * captions.length)];
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
