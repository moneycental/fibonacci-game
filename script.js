// script.js

const fibonacciSequence = [
    0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
    4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229,
    832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169,
    63245986, 102334155, 165580141, 267914296, 433494437, 701408733, 1134903170,
    1836311903, 2971215073, 4807526976, 7778742049
];
let currentIndex = 0; // Track the current Fibonacci index
const numberBar = document.getElementById("number-bar");

// Function to create explosion bits
function createBits(parentDiv, centerX, centerY) {
    const bitCount = 10; // Increased for more dramatic explosions
    const colors = ["#FF5733", "#FFC300", "#C70039", "#900C3F"];

    for (let i = 0; i < bitCount; i++) {
        const bit = document.createElement("div");
        bit.classList.add("explode-bit");

        bit.style.left = `${centerX - 4}px`;
        bit.style.top = `${centerY - 4}px`;
        bit.style.backgroundColor = colors[i % colors.length];

        parentDiv.appendChild(bit);

        // Animate each bit flying in random directions with GSAP
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = Math.random() * 80 + 20;

        gsap.to(bit, {
            x: Math.cos(randomAngle) * randomDistance,
            y: Math.sin(randomAngle) * randomDistance,
            scale: Math.random() + 0.5,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => bit.remove() // Remove bit after animation
        });
    }
}

// Function to animate the number
function animateNumber(number, isCorrect) {
    const numberDiv = document.createElement("div");
    numberDiv.classList.add("number");
    if (!isCorrect) numberDiv.classList.add("wrong");
    numberDiv.innerText = number;

    numberBar.appendChild(numberDiv);

    if (!isCorrect) {
        // Animate incorrect number: Drop halfway and explode
        gsap.fromTo(
            numberDiv,
            { y: -50, opacity: 1 },
            {
                y: 20, // Drop to slightly above the bottom
                opacity: 1,
                duration: 0.5,
                ease: "power1.in",
                onComplete: () => {
                    const rect = numberDiv.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2 - numberBar.offsetLeft;
                    const centerY = rect.top + rect.height / 2 - numberBar.offsetTop;

                    createBits(numberBar, centerX, centerY);
                    numberDiv.remove(); // Remove the incorrect number
                }
            }
        );
    } else {
        // Animate correct number: Drop fully to the bottom
        gsap.fromTo(
            numberDiv,
            { y: -50, opacity: 1 },
            {
                y: 0, // Align at the bottom
                opacity: 1,
                duration: 1,
                ease: "bounce.out" // Bounce as it lands
            }
        );
    }
}

// Function to show a message
function showMessage(text, isSuccess) {
    const messageDiv = document.createElement("div");
    messageDiv.innerText = text;
    messageDiv.classList.add(isSuccess ? "message-success" : "message-error");
    document.getElementById("game-container").appendChild(messageDiv);

    // Remove message after 2 seconds
    setTimeout(() => messageDiv.remove(), 2000);
}

// Function to handle the submission
function handleSubmit() {
    const input = document.getElementById("fibonacci-input").value.trim();
    const number = parseInt(input, 10);

    if (isNaN(number)) {
        showMessage("Please enter a valid number.", false);
        return;
    }

    if (number === fibonacciSequence[currentIndex]) {
        // Correct number in sequence
        animateNumber(number, true);
        showMessage(`${number} is correct!`, true);
        currentIndex++; // Move to the next number
    } else if (fibonacciSequence.includes(number)) {
        // Correct number but out of sequence
        showMessage(`${number} is out of sequence!`, false);
        animateNumber(number, false);
    } else {
        // Not a Fibonacci number
        showMessage(`${number} is not a Fibonacci number.`, false);
        animateNumber(number, false);
    }

    document.getElementById("fibonacci-input").value = "";
}

// Reset Button Logic
document.getElementById("reset-button").addEventListener("click", () => {
    currentIndex = 0; // Reset the index
    numberBar.innerHTML = ""; // Clear the number bar
    showMessage("Game reset! Start with 0", true);
});

// Add event listeners for both the Submit button and Enter key
document.getElementById("submit-button").addEventListener("click", handleSubmit);

// Add Enter key functionality
document.getElementById("fibonacci-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSubmit();
    }
});
