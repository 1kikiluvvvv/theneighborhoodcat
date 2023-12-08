const textElement = document.getElementById('hero-text');
const cursorElement = document.querySelector('.cursor');

const textToType = "DM me on Instagram for all questions";
const typingDelay = 50; // Adjust the delay for typing each character
const cursorDelay = 500; // Delay before cursor starts blinking
const startDelay = 1000; // Delay before typing animation starts

let charIndex = 0;

function startTypingAnimation() {
    setTimeout(typeCharacter, startDelay);
}

function typeCharacter() {
    if (charIndex < textToType.length) {
        textElement.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor"></span>';
        charIndex++;
        setTimeout(typeCharacter, typingDelay);
    } else {
        blinkCursor(); // Start cursor blinking without resetting the animation
    }
}

function blinkCursor() {
    cursorElement.style.opacity = '0';
    setInterval(toggleCursor, cursorDelay);
}

function toggleCursor() {
    cursorElement.style.opacity = cursorElement.style.opacity === '0' ? '1' : '0';
}

setTimeout(startTypingAnimation, startDelay);
