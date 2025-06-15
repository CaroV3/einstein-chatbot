const chatBox = document.getElementById('chatBox');
const userInputElement = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');


let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// Toon bestaande localStorage berichten
chatHistory.forEach(([role, text]) => {
    const div = document.createElement('div');
    div.classList.add(role);
    div.textContent = role === 'human' ? `Jij: ${text}` : `Einstein: ${text}`;
    chatBox.appendChild(div);
});

sendButton.addEventListener('click', async () => {
    const userInput = userInputElement.value.trim();
    if (!userInput) return;

    // Voeg menselijke input toe aan UI en history
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

        if (!response.ok) {
            throw Error(`Status ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('ai');
        aiMessage.textContent = `Einstein: ${data.message}`;
        chatBox.appendChild(aiMessage);
        chatHistory.push(["human", userInput]);
        chatHistory.push(["ai", data.message]);

        // Bewaar in localStorage
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('ai');
        errorMsg.textContent = `Einstein: Sorry, hier kan ik geen antwoord op geven. Heb je nog een andere vraag?`;
        chatBox.appendChild(errorMsg);
    }
});

userInputElement.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendButton.click();
    }
});