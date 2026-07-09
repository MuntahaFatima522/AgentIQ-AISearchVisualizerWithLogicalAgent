/* ============================================================
   agent_panel.js — AgentIQ Assistant Panel Controller (ES6 Module)
   KB-first tutor: ~80% curated KB, ~20% Gemini for novel questions
   ============================================================ */

import { matchKB, shouldUseKnowledgeBase } from './kb_matcher.js';
import { askGemini } from './gemini_api.js';
import { buildContextPrompt } from './context_builder.js';
import { getSuggestions } from './suggestions.js';
import { getGeminiApiKey, hasGeminiApiKey } from '../settings_store.js';
import { SimState } from '../sim_state.js';
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
  return `agentiq_chat_${userId}`;
}

export const AgentPanel = {
  state: null,
  container: null,

  init(stateContext = SimState) {
    this.state = stateContext;
    this.loadChatHistory();
    this.renderSuggestions();
    this.setupListeners();
    this.updateModeIndicator();
  },

  updateModeIndicator() {
    const key = hasGeminiApiKey();
    const dot = document.getElementById('assistant-mode-dot');
    const label = document.getElementById('assistant-mode-label');
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
    const msgsContainer = document.getElementById('chat-messages');
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
          <div class="chat-welcome">
            <span class="welcome-icon">🤖</span>
            <p>Hello! I'm <b>AgentIQ Assistant</b> 👋<br>
            Core topics (BFS, A*, PEAS, heuristics) use our <b>knowledge base</b>.
            Other questions are answered by <b>Gemini AI</b> using your live simulation.</p>
          </div>
        `;
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  },

  saveChatHistory(role, text) {
    const key = getUserScopedChatKey();
    try {
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      history.push({
        role,
        text,
        problem: this.state.problem?.metadata?.id || 'global',
        algorithm: this.state.algorithm || 'none',
        savedAt: new Date().toISOString()
      });
      if (history.length > 50) history.shift();
      localStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  },

  setupListeners() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.chat-send-btn');
    const clearBtn = document.getElementById('btn-clear-chat');

    if (input) {
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);

      newInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    if (sendBtn) {
      const newBtn = sendBtn.cloneNode(true);
      sendBtn.parentNode.replaceChild(newBtn, sendBtn);
      newBtn.addEventListener('click', () => {
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

  renderSuggestions() {
    const list = document.getElementById('suggestions-list');
    if (!list) return;

    const pauseBtn = document.getElementById('btn-pause');
    const isRunning = pauseBtn && !pauseBtn.disabled && pauseBtn.textContent.includes('Pause');
    if (isRunning) return;

    const chips = getSuggestions(this.state);

    const currentChips = Array.from(list.children).map(btn => {
      const txt = btn.textContent;
      if (txt.startsWith('📚 ') || txt.startsWith('🤖 ')) {
        return txt.substring(3);
      }
      return txt;
    });

    const isIdentical = currentChips.length === chips.length &&
                        currentChips.every((val, index) => val === chips[index]);

    if (isIdentical) return;

    list.innerHTML = '';
    chips.forEach(q => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';

      const kbMatch = matchKB(q);
      const icon = shouldUseKnowledgeBase(kbMatch, q, this.state) ? '📚 ' : '🤖 ';
      chip.textContent = icon + q;

      chip.addEventListener('click', () => {
        this.askQuestion(q);
      });
      list.appendChild(chip);
    });
  },

  setModeIndicator(mode) {
    const dot = document.getElementById('assistant-mode-dot');
    const label = document.getElementById('assistant-mode-label');
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

  appendMessage(role, text, save = true) {
    const msgsContainer = document.getElementById('chat-messages');
    if (!msgsContainer) return;

    const welcome = msgsContainer.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const msg = document.createElement('div');
    msg.className = `chat-message ${role}`;

    const avatarText = role === 'user' ? 'U' : '🤖';
    const avatarClass = role === 'user' ? 'user-avatar' : 'agent-avatar';

    msg.innerHTML = `
      <div class="msg-avatar ${avatarClass}">${avatarText}</div>
      <div class="msg-bubble">${text}</div>
    `;

    msgsContainer.appendChild(msg);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;

    if (save) {
      this.saveChatHistory(role, text);
    }
  },

  showTyping() {
    const msgsContainer = document.getElementById('chat-messages');
    if (!msgsContainer) return;

    const typing = document.createElement('div');
    typing.className = 'chat-message agent';
    typing.id = 'chat-typing-indicator';
    typing.innerHTML = `
      <div class="msg-avatar agent-avatar">🤖</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    msgsContainer.appendChild(typing);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  },

  hideTyping() {
    const typing = document.getElementById('chat-typing-indicator');
    if (typing) typing.remove();
  },

  askQuestion(q) {
    const input = document.getElementById('chat-input');
    if (input) input.value = q;
    this.handleSend(q);
  },

  async handleSend(questionText = null) {
    const input = document.getElementById('chat-input');
    const text = (questionText ?? input?.value ?? '').trim();
    if (!text) return;

    if (input) input.value = '';
    this.appendMessage('user', text);
    this.showTyping();

    const kbResult = matchKB(text);
    const useKb = shouldUseKnowledgeBase(kbResult, text, this.state);
    const geminiAvailable = hasGeminiApiKey();
    const hasActiveSimulation = this.state?.problem && this.state?.algorithm;

    // Check if question is about simulation/running
    const isSimulationQuestion = /run|start|execute|simulate|step|pause|play|begin|pause|resume|frontier|nodes|visited|expand|how (does|do) (the|this|an|it) (algorithm|search|bfs|dfs|astar|greedy)/i.test(text);
    
    if (isSimulationQuestion && !hasActiveSimulation) {
      setTimeout(() => {
        this.hideTyping();
        this.appendMessage('agent', 
          '⚠️ You haven\'t selected a problem and algorithm to simulate yet. Please select both to start exploring step-by-step.');
        this.renderSuggestions();
      }, 200);
      return;
    }

    // Layer 1 — Curated KB (any trusted-topic match)
    if (useKb) {
      setTimeout(() => {
        this.hideTyping();
        this.setModeIndicator('kb');
        recordAnswerSource('kb');
        this.appendMessage('agent', kbResult.response);
        this.renderSuggestions();
      }, 280 + Math.random() * 180);
      return;
    }

    // Layer 2 — Gemini for simulation-context questions or when KB has no match
    if (geminiAvailable) {
      const systemPrompt = buildContextPrompt(this.state, text);
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
        this.fallbackKbOrMessage(kbResult, text, 'no_key', hasActiveSimulation);
      } else if (geminiResult.error === 'invalid_key') {
        this.fallbackKbOrMessage(kbResult, text, 'invalid_key', geminiResult.message, hasActiveSimulation);
      } else {
        this.fallbackKbOrMessage(kbResult, text, 'api_error', geminiResult.message, hasActiveSimulation);
      }
    } else {
      this.hideTyping();
      this.fallbackKbOrMessage(kbResult, text, 'no_key', '', hasActiveSimulation);
    }

    this.renderSuggestions();
  },

  fallbackKbOrMessage(kbResult, questionText, reason, detail = '', hasActiveSimulation = false) {
    if (shouldUseKnowledgeBase(kbResult, questionText, this.state)) {
      this.setModeIndicator('kb');
      recordAnswerSource('kb');
      this.appendMessage('agent', kbResult.response);
      return;
    }

    this.setModeIndicator('ai');
    if (reason === 'no_key') {
      if (hasActiveSimulation) {
        this.appendMessage('agent',
          '⚠️ Cannot answer this question about your simulation. ' +
          'To enable AI-powered answers with live simulation context, add your Gemini API key to <code>config.js</code> ' +
          '(see Setup → Settings).');
      } else {
        this.appendMessage('agent',
          '⚠️ Could not answer this question. No knowledge-base match, and Gemini is not configured in <code>config.js</code>. ' +
          'See Setup → Settings to add your Gemini API key.');
      }
    } else if (reason === 'invalid_key') {
      this.appendMessage('agent',
        `⚠️ <b>Gemini error (invalid API key):</b><br>${detail || 'Check your Gemini API key in config.js or Settings.'}`);
    } else {
      this.appendMessage('agent',
        `⚠️ <b>Gemini could not answer:</b><br>${detail || 'Check your API key in config.js and your network connection.'}`);
    }
  }
};

export default AgentPanel;
