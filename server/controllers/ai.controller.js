import { getGeminiClient } from '../utils/geminiClient.js';
import { getGroqClient } from '../utils/groqClient.js';
import { userModel } from '../db/models/userModel.js';
import { insightsCacheModel } from '../db/models/insightsCacheModel.js';

// ─────────────────────────────────────────────────────────────
//  Helper: build a brief portfolio summary from the profile
// ─────────────────────────────────────────────────────────────
function buildPortfolioSummary(profile) {
  if (!profile) return 'No profile data available.';

  const p  = profile.personal    || {};
  const f  = profile.finances    || {};
  const pr = profile.preferences || {};
  const g  = profile.goals       || [];

  const currency = p.currency || 'INR';
  const surplus  = (f.monthlyIncome || 0) - (f.monthlyExpenses || 0);
  const efTarget = (f.monthlyExpenses || 0) * 6;
  const efGap    = Math.max(0, efTarget - (f.currentSavings || 0));

  const goalLines = g.length
    ? g.map(goal =>
        `  • ${goal.title}: target ${currency} ${(goal.targetAmount || 0).toLocaleString()} ` +
        `in ${goal.timelineMonths || '?'} months [${goal.priority || 'medium'} priority]`
      ).join('\n')
    : '  • No goals set yet';

  return `
=== ${p.name || 'User'}'s Portfolio Snapshot ===
💼 Income      : ${currency} ${(f.monthlyIncome || 0).toLocaleString()} / month
💸 Expenses    : ${currency} ${(f.monthlyExpenses || 0).toLocaleString()} / month
📈 Surplus     : ${currency} ${surplus.toLocaleString()} / month
🏦 Savings     : ${currency} ${(f.currentSavings || 0).toLocaleString()}
📊 Investments : ${currency} ${(f.existingInvestments || 0).toLocaleString()}
💳 Debt EMI    : ${currency} ${(f.debtEMI || 0).toLocaleString()} / month
🛡️ Emergency Fund Gap : ${efGap > 0 ? `${currency} ${efGap.toLocaleString()} needed` : '✅ Fully covered'}
⚖️ Risk Appetite : ${pr.riskAppetite || 'medium'}
🎯 Goals (${g.length}):
${goalLines}
`.trim();
}

// ─────────────────────────────────────────────────────────────
//  Detect if question is about portfolio
// ─────────────────────────────────────────────────────────────
function isPortfolioQuery(question) {
  const q = question.toLowerCase();
  return (
    q.includes('portfolio') ||
    q.includes('my profile') ||
    q.includes('my finances') ||
    q.includes('my summary') ||
    q.includes('show me my') ||
    q.includes('overview of my') ||
    q.includes('financial summary') ||
    (q.includes('my') && (q.includes('saving') || q.includes('investment') || q.includes('goal')))
  );
}

