// --- Element Selectors ---
const form = document.getElementById('user-input-form');
const input = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const placeholder = document.getElementById('placeholder');
const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');
const newChatButton = document.getElementById('new-chat-button');
const supportButton = document.getElementById('support-button');
const supportModal = document.getElementById('support-modal');
const closeModalButton = document.getElementById('close-modal-button');
const pastChatsList = document.getElementById('past-chats-list');
const chatContainer = document.getElementById('chat-container');
const fieldsIcon = document.getElementById('fields-icon');
const fieldsMenu = document.getElementById('fields-menu');
const fieldOptions = document.querySelectorAll('.field-option');

// --- State Management ---
let allChats = [];
let currentChatId = null;
let activeField = 'general';
const fieldPrompts = {
    general: "You are a general-purpose AI assistant. Be helpful and concise.",
    medical: "You are a specialized medical AI assistant. Provide information for educational purposes, focusing on medical terminology, conditions, and treatments. Always include a disclaimer that you are not a real doctor and the user should consult a healthcare professional.",
    study: "You are a friendly and encouraging study assistant. Help users understand complex topics, create study plans, summarize text, and offer preparation tips for exams. Break down information into easy-to-digest points."
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', loadAllChats);
form.addEventListener('submit', handleFormSubmit);
newChatButton.addEventListener('click', startNewConversation);

menuIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSidebar();
});

chatContainer.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
        toggleSidebar();
    }
});

supportButton.addEventListener('click', () => supportModal.classList.remove('modal-hidden'));
closeModalButton.addEventListener('click', () => supportModal.classList.add('modal-hidden'));

fieldsIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    fieldsMenu.classList.toggle('hidden');
});

fieldOptions.forEach(option => {
    option.addEventListener('click', () => {
        activeField = option.getAttribute('data-field');
        input.placeholder = `Ask the ${option.textContent}...`;
        fieldsMenu.classList.add('hidden');
    });
});

document.addEventListener('click', () => {
    if (!fieldsMenu.classList.contains('hidden')) {
        fieldsMenu.classList.add('hidden');
    }
});

// --- Main Functions ---
function toggleSidebar() {
    sidebar.classList.toggle('open');
    menuIcon.classList.toggle('hidden');
}

function startNewConversation() {
    currentChatId = null;
    chatWindow.innerHTML = '';
    chatWindow.style.display = 'none';
    placeholder.style.display = 'flex';
    activeField = 'general';
    input.placeholder = 'Ask me anything...';
    if (sidebar.classList.contains('open')) {
        toggleSidebar();
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const userMessage = input.value.trim();
    if (userMessage) {
        if (!currentChatId) {
            startNewChatSession(userMessage);
        }
        addMessage(userMessage, 'user-message');
        saveMessageToHistory(userMessage, 'user');
        input.value = '';

        const n8nWebhookUrl = 'https://joshith.app.n8n.cloud/webhook/24c00ddf-4005-419b-b5b2-6384b3b86c09';
        const systemPrompt = fieldPrompts[activeField];

        const thinkingMessage = addMessage('...', 'bot-message');

        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMessage: userMessage,
                systemPrompt: systemPrompt
            })
        })
        .then(response => response.text())
        .then(botResponse => {
            thinkingMessage.querySelector('.text').textContent = botResponse; 
            saveMessageToHistory(botResponse, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            thinkingMessage.querySelector('.text').textContent = 'Error connecting to the brain.';
            saveMessageToHistory('Error connecting to the brain.', 'bot');
        });
    }
}

function addMessage(text, className) {
    if (placeholder.style.display !== 'none') {
        placeholder.style.display = 'none';
        chatWindow.style.display = 'flex';
        chatWindow.style.flexDirection = 'column';
    }
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = className === 'user-message' ? 'U' : 'J';
    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.textContent = text;
    messageElement.appendChild(avatar);
    messageElement.appendChild(textElement);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageElement;
}

// --- Chat History Functions ---
function startNewChatSession(firstMessage) {
    currentChatId = Date.now();
    const newChat = {
        id: currentChatId,
        title: firstMessage.substring(0, 30),
        history: [],
        field: activeField
    };
    allChats.unshift(newChat);
    renderPastChats();
}

function saveMessageToHistory(text, sender) {
    const chat = allChats.find(c => c.id === currentChatId);
    if (chat) {
        chat.history.push({ sender, text });
        localStorage.setItem('josh_gpt_chats', JSON.stringify(allChats));
    }
}

function loadAllChats() {
    const savedChats = localStorage.getItem('josh_gpt_chats');
    if (savedChats) {
        allChats = JSON.parse(savedChats);
        renderPastChats();
    }
}

function renderPastChats() {
    pastChatsList.innerHTML = '';
    allChats.forEach(chat => {
        const chatLink = document.createElement('a');
        chatLink.textContent = chat.title;
        chatLink.onclick = () => loadSpecificChat(chat.id);
        pastChatsList.appendChild(chatLink);
    });
}

function loadSpecificChat(chatId) {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
        currentChatId = chatId;
        activeField = chat.field || 'general';
        // Corrected variable name below
        input.placeholder = `Ask the ${activeField.charAt(0).toUpperCase() + activeField.slice(1)} GPT...`;
        chatWindow.innerHTML = '';
        chat.history.forEach(msg => {
            addMessage(msg.text, msg.sender === 'user' ? 'user-message' : 'bot-message');
        });
        if (sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    }
}
