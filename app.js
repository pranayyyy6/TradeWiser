const STORAGE_KEY = "tradewise-trades-v1";

const seedTrades = [
  {
    id: crypto.randomUUID(),
    symbol: "AAPL",
    side: "Long",
    strategy: "Breakout",
    setupType: "Trend continuation",
    entryDate: "2026-10-02",
    exitDate: "2026-10-02",
    entryPrice: 214.8,
    exitPrice: 219.6,
    quantity: 120,
    capitalUsed: 25800,
    fees: 12,
    stopLoss: 211.2,
    takeProfit: 222.5,
    confidence: 7,
    executionQuality: 8,
    followedPlan: "Yes",
    notes: "Opened near the previous high after market breadth strengthened.",
    review: "Process was strong; the breakout held and the position scaled well.",
    tags: "trend, breakout",
    pnl: 576,
    returnPct: 2.23,
    rMultiple: 2.7,
  },
  {
    id: crypto.randomUUID(),
    symbol: "NVDA",
    side: "Short",
    strategy: "Fade",
    setupType: "Overextended move",
    entryDate: "2026-10-05",
    exitDate: "2026-10-06",
    entryPrice: 131.9,
    exitPrice: 126.4,
    quantity: 90,
    capitalUsed: 11871,
    fees: 8,
    stopLoss: 134.8,
    takeProfit: 122.1,
    confidence: 6,
    executionQuality: 7,
    followedPlan: "Yes",
    notes: "Weakening momentum at resistance triggered a short after failed attempt to hold gains.",
    review: "Patience helped. Market rotated lower and the risk plan was respected.",
    tags: "reversal, fade",
    pnl: 495,
    returnPct: 4.17,
    rMultiple: 2.2,
  },
  {
    id: crypto.randomUUID(),
    symbol: "TSLA",
    side: "Long",
    strategy: "VWAP reclaim",
    setupType: "Pullback entry",
    entryDate: "2026-10-10",
    exitDate: "2026-10-12",
    entryPrice: 242.7,
    exitPrice: 235.4,
    quantity: 100,
    capitalUsed: 24270,
    fees: 18,
    stopLoss: 238.1,
    takeProfit: 248.6,
    confidence: 5,
    executionQuality: 4,
    followedPlan: "No",
    notes: "Entry was rushed after seeing a small bounce and I ignored the wider trend.",
    review: "The thesis was weak. I added size too quickly and held too long after the first sign of weakness.",
    tags: "risk, impatience",
    pnl: -715,
    returnPct: -2.95,
    rMultiple: -2.6,
  },
  {
    id: crypto.randomUUID(),
    symbol: "MSFT",
    side: "Long",
    strategy: "Trend",
    setupType: "Higher low",
    entryDate: "2026-10-15",
    exitDate: "2026-10-18",
    entryPrice: 428.1,
    exitPrice: 435.2,
    quantity: 35,
    capitalUsed: 14983.5,
    fees: 10,
    stopLoss: 423.2,
    takeProfit: 442.5,
    confidence: 8,
    executionQuality: 8,
    followedPlan: "Yes",
    notes: "Strong base building and continued earnings-season strength added conviction.",
    review: "Solid execution and patience ensured a clean gain.",
    tags: "trend, earnings",
    pnl: 251,
    returnPct: 1.68,
    rMultiple: 1.5,
  },
  {
    id: crypto.randomUUID(),
    symbol: "META",
    side: "Short",
    strategy: "Breakdown",
    setupType: "Failed breakout",
    entryDate: "2026-10-17",
    exitDate: "2026-10-20",
    entryPrice: 512.5,
    exitPrice: 525.8,
    quantity: 40,
    capitalUsed: 20500,
    fees: 15,
    stopLoss: 520.5,
    takeProfit: 496.8,
    confidence: 6,
    executionQuality: 3,
    followedPlan: "No",
    notes: "Trade was initially set up as a breakdown, but I failed to cut size after the move reversed.",
    review: "The invalidation was not respected. This was a process error more than a market error.",
    tags: "breakdown, mistake",
    pnl: -528,
    returnPct: -2.58,
    rMultiple: -2.1,
  },
];

