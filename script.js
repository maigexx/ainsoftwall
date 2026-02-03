const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const footer = document.getElementById("footer"); // footer element

// THEME TOGGLE
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light");
}

themeBtn.onclick = () => {
    body.classList.toggle("light");
    localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
};

// AUTH
const accountBtn = document.getElementById("accountBtn");
const messageBtn = document.getElementById("messageBtn");
const front = document.getElementById("front");
const account = document.getElementById("account");
const chat = document.getElementById("chat");

// Check if user already has an account
if (localStorage.getItem("ainsoftUser")) {
    accountBtn.classList.add("hidden");
    messageBtn.classList.remove("hidden");
}

// CLICK "MAKE ACCOUNT"
accountBtn.onclick = () => {
    front.classList.add("hidden");
    account.classList.remove("hidden");
    footer.classList.add("hidden"); // hide footer only while creating account
};

// CLICK "CREATE ACCOUNT"
document.getElementById("createAccount").onclick = () => {
    localStorage.setItem("ainsoftUser", "true");
    account.classList.add("hidden");
    front.classList.remove("hidden");
    accountBtn.classList.add("hidden");
    messageBtn.classList.remove("hidden");
    footer.classList.remove("hidden"); // show footer again
};

// CLICK "MESSAGE"
messageBtn.onclick = () => {
    front.classList.add("hidden");
    chat.classList.remove("hidden");
};

// CHAT FUNCTIONALITY
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

// NEW CHAT BUTTON
document.getElementById("newChat").onclick = () => {
    chatBox.innerHTML = "";
};

// SEND MESSAGE
document.getElementById("sendBtn").onclick = () => {
    if (!input.value) return;
    addMessage(input.value, "user");
    setTimeout(() => smartReply(input.value), 800);
    input.value = "";
};

// ADD MESSAGE TO CHAT
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// SMART REPLY SIMULATION
function smartReply(text) {
    let reply = "I'm here with you. Please continue.";

    if (/sad|cry|hurt|pain/i.test(text))
        reply = "I'm really sorry you're going through this. You can take your time.";

    if (/angry|mad|hate/i.test(text))
        reply = "Those feelings are valid. Let it out safely here.";

    if (/stress|tired|overwhelmed/i.test(text))
        reply = "That sounds exhausting. You're not alone in this.";

    addMessage(reply, "bot");
}
