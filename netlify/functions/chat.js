const SYSTEM_PROMPT = `Tu es un accompagnateur bienveillant sur un site chrétien évangélique francophone appelé "Il revient", centré sur l'annonce de l'Évangile (la mort et la résurrection de Jésus-Christ) et l'espérance de son retour.
Règles :
- Réponds toujours en français, avec un ton chaleureux, simple, et pastoral.
- Base-toi sur les Écritures bibliques (tu peux citer des versets brièvement).
- Reste centré sur : l'Évangile, la grâce, la foi, la repentance, le retour de Jésus-Christ, les signes des temps, l'espérance, la prière.
- Si la question sort de ce cadre, réoriente gentiment vers l'Évangile.
- Ne remplace jamais un accompagnement pastoral réel — encourage-le pour les situations personnelles difficiles.
- Réponses concises : une à trois courts paragraphes.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.inceptionlabs.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INCEPTION_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mercury-2',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};  }
  header h1 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 22px;
  }
  header h1 em { font-style: italic; color: var(--dawn-gold); }
  header p {
    margin-top: 6px;
    font-size: 13.5px;
    color: rgba(246,242,233,0.6);
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  main {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px 10px;
    display: flex;
    justify-content: center;
  }
  .thread {
    width: 100%;
    max-width: 620px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .msg {
    max-width: 88%;
    padding: 13px 16px;
    border-radius: 4px;
    font-size: 15.5px;
    line-height: 1.55;
    white-space: pre-wrap;
  }
  .msg.assistant {
    align-self: flex-start;
    background: rgba(246,242,233,0.06);
    border: 1px solid var(--line);
    border-left: 2px solid var(--dawn-gold);
  }
  .msg.user { align-self: flex-end; background: var(--bubble-user); }
  .msg.thinking { color: rgba(246,242,233,0.45); font-style: italic; }
  .starter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 6px;
  }
  .starter {
    font-size: 13.5px;
    padding: 9px 14px;
    border-radius: 20px;
    border: 1px solid rgba(246,242,233,0.25);
    background: transparent;
    color: var(--cream);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .starter:hover { border-color: var(--dawn-gold); background: rgba(217,164,65,0.08); }
  form {
    flex-shrink: 0;
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: center;
    background: #0d1526;
  }
  .input-row { width: 100%; max-width: 620px; display: flex; gap: 10px; }
  textarea {
    flex: 1;
    resize: none;
    background: rgba(246,242,233,0.06);
    border: 1px solid rgba(246,242,233,0.2);
    border-radius: 6px;
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 12px 14px;
    line-height: 1.4;
    max-height: 120px;
  }
  textarea:focus { outline: none; border-color: var(--dawn-gold); }
  textarea::placeholder { color: rgba(246,242,233,0.4); }
  button.send {
    background: var(--dawn-gold);
    color: #1a1002;
    border: none;
    border-radius: 6px;
    padding: 0 20px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    transition: background 0.2s;
  }
  button.send:hover { background: var(--dawn-gold-soft); }
  button.send:disabled { opacity: 0.5; cursor: not-allowed; }
  .notice {
    text-align: center;
    font-size: 12.5px;
    color: rgba(246,242,233,0.35);
    padding: 6px 0 16px;
  }
</style>
</head>
<body>

<header>
  <h1>Pose ta question sur <em>l'Évangile</em></h1>
  <p>Un espace pour discuter de la bonne nouvelle de Jésus-Christ et de son retour — pose ta question librement.</p>
</header>

<main>
  <div class="thread" id="thread">
    <div class="msg assistant">
      Bienvenue. Je suis ici pour parler avec toi de l'Évangile, de la foi chrétienne, et de l'espérance du retour de Jésus-Christ. Pose-moi une question, ou choisis un thème ci-dessous pour commencer.
      <div class="starter-row">
        <button class="starter" type="button" data-q="Qu'est-ce que l'Évangile, en une phrase simple ?">Qu'est-ce que l'Évangile ?</button>
        <button class="starter" type="button" data-q="Quels sont les signes annoncés avant le retour de Jésus ?">Les signes de son retour</button>
        <button class="starter" type="button" data-q="Comment être sûr d'être prêt pour le retour de Christ ?">Comment être prêt ?</button>
        <button class="starter" type="button" data-q="Je doute de ma foi, que me conseilles-tu ?">J'ai des doutes</button>
      </div>
    </div>
  </div>
</main>

<form id="chatForm">
  <div class="input-row">
    <textarea id="input" rows="1" placeholder="Écris ta question ici…"></textarea>
    <button type="submit" class="send" id="sendBtn">Envoyer</button>
  </div>
</form>
<p class="notice">Réponses générées par IA — pour un accompagnement personnel, un pasteur ou une communauté locale reste irremplaçable.</p>

<script>
const thread = document.getElementById('thread');
const form = document.getElementById('chatForm');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
let history = [];

function scrollToBottom() {
  const main = document.querySelector('main');
  main.scrollTop = main.scrollHeight;
}

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = text;
  thread.appendChild(div);
  scrollToBottom();
  return div;
}

async function sendMessage(text) {
  if (!text.trim()) return;

  addMessage('user', text);
  history.push({ role: 'user', content: text });
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;

  const loading = addMessage('assistant thinking', 'Il réfléchit…');

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    const reply = data.reply || "Désolé, je n'ai pas pu répondre à l'instant.";
    loading.textContent = reply;
    loading.className = 'msg assistant';
    history.push({ role: 'assistant', content: reply });
  } catch (err) {
    loading.textContent = "Erreur de connexion. Réessaie dans un instant.";
    loading.className = 'msg assistant';
  } finally {
    sendBtn.disabled = false;
    scrollToBottom();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
});

document.querySelectorAll('.starter').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});
</script>

</body>
</html>