const state = {
  trades: loadTrades(),
  activeView: "dashboard",
};

const els = {
  totalPnl: document.querySelector("#totalPnl"),
  totalReturn: document.querySelector("#totalReturn"),
  winRate: document.querySelector("#winRate"),
  bestStrategy: document.querySelector("#bestStrategy"),
  avgR: document.querySelector("#avgR"),
  tradeCount: document.querySelector("#tradeCount"),
  capitalUsed: document.querySelector("#capitalUsed"),
  largestLoss: document.querySelector("#largestLoss"),
  tradeList: document.querySelector("#tradeList"),
  strategyFilter: document.querySelector("#strategyFilter"),
  symbolFilter: document.querySelector("#symbolFilter"),
  strategyBreakdown: document.querySelector("#strategyBreakdown"),
  symbolBreakdown: document.querySelector("#symbolBreakdown"),
  insightList: document.querySelector("#insightList"),
  qualityOverview: document.querySelector("#qualityOverview"),
  patternSummary: document.querySelector("#patternSummary"),
  equityChart: document.querySelector("#equityChart"),
  tradeForm: document.querySelector("#tradeForm"),
  seedDataBtn: document.querySelector("#seedDataBtn"),
  calculateRiskBtn: document.querySelector("#calculateRiskBtn"),
  riskResult: document.querySelector("#riskResult"),
};

function loadTrades() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...seedTrades];
    }
  }
  return [...seedTrades];
}

function saveTrades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trades));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatPct(value) {
  return `${(value || 0).toFixed(2)}%`;
}

function calculateTradeMetrics(trade) {
  const sideFactor = trade.side === "Long" ? 1 : -1;
  const grossPnl = ((trade.exitPrice - trade.entryPrice) * trade.quantity * sideFactor) - (trade.fees || 0);
  const capital = Number(trade.capitalUsed || 0);
  const returnPct = capital ? (grossPnl / capital) * 100 : 0;

  let riskValue = 0;
  if (trade.stopLoss) {
    const riskDistance = trade.side === "Long"
      ? Math.abs(trade.entryPrice - trade.stopLoss)
      : Math.abs(trade.stopLoss - trade.entryPrice);
    riskValue = riskDistance * trade.quantity;
  }

  const rMultiple = riskValue ? grossPnl / riskValue : 0;

  return {
    ...trade,
    pnl: Number(grossPnl.toFixed(2)),
    returnPct: Number(returnPct.toFixed(2)),
    rMultiple: Number(rMultiple.toFixed(2)),
  };
}

function syncTradeMetrics(trades) {
  return trades.map((trade) => calculateTradeMetrics(trade));
}

function getFilteredTrades() {
  const symbolTerm = (els.symbolFilter?.value || "").trim().toLowerCase();
  const strategyTerm = els.strategyFilter?.value || "All";

  return state.trades.filter((trade) => {
    const symbolMatch = !symbolTerm || trade.symbol.toLowerCase().includes(symbolTerm);
    const strategyMatch = strategyTerm === "All" || trade.strategy === strategyTerm;
    return symbolMatch && strategyMatch;
  });
}

function renderStats() {
  const trades = syncTradeMetrics(state.trades);
  const totalPnl = trades.reduce((sum, item) => sum + item.pnl, 0);
  const totalCapital = trades.reduce((sum, item) => sum + Number(item.capitalUsed || 0), 0);
  const wins = trades.filter((item) => item.pnl > 0).length;
  const totalReturn = totalCapital ? (totalPnl / totalCapital) * 100 : 0;
  const avgR = trades.reduce((sum, item) => sum + item.rMultiple, 0) / (trades.length || 1);

  const strategyMap = {};
  trades.forEach((trade) => {
    const label = trade.strategy || "Unassigned";
    strategyMap[label] = (strategyMap[label] || 0) + trade.pnl;
  });

  const bestStrategy = Object.entries(strategyMap).sort((a, b) => b[1] - a[1])[0];

  els.totalPnl.textContent = formatCurrency(totalPnl);
  els.totalReturn.textContent = `${formatPct(totalReturn)} return`;
  els.winRate.textContent = `${trades.length ? ((wins / trades.length) * 100).toFixed(0) : 0}%`;
  els.bestStrategy.textContent = bestStrategy ? `Best strategy: ${bestStrategy[0]}` : "Best strategy: —";
  els.avgR.textContent = `${avgR.toFixed(2)}R`;
  els.tradeCount.textContent = `${trades.length} trades`;
  els.capitalUsed.textContent = formatCurrency(totalCapital);
  const maxLoss = Math.min(...trades.map((item) => item.pnl));
  els.largestLoss.textContent = `Largest loss: ${formatCurrency(maxLoss)}`;
}

