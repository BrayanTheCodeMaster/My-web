let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;
let messages = [];
let uploadedFile = null;

// Show Sign-Up or Sign-In Options
function showSignUpForm() {
    document.getElementById("authChoice").style.display = "none";
    document.getElementById("authForm").style.display = "block";
}

function showSignInForm() {
    document.getElementById("authChoice").style.display = "none";
    document.getElementById("authForm").style.display = "block";
}

// Authenticate User
function authenticateUser() {
    const username = document.getElementById("authUsername").value;
    const password = document.getElementById("authPassword").value;

    if (username && password) {
        if (!users[username]) {
            users[username] = { username, password };
            localStorage.setItem("users", JSON.stringify(users));
        } else if (users[username].password !== password) {
            alert("Incorrect password.");
            return;
        }
        currentUser = username;
        document.getElementById("authModal").style.display = "none";
        updateMemberList();
    } else {
        alert("Please enter both username and password.");
    }
}

// Update Member List
function updateMemberList() {
    const memberListDiv = document.getElementById("memberList");
    memberListDiv.innerHTML = '';
    Object.keys(users).forEach(user => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.onclick = () => openPrivateChat(user);
        memberDiv.innerHTML = <span class="online-dot"></span>${user};
        memberListDiv.appendChild(memberDiv);
    });
}

// Handle File Input
function handleFile() {
    uploadedFile = document.getElementById('fileInput').files[0];
}

// Send Message
function sendMessage() {
    const messageText = document.getElementById("messageInput").value;

    if (messageText || uploadedFile) {
        const message = {
            sender: currentUser,
            text: messageText,
            file: uploadedFile ? { name: uploadedFile.name, type: uploadedFile.type, url: URL.createObjectURL(uploadedFile) } : null,
            timestamp: new Date(),
            edited: false,
        };
        messages.push(message);
        displayMessages();
        document.getElementById("messageInput").value = '';
        uploadedFile = null;
    }
}

// Display Messages
function displayMessages() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = '';
    messages.forEach((msg, index) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        let filePreview = '';

        if (msg.file) {
            if (msg.file.type.startsWith('image')) {
                filePreview = <img src="${msg.file.url}" alt="${msg.file.name}" style="width:100px; height:auto; margin-top:5px;">;
            } else if (msg.file.type.startsWith('video')) {
                filePreview = <video src="${msg.file.url}" controls style="width:100px; height:auto; margin-top:5px;"></video>;
            } else if (msg.file.type === 'application/pdf') {
                filePreview = <a href="${msg.file.url}" target="_blank">Download PDF: ${msg.file.name}</a>;
            } else if (msg.file.type === 'application/msword' || msg.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                filePreview = <a href="${msg.file.url}" target="_blank">Download Document: ${msg.file.name}</a>;
            }
        }

        messageDiv.innerHTML = `
            <strong>${msg.sender}</strong>: ${msg.text} 
            ${filePreview} 
            <span style="font-size: 12px; color: gray;">(${new Date(msg.timestamp).toLocaleTimeString()})</span>
            ${msg.edited ? '<span style="color: #f39c12;">(Edited)</span>' : ''}
            <span class="edit-button" onclick="editMessage(${index})">Edit</span>
        `;
        chatContainer.appendChild(messageDiv);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Edit Message
function editMessage(index) {
    const newMessage = prompt("Edit your message:", messages[index].text);
    if (newMessage !== null) {
        messages[index].text = newMessage;
        messages[index].edited = true;
        displayMessages();
    }
}

// Open Private Chat
function openPrivateChat(receiver) {
    if (receiver === currentUser) return;

    const privateChatWindow = window.open("", "_blank", "width=400,height=600");
    privateChatWindow.document.write(`
        <h3>Private Chat with ${receiver}</h3>
        <div id="privateChatContainer"></div>
        <input type="text" id="privateMessageInput" placeholder="Type a private message">
        <button onclick="sendPrivateMessage('${receiver}')">Send</button>
    `);
    privateChatWindow.document.close();

    privateChatWindow.sendPrivateMessage = function(receiver) {
        const messageText = privateChatWindow.document.getElementById("privateMessageInput").value;
        const privateMessage = {
            sender: currentUser,
            receiver,
            text: messageText,
            timestamp: new Date(),
        };
        privateChatWindow.document.getElementById("privateChatContainer").innerHTML += `
            <p><strong>${privateMessage.sender}</strong>: ${privateMessage.text}
            <span style="font-size: 12px; color: gray;">(${new Date(privateMessage.timestamp).toLocaleTimeString()})</span></p>
        `;
    };
}

// Initialize the App
window.onload = function() {
    if (!currentUser) {
        document.getElementById("authModal").style.display = "flex";
    }
    updateMemberList();
};