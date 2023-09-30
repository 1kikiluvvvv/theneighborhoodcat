//----------------------------------------------------------------------------------------------------//



// Here you can add new sheets to the array, 
// Put the images into the sheets folder and
// call the path of the image here.
var imageArray = [
    /*
    "/public/assets/gallery/color/sheets/1.png",
    "/public/assets/gallery/color/sheets/2.png",
    "/public/assets/gallery/color/sheets/3.png",
    "/public/assets/gallery/color/sheets/4.png",
    "/public/assets/gallery/color/sheets/5.png",
    "/public/assets/gallery/color/sheets/6.png",
    "/public/assets/gallery/color/sheets/7.png",
    "/public/assets/gallery/color/sheets/8.png",
    "/public/assets/gallery/color/sheets/9.png",
    "/public/assets/gallery/color/sheets/10.png",
    "/public/assets/gallery/color/sheets/11.png",
    "/public/assets/gallery/color/sheets/12.png",
    "/public/assets/gallery/color/sheets/13.png",
    "/public/assets/gallery/color/sheets/14.png",
    "/public/assets/gallery/color/sheets/15.png",
    "/public/assets/gallery/color/sheets/16.png",
    "/public/assets/gallery/color/sheets/17.png",
    "/public/assets/gallery/color/sheets/18.png",
    "/public/assets/gallery/color/sheets/19.png",
    "/public/assets/gallery/color/sheets/20.png",
    "/public/assets/gallery/color/sheets/21.png",
    "/public/assets/gallery/color/sheets/22.png",
    "/public/assets/gallery/color/sheets/23.png",
    "/public/assets/gallery/color/sheets/24.png",
    "/public/assets/gallery/color/sheets/25.png",
    "/public/assets/gallery/color/sheets/26.png",
    "/public/assets/gallery/color/sheets/27.png",
    "/public/assets/gallery/color/sheets/28.png",
    "/public/assets/gallery/color/sheets/29.png",
    "/public/assets/gallery/color/sheets/30.png",
    "/public/assets/gallery/color/sheets/31.png",
    "/public/assets/gallery/color/sheets/32.png",
    "/public/assets/gallery/color/sheets/33.png",
    "/public/assets/gallery/color/sheets/34.png",
    "/public/assets/gallery/color/sheets/35.png",
    "/public/assets/gallery/color/sheets/36.png",
    "/public/assets/gallery/color/sheets/37.png",
    "/public/assets/gallery/color/sheets/38.png",
    "/public/assets/gallery/color/sheets/39.png",
    "/public/assets/gallery/color/sheets/40.png",
    "/public/assets/gallery/color/sheets/41.png",
    "/public/assets/gallery/color/sheets/42.png"
    */
];

var linkUrl = "https://form.jotform.com/232376224013042"; // Jotform URL




//----------------------------------------------------------------------------------------------------//



var imageGallery = document.getElementById("imageGallery");

imageArray.forEach(function (imageUrl) {
    var imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    var anchor = document.createElement("a");
    anchor.href = linkUrl;
    anchor.target = "_blank";

    var img = document.createElement("img");
    img.src = imageUrl;
    img.className = 'image';

    anchor.appendChild(img);
    imageContainer.appendChild(anchor);
    imageGallery.appendChild(imageContainer);
});



function toggleScrollButton() {
    var button = document.getElementById('up-container');
    if (window.scrollY > 200) {
        button.classList.add('arrow-show'); 
    } else {
        button.classList.remove('arrow-show'); 
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', toggleScrollButton);
document.getElementById('up-container').addEventListener('click', scrollToTop);


toggleScrollButton();

