/* ============================================================
   agent-modal.js — Agent Chatbot Modal Controller (for non-simulation pages)
   Used on dashboard, algo-select, and home pages
   ============================================================ */

import { matchKB, shouldUseKnowledgeBase } from './kb_matcher.js';
import { askGemini } from './gemini_api.js';
import { buildContextPrompt } from './context_builder.js';
import { hasGeminiApiKey } from '../settings_store.js';
import { getSuggestions } from './suggestions.js';
import { Auth } from '../auth/auth.js';

const STATS_KEY = 'agentiq_assistant_stats';

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{"kb":0,"ai":0}');
  } catch {
    return { kb: 0, ai: 0 };
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (_) { /* ignore */ }
}

function recordAnswerSource(source) {
  const stats = loadStats();
  stats[source] = (stats[source] || 0) + 1;
  saveStats(stats);
  return stats;
}

function getUserScopedChatKey() {
  const session = Auth.getCurrentSession();
  const userId = session?.email ? encodeURIComponent(session.email.toLowerCase()) : 'guest';
  return `agentiq_chat_global_${userId}`;
}

export const AgentModal = {
  isOpen: false,

  init() {
    this.setupOverlay();
    this.setupListeners();
    this.loadChatHistory();
    this.updateModeIndicator();
  },

  setupOverlay() {
    const overlay = document.getElementById('agent-modal-overlay');
    const closeBtn = document.getElementById('agent-modal-close');
    const btnOpen = document.getElementById('btn-agent-open');

    if (!overlay || !closeBtn || !btnOpen) return;

    btnOpen.addEventListener('click', () => this.open());
    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
  },

  open() {
    const overlay = document.getElementById('agent-modal-overlay');
    if (overlay) {
      overlay.classList.add('show');
      this.isOpen = true;
    }
  },

  close() {
    const overlay = document.getElementById('agent-modal-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      this.isOpen = false;
    }
  },

  updateModeIndicator() {
    const key = hasGeminiApiKey();
    const dot = document.getElementById('agent-modal-mode-dot');
    const label = document.getElementById('agent-modal-mode-label');
    if (!dot || !label) return;

    if (!key) {
      dot.style.background = 'var(--accent-green)';
      label.textContent = 'Knowledge Base';
      label.style.color = 'var(--accent-green)';
      return;
    }

    dot.style.background = 'var(--accent-purple)';
    label.textContent = 'KB + Gemini';
    label.style.color = 'var(--accent-light)';
  },

  loadChatHistory() {
    const msgsContainer = document.getElementById('agent-chat-messages');
    if (!msgsContainer) return;
    msgsContainer.innerHTML = '';

    const key = getUserScopedChatKey();
    try {
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      if (history.length > 0) {
        history.forEach(msg => {
          this.appendMessage(msg.role, msg.text, false);
        });
      } else {
        msgsContainer.innerHTML = `
          <div class="agent-chat-welcome">
            <span>🤖</span>
            <p>Hello! I'm <b>AgentIQ Assistant</b> 👋<br>Ask me anything about AI search, algorithms, heuristics, or the PEAS framework!</p>
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    this.renderSuggestions();
  },

  renderSuggestions() {
    const list = document.getElementById('agent-suggestions-list');
    if (!list) return;

    const chips = getSuggestions(null, 'home');
    list.innerHTML = '';
    chips.forEach(q => {
      const chip = document.createElement('button');
      chip.className = 'agent-suggestion-chip';
      chip.style.fontSize = '0.65rem';
      chip.style.padding = '4px 8px';

      const kbMatch = matchKB(q);
      const icon = shouldUseKnowledgeBase(kbMatch, q, null) ? '📚 ' : '🤖 ';
      chip.textContent = icon + q;

      chip.addEventListener('click', () => {
        this.askQuestion(q);
      });
      list.appendChild(chip);
    });
  },

  askQuestion(q) {
    const input = document.getElementById('agent-chat-input');
    if (input) input.value = q;
    this.handleSend();
  },

  saveChatHistory(role, text) {
    const key = getUserScopedChatKey();
    try {
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      history.push({
        role,
        text,
        savedAt: new Date().toISOString()
      });
      if (history.length > 50) history.shift();
      localStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  },

  setupListeners() {
    const input = document.getElementById('agent-chat-input');
    const sendBtn = document.getElementById('agent-chat-send');
    const clearBtn = document.getElementById('btn-clear-chat');

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.handleSend();
      });
    }

    if (clearBtn) {
      const newClearBtn = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
      newClearBtn.addEventListener('click', () => {
        this.clearChatHistory();
      });
    }
  },

  clearChatHistory() {
    try {
      localStorage.removeItem(getUserScopedChatKey());
    } catch (e) {
      console.error('Failed to clear chat history:', e);
    }
    this.loadChatHistory();
  },

  appendMessage(role, text, save = true) {
    const msgsContainer = document.getElementById('agent-chat-messages');
    if (!msgsContainer) return;

    const welcome = msgsContainer.querySelector('.agent-chat-welcome');
    if (welcome) welcome.remove();

    const msg = document.createElement('div');
    msg.className = `agent-chat-message ${role}`;

    const avatarText = role === 'user' ? 'U' : '🤖';

    msg.innerHTML = `
      <div class="msg-avatar">${avatarText}</div>
      <div class="msg-bubble">${text}</div>
    `;

    msgsContainer.appendChild(msg);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;

    if (save) {
      this.saveChatHistory(role, text);
      this.renderSuggestions();
    }
  },

  showTyping() {
    const msgsContainer = document.getElementById('agent-chat-messages');
    if (!msgsContainer) return;

    const typing = document.createElement('div');
    typing.className = 'agent-chat-message agent';
    typing.id = 'agent-chat-typing-indicator';
    typing.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble">
        <div class="agent-typing-indicator">
          <div class="agent-typing-dot"></div>
          <div class="agent-typing-dot"></div>
          <div class="agent-typing-dot"></div>
        </div>
      </div>
    `;
    msgsContainer.appendChild(typing);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  },

  hideTyping() {
    const typing = document.getElementById('agent-chat-typing-indicator');
    if (typing) typing.remove();
  },

  setModeIndicator(mode) {
    const dot = document.getElementById('agent-modal-mode-dot');
    const label = document.getElementById('agent-modal-mode-label');
    if (!dot || !label) return;

    if (mode === 'kb') {
      dot.style.background = 'var(--accent-green)';
      label.textContent = 'Knowledge Base';
      label.style.color = 'var(--accent-green)';
    } else if (mode === 'ai') {
      dot.style.background = 'var(--accent-blue)';
      label.textContent = 'Gemini AI';
      label.style.color = 'var(--accent-blue)';
    }
  },

  async handleSend() {
    const input = document.getElementById('agent-chat-input');
    const text = (input?.value ?? '').trim();
    if (!text) return;

    input.value = '';
    this.appendMessage('user', text);
    this.showTyping();

    // Check if question is about simulation/running
    const isSimulationQuestion = /run|start|execute|simulate|step|pause|play|begin|pause|resume|frontier|nodes|visited|expand|algorithm|how (does|do) (the|this|an|it) (algorithm|search|bfs|dfs|astar|greedy)/i.test(text);
    
    if (isSimulationQuestion) {
      setTimeout(() => {
        this.hideTyping();
        this.appendMessage('agent', 
          '⚠️ You haven\'t started a simulation yet. To explore how algorithms work step-by-step, go to <b>Dashboard</b>, select a problem, then choose an algorithm to simulate.');
      }, 200);
      return;
    }

    const kbResult = matchKB(text);
    const useKb = shouldUseKnowledgeBase(kbResult, text, null);
    const geminiAvailable = hasGeminiApiKey();

    // Layer 1 — Curated KB (any trusted-topic match)
    if (useKb) {
      setTimeout(() => {
        this.hideTyping();
        this.setModeIndicator('kb');
        recordAnswerSource('kb');
        this.appendMessage('agent', kbResult.response);
      }, 280 + Math.random() * 180);
      return;
    }

    // Layer 2 — Gemini for questions or when KB has no match
    if (geminiAvailable) {
      const systemPrompt = buildContextPrompt(null, text);
      let prompt = systemPrompt;
      if (kbResult.found && kbResult.confidence === 'low') {
        prompt += `\n\n(Optional KB hint — verify before using: ${kbResult.response.replace(/<[^>]+>/g, '')})`;
      }

      const geminiResult = await askGemini(prompt, text);
      this.hideTyping();

      if (geminiResult.success) {
        this.setModeIndicator('ai');
        recordAnswerSource('ai');
        this.appendMessage('agent', geminiResult.text);
      } else if (geminiResult.error === 'no_key') {
        this.fallbackKbOrMessage(kbResult, text, 'no_key');
      } else if (geminiResult.error === 'invalid_key') {
        this.fallbackKbOrMessage(kbResult, text, 'invalid_key', geminiResult.message);
      } else {
        this.fallbackKbOrMessage(kbResult, text, 'api_error', geminiResult.message);
      }
    } else {
      this.hideTyping();
      this.fallbackKbOrMessage(kbResult, text, 'no_key');
    }
  },

  fallbackKbOrMessage(kbResult, questionText, reason, detail = '') {
    if (shouldUseKnowledgeBase(kbResult, questionText, null)) {
      this.setModeIndicator('kb');
      recordAnswerSource('kb');
      this.appendMessage('agent', kbResult.response);
      return;
    }

    this.setModeIndicator('ai');
    if (reason === 'no_key') {
      this.appendMessage('agent',
        '⚠️ To enable AI-powered answers, add your Gemini API key to <code>config.js</code> (see Setup → Settings).');
    } else if (reason === 'invalid_key') {
      this.appendMessage('agent',
        `⚠️ <b>Gemini error (invalid API key):</b><br>${detail || 'Check your Gemini API key in config.js or Settings.'}`);
    } else {
      this.appendMessage('agent',
        `⚠️ <b>Gemini could not answer:</b><br>${detail || 'Check your API key in config.js and your network connection.'}`);
    }
  }
};

export default AgentModal;
