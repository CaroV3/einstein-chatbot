// Select DOM elements for chat display, input field, and send button
const chatBox = document.getElementById('chatBox');
const userInputElement = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Load chat history from localStorage, or initialize with an empty array if none exists
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
let isWaiting = false; // Prevents duplicate input while waiting for AI response

// Display any existing chat messages from previous sessions
chatHistory.forEach(([role, text]) => {
    const div = document.createElement('div');
    div.classList.add(role);
    div.textContent = role === 'human' ? `Jij: ${text}` : `Einstein: ${text}`;
    chatBox.appendChild(div);
});

// Send message when the send button is clicked
sendButton.addEventListener('click', async () => {
    // If a response is still pending, do nothing
    if (isWaiting) return;

    const userInput = userInputElement.value.trim();
    // Don't send empty messages
    if (!userInput) return;

    // Indicate the system is waiting for a response
    isWaiting = true;
    sendButton.disabled = true;
    userInputElement.disabled = true;

    // Add user message to chat UI
    const userMessage = document.createElement('div');
    userMessage.classList.add('human');
    userMessage.textContent = `Jij: ${userInput}`;
    chatBox.appendChild(userMessage);

    // Clear the input field
    userInputElement.value = '';

    try {
        // Send the user message and chat history to the backend server
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, history: chatHistory })
        });

        // Handle failed response
        if (!response.ok) throw Error(`Status ${response.status}`);

        // Parse the JSON response from the server
        const data = await response.json();

        // Add AI message to chat UI
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('ai');
        aiMessage.textContent = `Einstein: ${data.message}`;
        chatBox.appendChild(aiMessage);

        // Update chat history with both user and AI messages
        chatHistory.push(["human", userInput]);
        chatHistory.push(["ai", data.message]);

        // Save updated chat history to localStorage
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        // Scroll chat to the bottom so the latest message is visible
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        // Handle any errors by displaying a generic error message
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('ai');
        errorMsg.textContent = `Einstein: Sorry, hier kan ik geen antwoord op geven. Heb je nog een andere vraag?`;
        chatBox.appendChild(errorMsg);
    } finally {
        // Re-enable input and send button for next message
        isWaiting = false;
        sendButton.disabled = false;
        userInputElement.disabled = false;
        userInputElement.focus(); // Return focus to the input field
    }
});

// Also allow sending messages by pressing Enter (without Shift)
userInputElement.addEventListener('keydown', function (event) {
    // Submit on Enter key only (not Shift+Enter for multiline)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent new line
        sendButton.click();     // Trigger click event
    }
});
