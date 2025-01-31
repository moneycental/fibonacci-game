// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const fibonacciSequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    let currentIndex = 0;
    let score = 0;
    let dropSpeed = 2;
    let isGameOver = false;

    // Get references
    const gameContainer = document.getElementById("game-container");

    // Create Windows 7-style number bar window dynamically
    const numberBarWindow = document.createElement("div");
    numberBarWindow.classList.add("window");

    // Add title bar
    const titleBar = document.createElement("header");
    titleBar.classList.add("title-bar");
    titleBar.innerHTML = `
        <span class="title-bar-text">Number Bar</span>
        <div class="title-bar-controls">
            <button aria-label="Minimize" class="minimize-btn"></button>
            <button aria-label="Close" class="close-btn"></button>
        </div>
    `;

    // Create number bar container
    const windowBody = document.createElement("div");
    windowBody.classList.add("window-body");
    windowBody.id = "number-bar";

    // Append everything
    numberBarWindow.appendChild(titleBar);
    numberBarWindow.appendChild(windowBody);
    gameContainer.appendChild(numberBarWindow);

    // Styling for Windows 7-like appearance
    const style = document.createElement("style");
    style.textContent = `
        .window {
            margin: 20px auto;
            width: 800px;
            border: 2px solid #a9a9a9;
            border-radius: 6px;
            box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            background: #ffffff;
        }
        .title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(to bottom, #ececec, #d4d4d4);
            border: 1px solid #a9a9a9;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            padding: 0.5rem;
            font-size: 14px;
            font-weight: bold;
            color: black;
            cursor: default;
        }
        .title-bar-text {
            font-family: "Segoe UI", Tahoma, sans-serif;
            font-size: 12px;
        }
        .title-bar-controls {
            display: flex;
            gap: 4px;
        }
        .title-bar-controls button {
            width: 16px;
            height: 16px;
            border: 1px solid #a9a9a9;
            border-radius: 2px;
            background: #f3f3f3;
            cursor: pointer;
        }
        .title-bar-controls button:hover {
            background: #d6d6d6;
        }
        .window-body {
            padding: 10px;
            background: #e0e0e0;
            display: flex;
            align-items: flex-end;
            gap: 10px;
            height: 50px;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }
        .number {
            padding: 5px 10px;
            background: #4caf50;
            color: white;
            border-radius: 4px;
            font-size: 18px;
            text-align: center;
            margin-right: 10px;
            display: inline-block;
            position: relative;
        }
        .number.wrong {
            background: #ff5733;
        }
    `;
    document.head.appendChild(style);

    // Minimize and close button functionality
    const minimizeBtn = numberBarWindow.querySelector(".minimize-btn");
    const closeBtn = numberBarWindow.querySelector(".close-btn");

    minimizeBtn.addEventListener("click", () => {
        windowBody.style.display = windowBody.style.display === "none" ? "flex" : "none";
    });

    closeBtn.addEventListener("click", () => {
        numberBarWindow.style.display = "none";
    });

    // Score Display
    const scoreDisplay = document.createElement("div");
    scoreDisplay.innerText = "Score: 0";
    scoreDisplay.className = "score-display";
    gameContainer.appendChild(scoreDisplay);

    // Input Field
    const inputField = document.createElement("input");
    inputField.type = "number";
    inputField.placeholder = "Enter Fibonacci Number";
    inputField.className = "field";
    gameContainer.appendChild(inputField);

    // Submit Button
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.className = "button primary";
    gameContainer.appendChild(submitButton);

    // Function to slide numbers left when the number bar is full
    function slideNumbers() {
        const numbers = windowBody.querySelectorAll(".number");
        let totalWidth = 0;

        numbers.forEach((num) => {
            totalWidth += num.offsetWidth + 10; // Add spacing
        });

        if (totalWidth > windowBody.offsetWidth) {
            gsap.to(numbers, {
                x: "-=60", // Move all numbers left by 60px
                duration: 0.5,
                ease: "power1.out",
            });
        }
    }

    // Function to check input and add numbers
    function checkInput() {
        const inputValue = parseInt(inputField.value, 10);
        if (inputValue === fibonacciSequence[currentIndex]) {
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
            currentIndex++;

            // Add number to number bar
            const numberDiv = document.createElement("div");
            numberDiv.className = "number";
            numberDiv.innerText = inputValue;
            windowBody.appendChild(numberDiv);

            // Animate number drop
            gsap.fromTo(
                numberDiv,
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }
            );

            // Slide numbers if necessary
            slideNumbers();
        } else {
            endGame();
        }

        inputField.value = "";
    }

    // Function to end the game
    function endGame() {
        isGameOver = true;
        alert(`Game Over! Your score: ${score}`);
    }

    // Event Listeners
    submitButton.addEventListener("click", checkInput);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkInput();
        }
    });
});
