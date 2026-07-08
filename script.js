const startScreen = document.getElementById('startScreen');
const analysisScreen = document.getElementById('analysisScreen');
const reportScreen = document.getElementById('reportScreen');
const uploadTrigger = document.getElementById('uploadTrigger');
const manualTrigger = document.getElementById('manualTrigger');
const manualPanel = document.getElementById('manualPanel');
const manualForm = document.getElementById('manualForm');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const analysisItems = document.querySelectorAll('.analysis-item');

let finosAnalysis = {};

const defaultInput = {
  businessName: 'Demo Business',
  industry: 'Hospitality',
  country: 'Italy',
  financialYear: '2025',
  revenue: 1240000,
  cogs: 570000,
  payroll: 240000,
  rent: 90000,
  marketing: 45000,
  otherExpenses: 85000,
  interest: 15000,
  taxes: 30000,
  cash: 180000,
  inventory: 60000,
  accountsReceivable: 95000,
  accountsPayable: 70000,
  debt: 220000
};

const demoLeaders = [
  { name: 'Northstar Studio', score: 91, category: 'Services' },
  { name: 'Alta Retail Group', score: 88, category: 'Retail' },
  { name: 'Marble Hospitality', score: 84, category: 'Hospitality' },
  { name: 'FINOS Labs', score: 81, category: 'Software' },
  { name: 'Urban Goods Co.', score: 76, category: 'Commerce' }
];

uploadTrigger.addEventListener('click', () => fileInput.click());

manualTrigger.addEventListener('click', () => {
  manualPanel.classList.toggle('hidden');
  if (!manualPanel.classList.contains('hidden')) {
    manualPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    runFinos(defaultInput, `Uploaded: ${fileInput.files[0].name}`);
  }
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');

  if (event.dataTransfer.files.length > 0) {
    runFinos(defaultInput, `Uploaded: ${event.dataTransfer.files[0].name}`);
  }
});

manualForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = {
    businessName: value('businessName') || 'Your Business',
    industry: value('industry') || 'General Business',
    country: value('country') || 'Not specified',
    financialYear: value('financialYear') || new Date().getFullYear().toString(),
    revenue: number('revenue'),
    cogs: number('cogs'),
    payroll: number('payroll'),
    rent: number('rent'),
    marketing: number('marketing'),
    otherExpenses: number('otherExpenses'),
    interest: number('interest'),
    taxes: number('taxes'),
    cash: number('cash'),
    inventory: number('inventory'),
    accountsReceivable: number('accountsReceivable'),
    accountsPayable: number('accountsPayable'),
    debt: number('debt')
  };

  if (!validateInput(input)) return;

  runFinos(input, 'Manual financial input');
});

document.getElementById('runAgain').addEventListener('click', () => {
  reportScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('askButton').addEventListener('click', answerQuestion);

document.getElementById('aiQuestion').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') answerQuestion();
});

