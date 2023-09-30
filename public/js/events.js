// Fetch data from the 'events' collection
fetch('/admin/api/collections/events')
    .then((response) => response.json())
    .then((data) => {
        data.entries.forEach(function (imageInfo) {
            var imageContainer = document.createElement("div");
            imageContainer.className = "image-container";

            var anchor = document.createElement("a");
            anchor.href = imageInfo.linkUrl; // Assuming you have a 'linkUrl' property in your CMS data
            anchor.target = "_blank";

            var img = document.createElement("img");
            img.src = imageInfo.imageUrl; // 'imageUrl' property from your CMS data
            img.className = 'image';

            anchor.appendChild(img);
            imageContainer.appendChild(anchor);
            imageGallery.appendChild(imageContainer);
        });
    });

