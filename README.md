Josh GPT - AI Chatbot 🤖
A custom-built, AI-powered chatbot that emulates the functionality of large language models like ChatGPT in a minimal, fully responsive web application. The frontend, crafted with HTML, CSS, and JavaScript, features a dynamic landing page, a modern dark-mode chat interface optimized for both desktop and mobile, and includes advanced UI elements like a chat history sidebar and a "typing" indicator. The entire backend is visually programmed in n8n, which uses a webhook to receive user messages and connects to the high-speed Groq API to generate specialized, persona-based responses from the Llama 3 language model. The complete project is version-controlled with Git and deployed live on the web using GitHub Pages, representing a comprehensive, end-to-end example of modern web and AI application development.

✨ Live Demo
Check out the live version: https://joshith018.github.io/Josh-GPT/

🚀 Features
Frontend
Dynamic Landing Page: An interactive landing page with an animated, mouse-reactive background.

Modern Chat UI: A clean, dark-mode chat interface modeled after professional AI platforms.

Fully Responsive: Looks and works great on both desktop and mobile devices.

Chat History: A slide-out sidebar (accessed via the 3-dots icon) that saves and re-loads past conversations using browser localStorage.

Persona Selection: A "Fields" menu (globe icon) to select different AI personas (General, Medical, Study Assistant).

Typing Indicator: A subtle animation that shows when the AI is processing a response.

Backend
Visual Backend: Built entirely with n8n, replacing the need for a traditional coded server.

High-Speed AI: Integrated with the Groq API to use the Llama 3 model for incredibly fast responses.

System Prompts: Uses the selected frontend persona to send specific instructions to the AI, guiding its answers.

🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Backend: n8n (Visual Workflow Automation)

AI: Groq API (Llama 3 Model)

Deployment: Git & GitHub Pages

🔧 How to Run Locally
To run this project on your own machine, you need to set up both the frontend (this repository) and the backend (in n8n).

1. Frontend
Clone this repository:

Bash

git clone https://github.com/joshith018/Josh-GPT.git
Navigate to the project folder:

Bash

cd Josh-GPT
2. Backend (n8n Workflow)
Sign up for n8n: Get a free account on n8n Cloud.

Create a New Workflow:

Node 1: Webhook

This node receives messages from the chatbot.

Set Respond to Using Respond to Webhook Node.

Set Respond to Preflight... to ON (to fix CORS).

Node 2: HTTP Request

This node calls the Groq AI.

Method: POST

URL: https://api.groq.com/openai/v1/chat/completions

Authentication: Header Auth

Name: Authorization

Value: Bearer YOUR_GROQ_API_KEY_HERE (Get a free key from GroqCloud)

Body (JSON):

JSON

{
  "model": "llama3-8b-8192",
  "messages": [
    {
      "role": "system",
      "content": "{{ $json.body.systemPrompt }}"
    },
    {
      "role": "user",
      "content": "{{ $json.body.userMessage }}"
    }
  ]
}
Node 3: Respond to Webhook

This node sends the AI's answer back to the chatbot.

Respond With: Text

Response Body (Text):

{{ $('HTTP Request').item.json.choices[0].message.content }}
Activate Your Workflow: Save and Activate the workflow to get your Production URL.

3. Connect Frontend to Backend
Open the script.js file in your local project folder.

Find the n8nWebhookUrl variable and paste your n8n Production URL:

JavaScript

const n8nWebhookUrl = 'PASTE_YOUR_N8N_PRODUCTION_URL_HERE';
Save the file. You can now open index.html in your browser to run the chatbot locally.
