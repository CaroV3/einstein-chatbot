const chatBox = document.getElementById('chatBox');
const userInputElement = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
let isWaiting = false; // voorkomt dubbele invoer tijdens AI-reactie

// Toon bestaande localStorage berichten
chatHistory.forEach(([role, text]) => {
    const div = document.createElement('div');
    div.classList.add(role);
    div.textContent = role === 'human' ? `Jij: ${text}` : `Einstein: ${text}`;
    chatBox.appendChild(div);
});

// Versturen bij klik
sendButton.addEventListener('click', async () => {
    if (isWaiting) return;

    const userInput = userInputElement.value.trim();
    if (!userInput) return;

    isWaiting = true;
    sendButton.disabled = true;
    userInputElement.disabled = true;

    // Voeg menselijke input toe aan UI
    const userMessage = document.createElement('div');
    userMessage.classList.add('human');
    userMessage.textContent = `Jij: ${userInput}`;
    chatBox.appendChild(userMessage);

    userInputElement.value = '';

    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, history: chatHistory })
        });

        if (!response.ok) throw Error(`Status ${response.status}`);

        const data = await response.json();
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('ai');
        aiMessage.textContent = `Einstein: ${data.message}`;
        chatBox.appendChild(aiMessage);

        chatHistory.push(["human", userInput]);
        chatHistory.push(["ai", data.message]);
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('ai');
        errorMsg.textContent = `Einstein: Sorry, hier kan ik geen antwoord op geven. Heb je nog een andere vraag?`;
        chatBox.appendChild(errorMsg);
    } finally {
        isWaiting = false;
        sendButton.disabled = false;
        userInputElement.disabled = false;
        userInputElement.focus();
    }
});

// Versturen met Enter
userInputElement.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendButton.click();
    }
});