function renderStrategyBreakdown() {
  const trades = syncTradeMetrics(state.trades);
  const strategyMap = {};
  trades.forEach((trade) => {
    const label = trade.strategy || "Unassigned";
    strategyMap[label] = (strategyMap[label] || 0) + trade.pnl;
  });

  const entries = Object.entries(strategyMap).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, value]) => Math.abs(value)), 1);

  els.strategyBreakdown.innerHTML = entries.length
    ? entries
        .map(([label, value]) => {
          const width = (Math.abs(value) / maxValue) * 100;
          return `
            <div class="bar-row">
              <div class="bar-meta">
                <span>${label}</span>
                <span>${formatCurrency(value)}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${width}%; background:${value >= 0 ? "linear-gradient(90deg, var(--success), #9ef1c6)" : "linear-gradient(90deg, var(--danger), #ff9bb5)"};"></div>
              </div>
            </div>
          `;
        })
        .join("")
    : '<div class="empty-state">No strategy data yet.</div>';
}

function renderSymbolBreakdown() {
  const trades = syncTradeMetrics(state.trades);
  const symbolMap = {};
  trades.forEach((trade) => {
    symbolMap[trade.symbol] = (symbolMap[trade.symbol] || 0) + trade.pnl;
  });

  const entries = Object.entries(symbolMap).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, value]) => Math.abs(value)), 1);

  els.symbolBreakdown.innerHTML = entries.length
    ? entries
        .slice(0, 5)
        .map(([symbol, value]) => {
          const width = (Math.abs(value) / maxValue) * 100;
          return `
            <div class="bar-row">
              <div class="bar-meta">
                <span>${symbol}</span>
                <span>${formatCurrency(value)}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${width}%; background:${value >= 0 ? "linear-gradient(90deg, var(--primary), #8ee7ff)" : "linear-gradient(90deg, #ff7ca3, #ffb2cf)"};"></div>
              </div>
            </div>
          `;
        })
        .join("")
    : '<div class="empty-state">No symbol data yet.</div>';
}

function renderInsights() {
  const trades = syncTradeMetrics(state.trades);
  const positiveTrades = trades.filter((trade) => trade.pnl > 0);
  const negativeTrades = trades.filter((trade) => trade.pnl < 0);
  const followPlan = trades.filter((trade) => trade.followedPlan === "Yes").length;
  const bestTrade = trades.reduce((winner, current) => (current.pnl > winner.pnl ? current : winner), trades[0] || { pnl: 0, symbol: "—" });
  const worstTrade = trades.reduce((winner, current) => (current.pnl < winner.pnl ? current : winner), trades[0] || { pnl: 0, symbol: "—" });

  const insights = [
    `${winsRateLabel(trades)} of your trades closed in profit.`,
    `You made ${formatCurrency(positiveTrades.reduce((sum, trade) => sum + trade.pnl, 0))} from successful trades and ${formatCurrency(Math.abs(negativeTrades.reduce((sum, trade) => sum + trade.pnl, 0)))} from losses.`,
    `You followed your trading plan in ${followPlan}/${trades.length || 0} trades.`,
    `${bestTrade.symbol} was your strongest trade at ${formatCurrency(bestTrade.pnl)}.`,
    `${worstTrade.symbol} was the weakest outcome and may deserve a review of risk or execution.`,
  ];

  els.insightList.innerHTML = insights.map((insight) => `<li>${insight}</li>`).join("");
}

