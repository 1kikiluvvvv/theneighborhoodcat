const closeButton = document.getElementById("burger");
const menu = document.querySelector(".mobile-nav-container");

closeButton.addEventListener("click", () => {
  // Toggle the class on the menu element
  menu.classList.toggle("menu-open");

  // Toggle the class on the burger icon
  closeButton.classList.toggle("ri-close-line");
  closeButton.classList.toggle("ri-menu-line");
});


// Get all buttons with the 'btn' class
const buttons = document.querySelectorAll(".btn");

// Add click event listeners to each button
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Get the value of the 'data-redirect' attribute
    const redirectUrl = button.getAttribute("data-redirect");

    // Check if a redirect URL is specified
    if (redirectUrl) {
      // Add a 500ms (half-second) delay before the redirect
      setTimeout(function () {
        // Redirect to the desired URL
        window.location.href = redirectUrl;
      }, 500); // 500 milliseconds (half-second)
    }
  });
});



(function () {
  'use strict';

  var btnColors = document.querySelectorAll('.btn-color');

  btnColors.forEach(function (p) {
    var chars = p.textContent.split(''),
        length = chars.length,
        shift = -360 / length,
        angle = 0,
        span, t;

    p.innerHTML = chars.map(function (char) {
      return '<span>' + char + '</span>';
    }).join('');

    span = p.children;

    function frame() {
      for (var i = 0; i < length; i++) {
        span[i].style.color = 'hsl(' + (angle + Math.floor(i * shift)) + ', 65%, 75%)';
      }
      angle++;
    }

    t = setInterval(frame, 10);
  });
})();
