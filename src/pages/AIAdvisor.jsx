import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Chip, CircularProgress,
  Tooltip, Divider, Avatar,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useUser } from '../context/UserContext.jsx';
import { aiAPI, goalAPI, expenseAPI, userAPI } from '../services/api.js';
import './AIAdvisor.css';

// ── Strip ALL $$ACTION blocks (with or without closing $$) ──
function stripActionBlocks(text) {
  return text
    .replace(/\$\$ACTION:\s*\{[\s\S]*?\}\s*\$\$/g, '')  // proper format: $$ACTION: {...} $$
    .replace(/\$\$ACTION:\s*\{[\s\S]*?\}/g, '')          // missing closing $$: $$ACTION: {...}
    .replace(/\$\$ACTION:[^\n]*/g, '')                   // any leftover $$ACTION line
    .trim();
}

// ── Render simple markdown: bold, newlines, bullet points ──
function MarkdownText({ text }) {
  const clean = stripActionBlocks(text);

  const lines = clean.split('\n');
  return (
    <Box sx={{ lineHeight: 1.75, fontSize: '0.95rem' }}>
      {lines.map((line, i) => {
        // Convert **bold** to <strong>
        const parts = line.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((p, j) =>
          j % 2 === 1 ? <strong key={j} style={{ color: '#00d4ff' }}>{p}</strong> : p
        );

        // Bullet point lines
        if (/^[-*•]\s/.test(line)) {
          return (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
              <Box sx={{ color: '#6366f1', mt: '2px', flexShrink: 0 }}>▸</Box>
              <Box>{rendered}</Box>
            </Box>
          );
        }
        // Heading lines (## or ###)
        if (/^#{1,3}\s/.test(line)) {
          const headingText = line.replace(/^#{1,3}\s/, '');
          return (
            <Typography key={i} sx={{ fontWeight: 700, fontSize: '1rem', color: '#e4e7ff', mt: 1.5, mb: 0.5 }}>
              {headingText}
            </Typography>
          );
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          return (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
              <Box sx={{ color: '#a855f7', flexShrink: 0, minWidth: 20 }}>{line.match(/^\d+/)[0]}.</Box>
              <Box>{rendered}</Box>
            </Box>
          );
        }
        // Empty line = spacer
        if (!line.trim()) return <Box key={i} sx={{ height: 8 }} />;

        return <Box key={i} sx={{ mb: 0.25 }}>{rendered}</Box>;
      })}
    </Box>
  );
}

// ── Action notification badge ──
function ActionBadge({ action }) {
  const icons = { ADD_GOAL: '🎯', ADD_EXPENSE: '💸', UPDATE_PROFILE: '✏️' };
  const labels = { ADD_GOAL: 'Goal Added', ADD_EXPENSE: 'Expense Logged', UPDATE_PROFILE: 'Profile Updated' };
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.75, mt: 1,
      px: 1.5, py: 0.5, borderRadius: '20px',
      background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
      fontSize: '0.8rem', color: '#34d399', fontWeight: 600,
    }}>
      <CheckIcon sx={{ fontSize: 14 }} />
      {icons[action?.type]} {labels[action?.type] || 'Action Executed'}
    </Box>
  );
}

const SUGGESTED_QUESTIONS = [
  'How should I invest my monthly surplus?',
  'Am I on track with my emergency fund?',
  'Give me a detailed 6-month savings plan',
  'What are my biggest financial risks?',
  'How can I reduce my monthly expenses?',
  'Add a goal to save ₹1,00,000 for a laptop in 8 months',
];

