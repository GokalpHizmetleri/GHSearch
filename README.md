# GHSearch 🌐✨

![GHSearch](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![HTML/CSS/JS](https://img.shields.io/badge/Tech_Stack-HTML_|_CSS_|_JS-yellow)

GHSearch is a modern, next-generation web search engine built with pure HTML, CSS, and Vanilla JavaScript. It combines the power of **Tavily's real-time web search API** with **Groq's blazing-fast AI inference** to provide users with comprehensive, structured, and intelligent search overviews.

---

## 🚀 Features

- **AI-Powered Overviews**: Before diving into a list of links, GHSearch analyzes live web results using the Groq AI API (powered by `openai/gpt-oss-20b`) to generate a beautifully structured, intelligent summary of your query.
- **Real-Time Web Search**: Integrates with the Tavily Search API to fetch up to 20 highly relevant, up-to-date web results instantly.
- **Markdown Support**: Fully supports Markdown rendering (tables, lists, code blocks) inside AI responses, making complex information incredibly easy to read.
- **Glassmorphism UI**: Features a sleek, single-column dark-themed futuristic interface with smooth animations, neon accents, and a dynamic gradient ASCII logo.
- **Interactive Game Hub**: Includes a built-in modern accordion-style menu for quick access to hosted multiplayer and competitive web games.
- **Client-Side Only**: No backend required! Everything runs directly in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Flexbox), Vanilla JavaScript (ES6+)
- **Markdown Parsing**: [Marked.js](https://marked.js.org/)
- **Search API**: [Tavily API](https://tavily.com/)
- **AI API**: [Groq Cloud](https://groq.com/)

---

## ⚙️ Setup & Installation (API Keys)

Because GHSearch is a purely client-side application, getting it running is incredibly simple. However, **you must add your own API keys** for the search and AI to function.

### 1. Get Your Free API Keys
- Get a free **Groq API Key** from [console.groq.com](https://console.groq.com)
- Get a free **Tavily API Key** from [app.tavily.com](https://app.tavily.com)

### 2. Encode Your Keys to Base64
For basic security and to prevent plain-text keys in your code, you must encode your keys into Base64 format. 

You can do this quickly in any browser console (F12 -> Console):
```javascript
btoa("gsk_your_groq_key_here")
// Output will look like: "Z3NrX3lvdXJfZ3JvcV9rZXlfaGVyZQ=="

btoa("tvly-dev-your_tavily_key_here")
// Output will look like: "dHZseS1kZXYteW91cl90YXZpbHlfa2V5X2hlcmU="
```

### 3. Add Keys to `script.js`
Open `script.js` in your code editor. Around **line 28**, you will see placeholders for the encoded keys. Paste your encoded keys inside the quotation marks:

```javascript
// Base64 Encoded API Keys
const encodedGroqKey = "ENTER_YOUR_BASE64_GROQ_KEY_HERE"; 
const encodedTavilyKey = "ENTER_YOUR_BASE64_TAVILY_KEY_HERE";
```

### 4. Run the App
Simply double-click `index.html` to open it in your favorite modern web browser. You're ready to search!

---

## 🎮 Included Games

GHSearch features a built-in quick-access menu (Accordion Cards) for the following web games:
- **GHAppel**: A social and competitive game experience. Compete with your friends.
- **GHDowngrade**: A fun online multiplayer game. Jump in and challenge your opponents.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