function value(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function number(id) {
  const element = document.getElementById(id);
  return element ? Number(element.value) : 0;
}

function validateInput(input) {
  const required = [
    'revenue',
    'cogs',
    'payroll',
    'rent',
    'marketing',
    'otherExpenses',
    'interest',
    'taxes',
    'cash',
    'inventory',
    'accountsReceivable',
    'accountsPayable',
    'debt'
  ];

  const invalid = required.some((key) => !Number.isFinite(input[key]));

  if (invalid || input.revenue <= 0) {
    alert('Please enter valid financial numbers. Revenue must be greater than zero.');
    return false;
  }

  const totalCost = input.cogs + input.payroll + input.rent + input.marketing + input.otherExpenses + input.interest + input.taxes;

  if (totalCost > input.revenue * 3) {
    alert('Please check your costs. They look unusually high compared with revenue.');
    return false;
  }

  return true;
}

function runFinos(input, subtitle) {
  startScreen.classList.add('hidden');
  reportScreen.classList.add('hidden');
  analysisScreen.classList.remove('hidden');

  document.getElementById('analysisSubtitle').textContent = subtitle || 'Analyzing your financial data.';

  analysisItems.forEach((item) => item.classList.remove('active', 'done'));

  let index = 0;

  const interval = setInterval(() => {
    if (index > 0) {
      analysisItems[index - 1].classList.remove('active');
      analysisItems[index - 1].classList.add('done');
    }

    if (index < analysisItems.length) {
      analysisItems[index].classList.add('active');
      index += 1;
    } else {
      clearInterval(interval);
      setTimeout(() => showReport(input), 700);
    }
  }, 650);
}

function showReport(input) {
  finosAnalysis = buildFinosAnalysis(input);

  analysisScreen.classList.add('hidden');
  reportScreen.classList.remove('hidden');

  renderReport(finosAnalysis);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildFinosAnalysis(input) {
  const financials = calculateFinancials(input);
  const score = calculateFinosScore(financials);
  const benchmarks = calculateBenchmarks(financials, score);
  const insights = generateInsights(financials, benchmarks);
  const analytics = generateAnalytics(score);

  return {
    company: {
      name: input.businessName,
      industry: input.industry,
      country: input.country,
      financialYear: input.financialYear
    },
    input,
    financials,
    score,
    benchmarks,
    insights,
    analytics,
    createdAt: new Date().toISOString()
  };
}

function calculateFinancials(input) {
  const revenue = input.revenue;
  const grossProfit = revenue - input.cogs;

  const operatingExpenses =
    input.payroll +
    input.rent +
    input.marketing +
    input.otherExpenses;

  const operatingProfit = grossProfit - operatingExpenses;

  const netProfit =
    operatingProfit -
    input.interest -
    input.taxes;

  const totalCosts =
    input.cogs +
    operatingExpenses +
    input.interest +
    input.taxes;

  const currentAssets =
    input.cash +
    input.inventory +
    input.accountsReceivable;

  const workingCapital =
    currentAssets -
    input.accountsPayable;

  const currentRatio =
    input.accountsPayable > 0 ? currentAssets / input.accountsPayable : 3;

  const cashRunwayMonths =
    operatingExpenses > 0 ? input.cash / (operatingExpenses / 12) : 12;

  const estimatedCashFlow =
    netProfit + Math.max(0, input.accountsPayable - input.accountsReceivable);

  return {
    revenue,
    cogs: input.cogs,
    grossProfit,
    grossMargin: ratio(grossProfit, revenue),
    operatingExpenses,
    operatingProfit,
    operatingMargin: ratio(operatingProfit, revenue),
    netProfit,
    netMargin: ratio(netProfit, revenue),
    totalCosts,
    costRatio: ratio(totalCosts, revenue),
    payrollRatio: ratio(input.payroll, revenue),
    rentRatio: ratio(input.rent, revenue),
    marketingRatio: ratio(input.marketing, revenue),
    cash: input.cash,
    inventory: input.inventory,
    accountsReceivable: input.accountsReceivable,
    accountsPayable: input.accountsPayable,
    debt: input.debt,
    workingCapital,
    workingCapitalRatio: ratio(workingCapital, revenue),
    currentRatio,
    cashRunwayMonths,
    estimatedCashFlow,
    debtToRevenue: ratio(input.debt, revenue)
  };
}

function calculateFinosScore(financials) {
  const profitability = clamp(
    Math.round(
      financials.grossMargin * 0.35 +
      financials.operatingMargin * 1.2 +
      financials.netMargin * 1.8
    ),
    10,
    98
  );

  const liquidity = clamp(
    Math.round(
      Math.min(financials.cashRunwayMonths, 12) * 7 +
      Math.min(financials.currentRatio, 3) * 10 +
      Math.max(financials.workingCapitalRatio, 0) * 0.4
    ),
    10,
    98
  );

  const efficiency = clamp(
    Math.round(
      100 -
      Math.max(0, financials.costRatio - 75) * 1.2 -
      Math.max(0, financials.payrollRatio - 28) * 1.1 -
      Math.max(0, financials.rentRatio - 10) * 1.2
    ),
    10,
    98
  );

  const stability = clamp(
    Math.round(
      90 -
      Math.max(0, financials.debtToRevenue - 25) * 0.8 +
      Math.min(financials.netMargin, 20) * 0.5
    ),
    10,
    98
  );

  const growth = 72;

  const value = Math.round(
    profitability * 0.3 +
    liquidity * 0.22 +
    efficiency * 0.22 +
    stability * 0.16 +
    growth * 0.1
  );

  const label =
    value >= 85 ? 'Excellent' :
    value >= 72 ? 'Healthy' :
    value >= 58 ? 'Watchlist' :
    'Needs Attention';

  return {
    value,
    label,
    drivers: {
      profitability,
      liquidity,
      efficiency,
      stability,
      growth
    }
  };
}

function calculateBenchmarks(financials, score) {
  const benchmarkPercent = clamp(Math.round(score.value - 4), 18, 96);

  return {
    benchmarkPercent,
    rows: [
      {
        label: 'Gross Margin',
        actual: financials.grossMargin,
        benchmark: 55,
        unit: '%'
      },
      {
        label: 'Net Margin',
        actual: financials.netMargin,
        benchmark: 12,
        unit: '%'
      },
      {
        label: 'Payroll Ratio',
        actual: financials.payrollRatio,
        benchmark: 28,
        unit: '%',
        lowerIsBetter: true
      },
      {
        label: 'Cost Ratio',
        actual: financials.costRatio,
        benchmark: 82,
        unit: '%',
        lowerIsBetter: true
      }
    ]
  };
}

function generateInsights(financials, benchmarks) {
  const grossMarginGap = Math.max(0, 55 - financials.grossMargin);
  const payrollGap = Math.max(0, financials.payrollRatio - 28);
  const rentGap = Math.max(0, financials.rentRatio - 10);
  const cashGap = Math.max(0, financials.revenue * 0.08 - financials.cash);

  return [
    {
      title: payrollGap > 0 ? 'Payroll is above benchmark' : 'Payroll appears controlled',
      body: payrollGap > 0
        ? 'Payroll is consuming more revenue than the FINOS benchmark range. Improving scheduling, productivity, or staffing mix could raise profitability.'
        : 'Payroll is within the benchmark range. Protect this efficiency as revenue grows.',
      impact: payrollGap > 0 ? financials.revenue * (payrollGap / 100) : financials.revenue * 0.01
    },
    {
      title: grossMarginGap > 0 ? 'Gross margin below target' : 'Gross margin is strong',
      body: grossMarginGap > 0
        ? 'Improving pricing, purchasing, waste, or delivery mix could directly increase profit.'
        : 'Gross margin is currently a strength. The priority is to protect it while scaling.',
      impact: grossMarginGap > 0 ? financials.revenue * (grossMarginGap / 100) : financials.revenue * 0.02
    },
    {
      title: rentGap > 0 ? 'Rent burden is elevated' : 'Rent ratio is healthy',
      body: rentGap > 0
        ? 'Rent is high relative to revenue. Increasing sales density or renegotiating fixed costs could improve operating margin.'
        : 'Rent looks healthy relative to revenue.',
      impact: rentGap > 0 ? financials.revenue * (rentGap / 100) : financials.revenue * 0.008
    },
    {
      title: cashGap > 0 ? 'Cash buffer could be stronger' : 'Cash position is healthy',
      body: cashGap > 0
        ? 'The business may benefit from a stronger liquidity reserve. Faster collections or better working capital discipline could improve resilience.'
        : 'Cash position appears healthy relative to annual revenue.',
      impact: cashGap > 0 ? cashGap : financials.cash * 0.05
    }
  ];
}

function generateAnalytics(score) {
  return [
    ['Profitability', score.drivers.profitability],
    ['Liquidity', score.drivers.liquidity],
    ['Efficiency', score.drivers.efficiency],
    ['Stability', score.drivers.stability],
    ['Growth', score.drivers.growth]
  ];
}

function renderReport(analysis) {
  renderScore(analysis);
  renderScoreDrivers(analysis);
  renderFinancialCards(analysis);
  renderBenchmarks(analysis);
  renderLeaders(analysis);
  renderInsights(analysis);
  renderAnalytics(analysis);
}

function renderScoreDrivers(analysis) {
  let container = document.getElementById('scoreDrivers');

  if (!container) {
    const financialSection = document.getElementById('financialCards')?.closest('.report-section');

    const section = document.createElement('section');
    section.className = 'report-section';
    section.innerHTML = `
      <div class="section-heading">
        <span>FINOS Score™</span>
        <h2>Why this score?</h2>
        <p>The FINOS Score is calculated from profitability, liquidity, efficiency, stability, and growth.</p>
      </div>
      <div id="scoreDrivers" class="score-drivers"></div>
    `;

    financialSection.parentNode.insertBefore(section, financialSection);
    container = document.getElementById('scoreDrivers');
  }

  const drivers = [
    ['Profitability', analysis.score.drivers.profitability, 'Margins and profit strength'],
    ['Liquidity', analysis.score.drivers.liquidity, 'Cash, runway, and working capital'],
    ['Efficiency', analysis.score.drivers.efficiency, 'Cost discipline and operating leverage'],
    ['Stability', analysis.score.drivers.stability, 'Debt pressure and resilience'],
    ['Growth', analysis.score.drivers.growth, 'Revenue momentum placeholder']
  ];

  const strongest = drivers.reduce((best, item) => item[1] > best[1] ? item : best, drivers[0]);
  const weakest = drivers.reduce((worst, item) => item[1] < worst[1] ? item : worst, drivers[0]);

  container.innerHTML = `
    <div class="score-driver-summary glass-card">
      <div>
        <span>Strongest driver</span>
        <strong>${strongest[0]}</strong>
        <small>${strongest[2]}</small>
      </div>
      <div>
        <span>Needs most attention</span>
        <strong>${weakest[0]}</strong>
        <small>${weakest[2]}</small>
      </div>
    </div>

    <div class="score-driver-bars glass-card">
      ${drivers.map((driver) => `
        <div class="score-driver-row">
          <div class="score-driver-top">
            <span>${driver[0]}</span>
            <strong>${driver[1]}/100</strong>
          </div>
          <div class="score-driver-track">
            <div class="score-driver-fill" style="width:${driver[1]}%"></div>
          </div>
          <small>${driver[2]}</small>
        </div>
      `).join('')}
    </div>
  `;
}

function renderScore(analysis) {
  const scoreDegrees = Math.round((analysis.score.value / 100) * 360);

  document.getElementById('scoreRing').style.background =
    `conic-gradient(#fff 0deg, #8e8e8e ${scoreDegrees}deg, rgba(255,255,255,.08) ${scoreDegrees}deg)`;

  document.getElementById('scoreValue').textContent = analysis.score.value;
  document.getElementById('scoreLabel').textContent = analysis.score.label;
  document.getElementById('scoreNarrative').textContent = narrative(analysis);
  document.getElementById('benchmarkPercent').textContent = `${analysis.benchmarks.benchmarkPercent}%`;
}

function renderFinancialCards(analysis) {
  const f = analysis.financials;

  document.getElementById('financialCards').innerHTML = [
    ['Revenue', money(f.revenue), 'Top-line scale'],
    ['Gross Profit', money(f.grossProfit), `${pct(f.grossMargin)} gross margin`],
    ['Operating Profit', money(f.operatingProfit), `${pct(f.operatingMargin)} operating margin`],
    ['Net Profit', money(f.netProfit), `${pct(f.netMargin)} net margin`],
    ['Cost Ratio', pct(f.costRatio), 'Total costs vs revenue'],
    ['Payroll Ratio', pct(f.payrollRatio), 'People cost load'],
    ['Rent Ratio', pct(f.rentRatio), 'Fixed cost pressure'],
    ['Marketing Ratio', pct(f.marketingRatio), 'Growth investment'],
    ['Cash', money(f.cash), `${f.cashRunwayMonths.toFixed(1)} months runway`],
    ['Working Capital', money(f.workingCapital), 'Operating liquidity'],
    ['Current Ratio', f.currentRatio.toFixed(2), 'Short-term liquidity'],
    ['Debt', money(f.debt), `${pct(f.debtToRevenue)} of revenue`]
  ].map((card) => `
    <article class="metric-card">
      <span>${card[0]}</span>
      <strong>${card[1]}</strong>
      <small>${card[2]}</small>
    </article>
  `).join('');
}

function renderBenchmarks(analysis) {
  document.getElementById('benchmarkRows').innerHTML = analysis.benchmarks.rows.map((row) => {
    const good = row.lowerIsBetter
      ? row.actual <= row.benchmark
      : row.actual >= row.benchmark;

    return `
      <div class="benchmark-row">
        <span>${row.label}</span>
        <strong>${pct(row.actual)}</strong>
        <span>${good ? 'Above target' : `Benchmark ${row.benchmark}%`}</span>
      </div>
    `;
  }).join('');
}

function renderInsights(analysis) {
  document.getElementById('insightsList').innerHTML = analysis.insights.map((insight, index) => `
    <article class="insight-card">
      <span>Opportunity ${index + 1}</span>
      <h3>${insight.title}</h3>
      <p>${insight.body}</p>
      <strong>Estimated impact ${money(insight.impact)}</strong>
    </article>
  `).join('');
}

function renderAnalytics(analysis) {
  document.getElementById('analyticsBars').innerHTML = analysis.analytics.map((row) => `
    <div class="bar-row">
      <div class="bar-label">${row[0]}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${row[1]}%"></div>
      </div>
      <div class="bar-value">${row[1]}</div>
    </div>
  `).join('');
}

function renderLeaders(analysis) {
  const current = {
    name: analysis.company.name || 'Current participant',
    score: analysis.score.value,
    category: analysis.company.industry || 'Current report',
    current: true
  };

  const saved = JSON.parse(localStorage.getItem('finosLeaders') || '[]');
  const withoutDuplicate = saved.filter((item) => item.name !== current.name);

  const leaders = [...demoLeaders, ...withoutDuplicate, current]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  localStorage.setItem(
    'finosLeaders',
    JSON.stringify([current, ...withoutDuplicate].slice(0, 12))
  );

  document.getElementById('leadersList').innerHTML = leaders.map((leader, index) => `
    <div class="leader-row ${leader.current ? 'current' : ''}">
      <div class="leader-rank">${index + 1}</div>
      <div class="leader-name">
        <strong>${escapeHtml(leader.name)}</strong>
        <span>${escapeHtml(leader.category)}</span>
      </div>
      <div class="leader-score">${leader.score}</div>
      <div class="leader-tag">${leader.current ? 'You' : 'Live'}</div>
    </div>
  `).join('');
}

function answerQuestion() {
  const question = document.getElementById('aiQuestion').value.toLowerCase();
  const answer = document.getElementById('aiAnswer');

  if (!question.trim() || !finosAnalysis.financials) return;

  const f = finosAnalysis.financials;
  const score = finosAnalysis.score.value;

  if (question.includes('score')) {
    answer.textContent =
      `Your FINOS Score is ${score}/100. It is mainly driven by profitability, liquidity, efficiency, stability, and growth. The fastest improvement area is shown in AI Insights.`;
  } else if (question.includes('cash')) {
    answer.textContent =
      `Your cash position is ${money(f.cash)}, with an estimated ${f.cashRunwayMonths.toFixed(1)} months of runway. Improving collections and working capital can strengthen liquidity.`;
  } else if (question.includes('margin') || question.includes('profit')) {
    answer.textContent =
      `Your net margin is ${pct(f.netMargin)} and gross margin is ${pct(f.grossMargin)}. The strongest profit levers are pricing, COGS control, payroll discipline, and fixed cost efficiency.`;
  } else if (question.includes('debt')) {
    answer.textContent =
      `Your debt is ${money(f.debt)}, equal to ${pct(f.debtToRevenue)} of annual revenue. FINOS treats lower debt pressure as a stability advantage.`;
  } else {
    answer.textContent =
      'FINOS would investigate your score drivers, benchmark gaps, financial ratios, and highest-impact insights first. In the full product, this chat will answer directly from uploaded financial statements.';
  }
}

function narrative(analysis) {
  const score = analysis.score.value;

  if (score >= 85) {
    return 'Your business is financially strong. The main opportunity is to protect margins while scaling efficiently.';
  }

  if (score >= 72) {
    return 'Your business is healthy, but there are clear opportunities to improve profitability, efficiency, or cash flow.';
  }

  if (score >= 58) {
    return 'Your business has meaningful financial pressure. Focus on the largest margin, cost, or liquidity gap first.';
  }

  return 'Your business needs attention. FINOS detected several financial weaknesses that may be suppressing cash flow and enterprise value.';
}

function ratio(a, b) {
  return b === 0 ? 0 : (a / b) * 100;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function money(n) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(n);
}

function pct(n) {
  return `${Number(n).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