export default function AIAdvisor() {
  const { profile, userId } = useUser();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: profile?.personal?.name
        ? `Hey **${profile.personal.name.split(' ')[0]}**! 👋 I'm FinPilot, your personal AI wealth manager.\n\nI have full access to your financial profile. Ask me anything — budgeting, investing, goal planning — or say things like *"Log ₹500 for food"* or *"Add a goal to buy a car"* and I'll take action directly!`
        : `Hey there! 👋 I'm FinPilot, your personal AI wealth manager.\n\nAsk me anything about budgeting, investing, or goal planning. I can also take actions for you — try saying *"Add a goal"* or *"Log an expense"*!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Parse and execute $$ACTION blocks ──
  const executeAction = useCallback(async (text) => {
    // Try with closing $$ first, then without
    const match =
      text.match(/\$\$ACTION:\s*(\{[\s\S]*?\})\s*\$\$/) ||
      text.match(/\$\$ACTION:\s*(\{[\s\S]*?\})/);
    if (!match) return null;

    let action = null;
    try { action = JSON.parse(match[1]); } catch { return null; }

    // Only execute known valid action types — ignore anything else
    const VALID_TYPES = ['ADD_GOAL', 'ADD_EXPENSE', 'UPDATE_PROFILE'];
    if (!action?.type || !VALID_TYPES.includes(action.type)) {
      console.warn('Ignored unknown action type:', action?.type);
      return null;
    }

    try {
      if (action.type === 'ADD_GOAL' && userId) {
        await goalAPI.create(userId, action.payload);
      } else if (action.type === 'ADD_EXPENSE' && userId) {
        const d = new Date(action.payload.date || new Date());
        await expenseAPI.create(userId, {
          ...action.payload,
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        });
      } else if (action.type === 'UPDATE_PROFILE' && userId) {
        await userAPI.update(userId, action.payload);
      }
      return action;
    } catch (err) {
      console.warn('Action execution failed:', err.message);
      return null;
    }
  }, [userId]);

  const handleSend = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    setInput('');
    setError(null);

    const userMsg = { id: Date.now(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build history for API (exclude welcome message, last 10 msgs)
    const historyForApi = messages
      .filter(m => m.id !== 'welcome')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await aiAPI.chat(question, userId, profile, historyForApi);
      const answer = res?.data?.answer || 'Sorry, I could not generate a response.';

      // Execute any embedded action
      const executedAction = await executeAction(answer);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: answer,
        action: executedAction,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || 'Failed to reach FinPilot AI. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(stripActionBlocks(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Box className="advisor-page" sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', maxWidth: 900, mx: 'auto', px: { xs: 1, md: 2 } }}>
      {/* ── Header ── */}
      <Box sx={{ py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #00d4ff, #6366f1)',
          boxShadow: '0 4px 16px rgba(0,212,255,0.35)',
        }}>
          <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>FinPilot AI</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(176,181,212,0.7)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981', display: 'inline-block' }} />
            Online · Powered by Llama 3.3 70B
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(0,212,255,0.08)' }} />

      {/* ── Messages ── */}
      <Box
        className="chat-messages"
        sx={{ flex: 1, overflowY: 'auto', py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        {messages.map(msg => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 1.5,
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            <Avatar sx={{
              width: 34, height: 34, flexShrink: 0,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                : 'linear-gradient(135deg, #00d4ff, #6366f1)',
              fontSize: '0.85rem',
            }}>
              {msg.role === 'user' ? <PersonIcon sx={{ fontSize: 18 }} /> : <AutoAwesomeIcon sx={{ fontSize: 18 }} />}
            </Avatar>

            {/* Bubble */}
            <Box sx={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{
                px: 2, py: 1.5, borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.85), rgba(168,85,247,0.85))'
                  : 'rgba(26,32,53,0.9)',
                border: msg.role === 'assistant' ? '1px solid rgba(0,212,255,0.12)' : 'none',
                backdropFilter: 'blur(12px)',
                color: '#e4e7ff',
                position: 'relative',
              }}>
                {msg.role === 'assistant'
                  ? <MarkdownText text={msg.content} />
                  : <Typography sx={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{msg.content}</Typography>
                }

                {/* Executed action badge */}
                {msg.action && <ActionBadge action={msg.action} />}
              </Box>

              {/* Copy button for AI messages */}
              {msg.role === 'assistant' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 0.5 }}>
                  <Tooltip title={copiedId === msg.id ? 'Copied!' : 'Copy'}>
                    <IconButton size="small" onClick={() => handleCopy(msg.id, msg.content)}
                      sx={{ opacity: 0.4, '&:hover': { opacity: 1 }, transition: '0.2s', p: 0.5 }}>
                      {copiedId === msg.id
                        ? <CheckIcon sx={{ fontSize: 14, color: '#10b981' }} />
                        : <ContentCopyIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {/* Typing indicator */}
        {loading && (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #00d4ff, #6366f1)' }}>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{
              px: 2, py: 1.5, borderRadius: '4px 18px 18px 18px',
              background: 'rgba(26,32,53,0.9)', border: '1px solid rgba(0,212,255,0.12)',
              display: 'flex', gap: 0.5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <Box key={i} sx={{
                  width: 7, height: 7, borderRadius: '50%', bgcolor: '#00d4ff',
                  animation: 'typingDot 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </Box>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box sx={{ mx: 1, px: 2, py: 1.5, borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* ── Suggested Questions ── */}
      <Box sx={{ py: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <Chip
            key={i}
            label={q}
            size="small"
            onClick={() => handleSend(q)}
            disabled={loading}
            sx={{
              fontSize: '0.75rem', cursor: 'pointer',
              background: 'rgba(26,32,53,0.8)', border: '1px solid rgba(0,212,255,0.12)',
              color: 'rgba(176,181,212,0.9)',
              '&:hover': { background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.3)', color: '#e4e7ff' },
              transition: '0.2s',
            }}
          />
        ))}
      </Box>

      {/* ── Input ── */}
      <Box sx={{
        pb: 2, pt: 0.5,
        display: 'flex', gap: 1, alignItems: 'flex-end',
      }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask anything, or say 'Add a goal to save ₹50,000 for travel'…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'rgba(26,32,53,0.7)',
              borderRadius: '14px',
              fontSize: '0.95rem',
              '& fieldset': { borderColor: 'rgba(0,212,255,0.15)' },
              '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(0,212,255,0.5)' },
            },
          }}
        />
        <IconButton
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          sx={{
            width: 48, height: 48, flexShrink: 0,
            background: input.trim() ? 'linear-gradient(135deg, #00d4ff, #6366f1)' : 'rgba(26,32,53,0.7)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '14px',
            transition: '0.25s',
            '&:hover': { transform: 'scale(1.06)', boxShadow: '0 4px 16px rgba(0,212,255,0.35)' },
            '&.Mui-disabled': { background: 'rgba(26,32,53,0.5)', border: '1px solid rgba(255,255,255,0.04)' },
          }}
        >
          {loading
            ? <CircularProgress size={20} sx={{ color: '#00d4ff' }} />
            : <SendRoundedIcon sx={{ fontSize: 20, color: input.trim() ? '#fff' : 'rgba(176,181,212,0.4)' }} />
          }
        </IconButton>
      </Box>

      {/* ── Keyframe for typing dots ── */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </Box>
  );
}
