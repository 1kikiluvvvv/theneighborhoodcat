// color.js
document.getElementById('download-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default behavior of the button click
    console.log('Preparing to download');
    downloadData();
});

function downloadData() {
    // Make an AJAX POST request to the server using Axios
    console.log('Download started.');
    document.getElementById('download-preview').innerText = 'Download started.';
    axios.post('/dashboard/color/download', {}, { responseType: 'arraybuffer' })  // Add responseType to the config
        .then(response => {
            // Check if the response is an arraybuffer (binary data)
            if (response.data instanceof ArrayBuffer) {
                // Convert the arraybuffer to a Blob
                const blob = new Blob([response.data]);

                // Trigger the download by creating a temporary link
                console.log('Received Blob response, triggering download');
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'color_data.zip');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Update the download preview with the received data
                console.log('Download complete.');
                document.getElementById('download-preview').innerText = 'Download complete.';
            } else {
                console.error('Invalid response:', response);
                // Handle the case where the response is not as expected
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error if needed
        });
}





//------------------//
//    Add  Handle   //
//------------------//

// Get references to the form and preview elements
const addform = document.getElementById('add-item');

// Listen for form input changes
addform.addEventListener('input', () => updatePreview(addform, 'preview-img1'));


// Update the preview based on form input
function updatePreview(form, imgId) {
    // Capture form data using FormData
    const formData = new FormData(form);

    const imageFile = formData.get('image');

    // Update the preview elements with the form values
    const previewImg = document.getElementById(imgId);


    // Update the preview image if a file is selected
    if (imageFile && imageFile.size > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };

        reader.readAsDataURL(imageFile);
    } else {
        // Use a placeholder image if no file is selected
        previewImg.src = '/assetts/shop/placeholder.jpg';
    }
}



//-----------------------//
//     Remove Handle     //
//-----------------------//


let items; // Initialize the variable
let selectedItems = [];
const itemSelect = document.getElementById('item-select');

fetch('/data/color.json')
    .then(response => response.json())
    .then(data => {
        items = data; // Assign the loaded JSON data to the 'items' variable

        items.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-wrapper'

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'remove-input'
            input.value = item.id;
            input.name = item.id;
            input.id = item.id;
            input.textContent = item.id;

            const label = document.createElement('label');
            label.className = 'label'
            label.htmlFor = item.id;
            label.textContent = item.id;

            wrapper.appendChild(input);
            wrapper.appendChild(label);

            itemSelect.appendChild(wrapper);
        });

        // Add an event listener to the select input to update the preview
        itemSelect.addEventListener('change', () => {
            updateSelectedItems(); // Update selected items when checkboxes change
        });

    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });


function loadImageGallery(selectedItems) {
    const previewGallery = document.querySelector('.preview-gallery');
    previewGallery.innerHTML = ''; // Clear previous images

    let found = false; // Flag to track if at least one item is found

    selectedItems.forEach(itemId => {
        const itemData = items.find(item => item.id === itemId);

        if (itemData && itemData.url) {
            const img = document.createElement('img');
            img.src = '/' + itemData.url; // Prepend a slash to make it an absolute path
            img.alt = `Image ${itemId}`;
            img.className = 'preview-img-remove';
            previewGallery.appendChild(img);
            found = true; // Set the flag to true if an item is found
            console.log(selectedItems)
        }
    });

    // If no item is found, display the placeholder image
    if (!found) {
        const previewGallery = document.querySelector('.preview-gallery');
        previewGallery.innerHTML = '';
        const img = document.createElement('img');
        img.src = '/public/assets/global/placeholder.jpg';
    }
}

// Function to update selected items
function updateSelectedItems() {
    selectedItems = Array.from(itemSelect.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    loadImageGallery(selectedItems);
    console.log('Updated Selected Items:', selectedItems);
}


function showImage(index) {
    const previewImages = document.querySelectorAll('.preview-img');

    if (index >= 0 && index < previewImages.length) {
        currentIndex = index;
        console.log('index', index);
        console.log('selectedItems.length)', selectedItems.length);

        // Hide all images
        previewImages.forEach((img, i) => {
            if (i === currentIndex) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
    }
}


const removeSelectedButton = document.getElementById('remove-selected-btn');
removeSelectedButton.addEventListener('click', () => {
    if (selectedItems.length === 0) {
        // Handle case where no items are selected
        return;
    }
    console.log('Selected Items:', selectedItems);

    // Convert selectedItems to a JSON string
    const requestBody = JSON.stringify({ id: selectedItems });

    // Send an HTTP request to your server to remove the selected items using Axios
    axios.post('/dashboard/color/remove-item', requestBody, {
        headers: {
            'Content-Type': 'application/json', // Specify content type as JSON
        },
    })
        .then(response => {
            if (response.status === 200) {
                console.log('Request was successful');
                // Handle the response here
                // You can add a redirect here if needed
                window.location.href = '/dashboard/color/';
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                // Handle the case where the removal request failed
                console.error('Failed to remove items');
            }
        })
        .catch(error => {
            console.error('Error removing items:', error);
        });
});

