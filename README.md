# Claude AI Chat — Powered by Puter.js

> A free, unlimited AI chat platform built with a single HTML file. No API keys, no backend, no cost.

**Built by [Sajid Khan](https://sajidkhan.me)**

---

## ✨ Features

- 🤖 **Claude AI models** — Sonnet 4.5/4.6, Haiku 4.5, Opus 4.5/4.6
- 💬 **Real-time streaming** — responses appear word-by-word as Claude types
- 🧠 **Conversation memory** — full multi-turn context is preserved per session
- 📝 **Markdown rendering** — bold, italic, headings, code blocks, lists
- 🔀 **Model switcher** — change AI model mid-conversation via dropdown
- 🗑️ **Clear chat** — reset conversation and history with one click
- 📱 **Responsive** — works on desktop and mobile
- 🔑 **Zero setup** — no API keys, no npm, no build step

---

## 🚀 How to Run

> ⚠️ **Important:** Puter.js requires an `http://` origin. You **cannot** open `index.html` by double-clicking it (`file://` will not work).

### Option 1 — Python (recommended, built into Windows/Mac/Linux)

```bash
# Navigate to the project folder
cd path/to/FreeAI

# Start a local server on port 3000
python -m http.server 3000
```

Then open your browser and go to:
```
http://localhost:3000
```

### Option 2 — VS Code Live Server

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` in the Explorer panel
3. Select **"Open with Live Server"**
4. Browser opens automatically at `http://127.0.0.1:5500`

### Option 3 — Node.js `serve`

```bash
npx serve .
```

### Option 4 — Deploy Online (free)

Since the entire app is a **single HTML file**, you can host it anywhere for free:

| Platform | How |
|---|---|
| **Netlify** | Drag & drop the folder at [netlify.com/drop](https://netlify.com/drop) |
| **GitHub Pages** | Push to a repo → Settings → Pages → Deploy from branch |
| **Vercel** | `npx vercel` in the project folder |

Puter.js works on any public `https://` URL without any extra config.

---

## 🧠 How It Works

### Architecture

This is a **pure front-end application** — there is no server, no database, and no backend code. Everything runs in the browser.

```
User → index.html (browser) → Puter.js SDK → Claude AI API → Streaming response
```

### Puter.js — The "User-Pays" Model

[Puter.js](https://puter.com) is a free JavaScript SDK that gives browser apps access to AI models without requiring developer API keys. Instead, users authenticate with their own Puter account (free), and their usage is billed to their own quota — not the developer's.

**What this means:**
- Developers pay **$0** — no API key costs
- Users get **free usage** within Puter's generous limits
- No rate limits imposed by the developer

### Authentication Flow

1. On first use, Puter.js opens a **login popup** (sign up or sign in to Puter — it's free)
2. After login, the session is cached — no repeated logins needed
3. All API calls go directly from the browser to Puter's servers over HTTPS

### Streaming

The app uses `stream: true` when calling `puter.ai.chat()`, which returns an async iterator:

```js
const stream = await puter.ai.chat(prompt, { model, stream: true });

for await (const part of stream) {
  contentEl.innerHTML += part?.text ?? '';
}
```

This displays each token as it arrives, giving a real-time typing effect.

### Conversation History

Each message is stored in a local `history` array:

```js
history.push({ role: 'user',      content: userText });
history.push({ role: 'assistant', content: aiReply  });
```

Before each new request, the full history is formatted into a single prompt string so Claude has context of the entire conversation.

---

## 🗂️ Project Structure

```
FreeAI/
└── index.html    # The entire application (HTML + CSS + JS)
```

No dependencies, no `node_modules`, no build step.

---

## 🛠️ Available Models

| Model ID | Description |
|---|---|
| `claude-sonnet-4-5` | Default — fast & capable (recommended) |
| `claude-sonnet-4-6` | Latest Sonnet — improved reasoning |
| `claude-haiku-4-5` | Fastest & lightest |
| `claude-opus-4-5` | Most powerful — slower |
| `claude-opus-4-6` | Latest Opus — best quality |

---

## 🔧 Customisation

To change the **default model**, edit this line in `index.html`:

```html
<option value="claude-sonnet-4-5" selected>Claude Sonnet 4.5</option>
```

To add a **system prompt** (persistent personality/instructions), modify `buildPrompt()`:

```js
function buildPrompt(history) {
  const system = 'You are a helpful assistant that always responds in bullet points.';
  const messages = history.map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`).join('\n\n');
  return `${system}\n\n${messages}\n\nAssistant:`;
}
```

---

## 📄 License

MIT — free to use, modify, and distribute.