function winsRateLabel(trades) {
  if (!trades.length) return "0%";
  const wins = trades.filter((trade) => trade.pnl > 0).length;
  return `${((wins / trades.length) * 100).toFixed(0)}%`;
}

function renderQualityOverview() {
  const trades = syncTradeMetrics(state.trades);
  const avgConfidence = trades.reduce((sum, t) => sum + Number(t.confidence || 0), 0) / (trades.length || 1);
  const avgExecution = trades.reduce((sum, t) => sum + Number(t.executionQuality || 0), 0) / (trades.length || 1);
  const followedPlan = trades.filter((t) => t.followedPlan === "Yes").length;

  els.qualityOverview.innerHTML = `
    <div class="quality-card">
      <span>Avg. confidence</span>
      <strong>${avgConfidence.toFixed(1)}/10</strong>
    </div>
    <div class="quality-card">
      <span>Avg. execution</span>
      <strong>${avgExecution.toFixed(1)}/10</strong>
    </div>
    <div class="quality-card">
      <span>Plan adherence</span>
      <strong>${trades.length ? ((followedPlan / trades.length) * 100).toFixed(0) : 0}%</strong>
    </div>
    <div class="quality-card">
      <span>Best trade</span>
      <strong>${trades.length ? `${formatCurrency(Math.max(...trades.map((t) => t.pnl)))}` : "$0.00"}</strong>
    </div>
  `;
}

function renderPatterns() {
  const trades = syncTradeMetrics(state.trades);
  const byStrategy = {};
  trades.forEach((trade) => {
    if (!byStrategy[trade.strategy]) byStrategy[trade.strategy] = { wins: 0, losses: 0, total: 0 };
    byStrategy[trade.strategy].total += 1;
    if (trade.pnl > 0) byStrategy[trade.strategy].wins += 1;
    if (trade.pnl < 0) byStrategy[trade.strategy].losses += 1;
  });

  const items = Object.entries(byStrategy)
    .map(([strategy, stats]) => ({
      strategy,
      summary: `${stats.wins} wins / ${stats.losses} losses`,
    }))
    .slice(0, 4);

  els.patternSummary.innerHTML = items.length
    ? items
        .map(
          (item) => `
        <div class="pattern-item">
          <strong>${item.strategy}</strong><br />
          ${item.summary}
        </div>
      `,
        )
        .join("")
    : '<div class="empty-state">Add trades to reveal patterns.</div>';
}

