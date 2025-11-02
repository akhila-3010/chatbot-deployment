class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'), // the open chat button
            chatBox: document.querySelector('.chatbox__support'), // chat window
            sendButton: document.querySelector('.send__button') // send message button
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        // Toggle chatbox open/close
        openButton.addEventListener('click', () => this.toggleState(chatBox));

        // Send message on button click
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // Send message when pressing Enter
        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        chatbox.classList.toggle('chatbox--active', this.state);
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const userMessage = textField.value.trim();

        if (userMessage === "") return;

        // Push user message
        this.messages.push({ name: "User", message: userMessage });
        this.updateChatText(chatbox);
        textField.value = '';

        // 🌐 Send request to Flask API hosted on Render
        fetch("https://chatbot-deployment-4ldi.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            // Push bot reply
            this.messages.push({ name: "Sam", message: data.answer });
            this.updateChatText(chatbox);
        })
        .catch(error => {
            console.error("Error:", error);
            this.messages.push({ name: "Sam", message: "Error connecting to server." });
            this.updateChatText(chatbox);
        });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(item => {
            if (item.name === "Sam") {
                html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            }
        });

        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
        chatMessage.scrollTop = chatMessage.scrollHeight;
    }
}

// 🚀 Initialize chatbot
const chatbox = new Chatbox();
chatbox.display();
