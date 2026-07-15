import { useState, useCallback } from 'react';
import { aiAPI, goalAPI, expenseAPI, userAPI } from '../services/api.js';

export function useAIInsights() {
  const [insights, setInsights] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async (userId, profile) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiAPI.getInsights(userId, profile);
      setInsights(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const askQuestion = useCallback(async (question, userId, profile, onActionSuccess) => {
    setLoading(true);
    setError(null);

    // Add user message
    const userMsg = { role: 'user', content: question, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await aiAPI.chat(question, userId, profile, messages);
      let answerText = res.data.answer;
      let actionExecuted = false;

      // Agentic Parser
      const actionMatch = answerText.match(/\$\$ACTION:\s*({[\s\S]*?})\s*\$\$/);
      if (actionMatch) {
         try {
           const actionStr = actionMatch[1];
           const action = JSON.parse(actionStr);
           if (action.type === 'ADD_GOAL') {
              await goalAPI.create(userId, action.payload);
              actionExecuted = true;
           } else if (action.type === 'ADD_EXPENSE') {
              await expenseAPI.create(userId, action.payload);
              actionExecuted = true;
           } else if (action.type === 'UPDATE_PROFILE') {
              await userAPI.update(userId, action.payload);
              actionExecuted = true;
           }
         } catch(e) { console.error("Agentic Action parse/execute error:", e); }
         
         // Remove block from UI
         answerText = answerText.replace(actionMatch[0], '').trim();
      }

      const aiMsg = { role: 'assistant', content: answerText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      
      if (actionExecuted && onActionSuccess) {
         onActionSuccess();
      }
      return answerText;
    } catch (err) {
      const errMsg = { role: 'error', content: err.message, timestamp: Date.now() };
      setMessages(prev => [...prev, errMsg]);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    insights,
    messages,
    loading,
    error,
    fetchInsights,
    askQuestion,
    clearMessages,
  };
}
