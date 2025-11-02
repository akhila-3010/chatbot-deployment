class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") this.onSendButton(chatBox);
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        chatbox.classList.toggle('chatbox--active', this.state);
    }

    async onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const userMessage = textField.value.trim();
        if (userMessage === "") return;

        // Push user message immediately
        this.messages.push({ name: "User", message: userMessage });
        this.updateChatText(chatbox);
        textField.value = '';

        try {
            const response = await fetch("https://chatbot-deployment-4ldi.onrender.com/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            // Check if response is valid JSON
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response type (expected JSON).");
            }

            const data = await response.json();
            this.messages.push({ name: "Sam", message: data.answer });
        } 
        catch (error) {
            console.error("Error:", error);
            this.messages.push({ name: "Sam", message: "⚠️ Server error. Please try again later." });
        }

        this.updateChatText(chatbox);
    }

    updateChatText(chatbox) {
        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = this.messages.slice().reverse().map(item => {
            const className = item.name === "Sam"
                ? "messages__item messages__item--operator"
                : "messages__item messages__item--visitor";
            return `<div class="${className}">${item.message}</div>`;
        }).join('');
        
        chatMessage.scrollTop = chatMessage.scrollHeight;
    }
}

// 🚀 Initialize chatbot
const chatbox = new Chatbox();
chatbox.display();