export const aiController = {
  // ─────────────────────────────────────────────────────────
  //  GET INSIGHTS  (dashboard AI summary)
  // ─────────────────────────────────────────────────────────
  async getInsights(req, res) {
    try {
      const groq = getGroqClient();
      if (!groq) {
        return res.status(503).json({ success: false, message: 'AI service unavailable. Please configure GROQ_API_KEY.' });
      }

      const { userId, profile } = req.body;

      let userProfile = profile;
      if (userId && !profile) {
        userProfile = userModel.getFullProfile(userId);
        if (!userProfile) return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (!userProfile) return res.status(400).json({ success: false, message: 'Profile data required' });

      // Cache check
      const promptHash = insightsCacheModel.generateHash(userProfile);
      const cached = userId ? insightsCacheModel.get(userId, promptHash) : null;
      if (cached) return res.json({ success: true, data: cached, cached: true });

      const currency = userProfile?.personal?.currency || 'INR';
      const income   = userProfile?.finances?.monthlyIncome   || 0;
      const expenses = userProfile?.finances?.monthlyExpenses || 0;

      const systemPrompt = `You are FinPilot AI, an elite investment and personal finance strategist.
Return ONLY a valid JSON object — no markdown, no code fences, no extra text.
Always use the user's currency (${currency}).
Use specific amounts, not vague percentages.`;

      const userPrompt = `Profile:
${JSON.stringify(userProfile, null, 2)}

Monthly Income: ${income.toLocaleString()} ${currency}
Monthly Expenses: ${expenses.toLocaleString()} ${currency}
Monthly Surplus: ${(income - expenses).toLocaleString()} ${currency}

Return this exact JSON (fill every field with real numbers from the profile):
{
  "summary": "3-sentence health summary with exact numbers",
  "healthScoreExplanation": "What is dragging or boosting the score — be specific",
  "investmentPlan": {
    "emergencyFund": "Exact target and current gap in ${currency}",
    "sipMutualFunds": "Exact SIP amount/month in ${currency} + fund type for their risk level",
    "stocksEtfs": "Exact monthly amount in ${currency} + sectors/indices",
    "goldCommodities": "Exact % and amount in ${currency}",
    "shortTermSavings": "Exact amount, instrument, expected return"
  },
  "top3Risks": ["specific risk 1", "specific risk 2", "specific risk 3"],
  "top5ActionSteps": ["step with amount/timeline", "step", "step", "step", "step"],
  "lifestyleTips": ["tip tied to their data", "tip", "tip", "tip"],
  "goalAdvice": [{"goalTitle": "...", "advice": "numeric advice", "feasibility": "high|medium|low"}],
  "monthlyBudgetSuggestion": {"essentials": "XX%", "investments": "XX%", "discretionary": "XX%", "savings": "XX%"}
}`;

      let text = '';
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.75,
          max_tokens: 2048,
        });
        text = response.choices[0]?.message?.content || '';
      } catch (err) {
        console.warn('Groq failed. Falling back to Gemini...', err.message);
        const ai = getGeminiClient();
        if (!ai) throw new Error('Groq failed and Gemini fallback is unavailable.');
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
        });
        text = response.text;
      }

      text = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

      let parsed;
      try { parsed = JSON.parse(text); }
      catch { parsed = { summary: text, raw: true }; }

      if (userId) insightsCacheModel.set(userId, promptHash, parsed, 6);
      res.json({ success: true, data: parsed });

    } catch (error) {
      console.error('AI insights error:', error);
      res.status(500).json({ success: false, message: 'AI insight generation failed' });
    }
  },

  // ─────────────────────────────────────────────────────────
  //  CHAT  (AI Advisor conversation)
  // ─────────────────────────────────────────────────────────
  async chat(req, res) {
    try {
      const groq = getGroqClient();
      if (!groq) {
        return res.status(503).json({ success: false, message: 'AI service unavailable. Please configure GROQ_API_KEY.' });
      }

      const { question, userId, profile, history = [] } = req.body;
      if (!question) return res.status(400).json({ success: false, message: 'Question is required' });

      let userProfile = profile;
      if (userId && !profile) userProfile = userModel.getFullProfile(userId);

      const currency = userProfile?.personal?.currency || 'INR';
      const name     = userProfile?.personal?.name     || 'there';
      const income   = userProfile?.finances?.monthlyIncome   || 0;
      const expenses = userProfile?.finances?.monthlyExpenses || 0;
      const surplus  = income - expenses;

      // ── If user is asking about their own portfolio, inject its summary ──
      const portfolioContext = isPortfolioQuery(question)
        ? `\n\nUSER'S CURRENT PORTFOLIO DATA:\n${buildPortfolioSummary(userProfile)}`
        : '';

      const systemPrompt = `You are FinPilot, an AI investment advisor. You speak to ${name}.

══════════════════════════════════════
DOMAIN RESTRICTION — ABSOLUTE RULE
══════════════════════════════════════
You are ONLY an investment and personal finance chatbot.

ALLOWED: investments, stocks, mutual funds, SIP, ETFs, FD, gold, crypto, real estate,
budgeting, saving, expenses, income, EMI, loans, debt, financial goals, retirement,
emergency funds, insurance, tax planning, inflation, portfolio analysis, wealth management.

NOT ALLOWED: anything else — math problems, coding, science, history, geography, cooking,
sports, entertainment, jokes, relationships, general knowledge, or any non-finance topic.

If the question is NOT about finance or investments, respond with EXACTLY this one line:
"⚠️ That's not my domain. I'm FinPilot — your investment & finance advisor. Ask me about your investments, portfolio, savings, or financial goals."
Do NOT say anything else. Do NOT answer the off-topic question even partially.

══════════════════════════════════════
PORTFOLIO QUERIES
══════════════════════════════════════
If the user asks about their portfolio, finances, savings or goals summary, use the profile
data provided to give a clear, concise brief overview — show key numbers in a table or bullets.

══════════════════════════════════════
AGENTIC ACTIONS — STRICT RULES
══════════════════════════════════════
ONLY append a $$ACTION block for these 3 operations (closing $$ is mandatory):
  $$ACTION: {"type": "ADD_GOAL", "payload": {"title": "...", "target_amount": 0, "timeline_months": 12, "priority": "medium"}} $$
  $$ACTION: {"type": "ADD_EXPENSE", "payload": {"amount": 0, "category": "food", "description": "...", "date": "${new Date().toISOString().split('T')[0]}"}} $$
  $$ACTION: {"type": "UPDATE_PROFILE", "payload": {"finances": {"monthlyIncome": 0}}} $$

NEVER append $$ACTION for refusals, advice, summaries, or any other purpose.

══════════════════════════════════════
STYLE
══════════════════════════════════════
- ${name}'s surplus: ${currency} ${surplus.toLocaleString()}/month | income: ${income.toLocaleString()} | expenses: ${expenses.toLocaleString()}
- Always use real numbers from the profile
- Short question → 2-3 sentence reply
- "Detailed" / "explain" / "plan" → use ## headings + bullet points + **bold** numbers
- Be warm, concise, and professional${portfolioContext}

FULL PROFILE (${currency}):
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile available.'}`;

      const historyMessages = history.slice(-8).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: String(h.content || '').slice(0, 600),
      }));

      const messages = [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user',   content: question },
      ];

      let text = '';
      try {
        const response = await groq.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.8,
          max_tokens: 1500,
        });
        text = response.choices[0]?.message?.content || '';
      } catch (err) {
        console.warn('Groq chat failed. Falling back to Gemini...', err.message);
        const ai = getGeminiClient();
        if (!ai) throw new Error('Groq failed and Gemini fallback is unavailable.');

        const geminiMessages = [
          { role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + question }] },
          ...historyMessages.slice(1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: geminiMessages,
        });
        text = response.text;
      }

      res.json({ success: true, data: { answer: text } });

    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ success: false, message: 'AI chat failed' });
    }
  },
};
