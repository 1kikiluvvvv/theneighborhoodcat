// Assuming your JSON data is available in a variable called 'items'
const items = window.items;
const imageGallery = document.getElementById('imageGallery');

// Loop through the 'items' array and create <img> elements for each image URL
items.forEach((imageUrl) => {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Image';
  
  // Append the <img> element to the 'imageGallery' div
  imageGallery.appendChild(img);
});




