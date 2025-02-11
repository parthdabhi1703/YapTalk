// Get the socket.io instance
const socket = io('http://127.0.0.1:8000');

// Get DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".chat-messages"); // Corrected

// Audio for receiving messages
var audio = new Audio('ting.mp3');

// Function to append system messages (e.g., join/leave notifications)
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);

    if (position === 'left') {
        audio.play();
    }
};

// Function to append chat messages
function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "You") {
        messageDiv.classList.add("outgoing");
    } else {
        messageDiv.classList.add("incoming");
    }

    messageDiv.innerHTML = `
        <div class="message-bubble">
            <div>${message}</div>
            <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
    `;

    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to bottom
}

// Ask user for their name and notify server
const name = prompt("Enter your name to join");
// Select the name div and update its text
if (name) {
    document.getElementById("user-name").innerText = name;
}

socket.emit('new-user-joined', name);

// Listen for new user joining
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// Listen for incoming messages
socket.on('receive', data => {
    appendMessage(`${data.message}`, data.name); // Use appendMessage
});

// Listen for user leaving
socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

// Send message on form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim(); // Trim the message to remove whitespace
    if (message !== '') { // Check if the message is not empty
      appendMessage(message, "You"); // Use appendMessage
      socket.emit('send', message);
      messageInput.value = '';
    }
});

// // Select the trash icon element
// const clearMessagesButton = document.getElementById('clear-messages');

// // Add an event listener to the trash icon element
// clearMessagesButton.addEventListener('click', () => {
//   // Select the chat messages container
//   const chatMessagesContainer = document.querySelector('.chat-messages');

//   // Clear all chat messages
//   chatMessagesContainer.innerHTML = '';
// });