function renderEquityCurve() {
  const trades = syncTradeMetrics(state.trades);
  let runningTotal = 0;
  const points = trades.map((trade) => {
    runningTotal += trade.pnl;
    return runningTotal;
  });

  const width = 600;
  const height = 220;
  const padding = 20;

  if (!points.length) {
    els.equityChart.innerHTML = '<div class="empty-state">No equity data yet.</div>';
    return;
  }

  const min = Math.min(...points, 0);
  const max = Math.max(...points, 0);
  const range = max - min || 1;

  const path = points
    .map((point, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((point - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const lastY = height - padding - ((points[points.length - 1] - min) / range) * (height - padding * 2);

  els.equityChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Equity curve">
      <path d="M 20 ${height - 20} L 20 20 L ${width - 20} 20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <path d="${path}" fill="none" stroke="url(#lineGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${width - padding}" cy="${lastY}" r="5" fill="#66d9ef"/>
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="1"  y1="0" y2="0">
          <stop offset="0%" stop-color="#66d9ef" />
          <stop offset="100%" stop-color="#51d08a" />
        </linearGradient>
      </defs>
    </svg>
  `;
}

function renderTradeList() {
  const trades = syncTradeMetrics(getFilteredTrades()).sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));

  if (!trades.length) {
    els.tradeList.innerHTML = '<div class="empty-state">No trades match your filter.</div>';
    return;
  }

  els.tradeList.innerHTML = trades
    .slice(0, 8)
    .map(
      (trade) => `
        <article class="trade-item">
          <div class="trade-head">
            <h4>${trade.symbol}</h4>
            <span class="tag">${trade.strategy || "Unassigned"}</span>
          </div>
          <div class="trade-meta">
            <span>${trade.side}</span>
            <span>${trade.setupType || "General"}</span>
            <span>${trade.entryDate}</span>
          </div>
          <div class="item-inline">
            <span>Entry ${formatCurrency(trade.entryPrice)} • Exit ${formatCurrency(trade.exitPrice)}</span>
            <span class="trade-pnl ${trade.pnl >= 0 ? "positive" : "negative"}">${formatCurrency(trade.pnl)}</span>
          </div>
          <div class="trade-meta">
            <span>R: ${trade.rMultiple.toFixed(2)}R</span>
            <span>${trade.followedPlan === "Yes" ? "Plan followed" : "Plan missed"}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderFilters() {
  const strategyValues = [...new Set(state.trades.map((trade) => trade.strategy).filter(Boolean))];
  els.strategyFilter.innerHTML = ['<option value="All">All strategies</option>']
    .concat(strategyValues.map((value) => `<option value="${value}">${value}</option>`))
    .join("");
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(els.tradeForm);
  const trade = Object.fromEntries(formData.entries());

  const newTrade = {
    id: crypto.randomUUID(),
    symbol: trade.symbol.toUpperCase(),
    side: trade.side,
    strategy: trade.strategy || "Unassigned",
    setupType: trade.setupType || "General",
    entryDate: trade.entryDate,
    exitDate: trade.exitDate,
    entryPrice: Number(trade.entryPrice),
    exitPrice: Number(trade.exitPrice),
    quantity: Number(trade.quantity),
    capitalUsed: Number(trade.capitalUsed),
    fees: Number(trade.fees || 0),
    stopLoss: Number(trade.stopLoss || 0),
    takeProfit: Number(trade.takeProfit || 0),
    notes: trade.notes || "",
    review: trade.review || "",
    confidence: Number(trade.confidence || 6),
    executionQuality: Number(trade.executionQuality || 6),
    followedPlan: trade.followedPlan || "No",
    tags: trade.tags || "",
  };

  const completeTrade = calculateTradeMetrics(newTrade);
  state.trades = syncTradeMetrics([...state.trades, completeTrade]);
  saveTrades();
  renderAll();
  els.tradeForm.reset();
}

function seedData() {
  state.trades = syncTradeMetrics(seedTrades);
  saveTrades();
  renderAll();
}

function renderRiskTool() {
  const accountSize = Number(document.querySelector("#accountSize").value || 0);
  const riskPercent = Number(document.querySelector("#riskPercent").value || 0) / 100;
  const stopDistance = Number(document.querySelector("#stopDistance").value || 0) / 100;

  const riskAmount = accountSize * riskPercent;
  const positionSize = riskAmount / stopDistance;

  els.riskResult.innerHTML = `
    Max risk per trade: <strong>${formatCurrency(riskAmount)}</strong><br />
    Suggested position size: <strong>${positionSize.toFixed(2)} units</strong><br />
    Estimated stop distance: <strong>${(stopDistance * 100).toFixed(2)}%</strong>
  `;
}

function setView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active-panel", panel.id === viewName);
  });
}

function renderAll() {
  renderStats();
  renderStrategyBreakdown();
  renderSymbolBreakdown();
  renderInsights();
  renderQualityOverview();
  renderPatterns();
  renderEquityCurve();
  renderTradeList();
  renderFilters();
  setView(state.activeView);
}

function registerListeners() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  els.tradeForm.addEventListener("submit", handleSubmit);
  els.seedDataBtn.addEventListener("click", seedData);
  els.calculateRiskBtn.addEventListener("click", renderRiskTool);
  els.symbolFilter.addEventListener("input", renderTradeList);
  els.strategyFilter.addEventListener("change", renderTradeList);
}

registerListeners();
renderAll();


































































































