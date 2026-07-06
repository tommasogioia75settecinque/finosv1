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

const defaultData = {
  businessName: 'Your Business',
  revenue: 1240000,
  cogs: 570000,
  sga: 285000,
  ebitda: 205000,
  netIncome: 132000,
  cash: 180000,
  workingCapital: 95000,
  growth: 12
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
  if (!manualPanel.classList.contains('hidden')) manualPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) runFinos(defaultData, `Uploaded: ${fileInput.files[0].name}`);
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  if (event.dataTransfer.files.length > 0) runFinos(defaultData, `Uploaded: ${event.dataTransfer.files[0].name}`);
});

manualForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = {
    businessName: value('businessName') || 'Your Business',
    revenue: number('revenue'),
    cogs: number('cogs'),
    sga: number('sga'),
    ebitda: number('ebitda'),
    netIncome: number('netIncome'),
    cash: number('cash'),
    workingCapital: number('workingCapital'),
    growth: number('growth')
  };
  if (!validateData(data)) return;
  runFinos(data, 'Manual financial input');
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

function value(id){ return document.getElementById(id).value.trim(); }
function number(id){ return Number(document.getElementById(id).value); }
function validateData(data){
  const required = ['revenue','cogs','sga','ebitda','netIncome','cash','workingCapital','growth'];
  const invalid = required.some(key => !Number.isFinite(data[key]));
  if (invalid || data.revenue <= 0) {
    alert('Please enter valid financial numbers. Revenue must be greater than zero.');
    return false;
  }
  if (data.cogs > data.revenue * 2 || data.sga > data.revenue * 2) {
    alert('Please check your costs. They look unusually high compared with revenue.');
    return false;
  }
  return true;
}

function runFinos(data, subtitle){
  startScreen.classList.add('hidden');
  reportScreen.classList.add('hidden');
  analysisScreen.classList.remove('hidden');
  document.getElementById('analysisSubtitle').textContent = subtitle || 'Analyzing your financial data.';
  analysisItems.forEach(item => item.classList.remove('active','done'));
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
      setTimeout(() => showReport(data), 700);
    }
  }, 650);
}

function showReport(data){
  const report = calculateReport(data);
  analysisScreen.classList.add('hidden');
  reportScreen.classList.remove('hidden');
  renderReport(report);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateReport(data){
  const revenue = data.revenue;
  const grossProfit = revenue - data.cogs;
  const grossMargin = ratio(grossProfit, revenue);
  const sgaRatio = ratio(data.sga, revenue);
  const ebitdaMargin = ratio(data.ebitda, revenue);
  const netMargin = ratio(data.netIncome, revenue);
  const cashRunwayMonths = data.sga > 0 ? data.cash / (data.sga / 12) : 12;
  const workingCapitalRatio = ratio(data.workingCapital, revenue);

  const profitability = clamp(Math.round((grossMargin * .35) + (ebitdaMargin * 1.6) + (netMargin * 1.8)), 10, 98);
  const liquidity = clamp(Math.round(Math.min(cashRunwayMonths, 12) * 8 + Math.max(workingCapitalRatio, 0) * 60), 10, 98);
  const growth = clamp(Math.round(65 + data.growth * 1.6), 10, 98);
  const efficiency = clamp(Math.round(95 - Math.max(0, sgaRatio - 22) * 1.7), 10, 98);
  const stability = clamp(Math.round((profitability + liquidity + efficiency) / 3), 10, 98);
  const score = Math.round((profitability * .28) + (liquidity * .22) + (growth * .18) + (efficiency * .2) + (stability * .12));

  const label = score >= 85 ? 'Excellent' : score >= 72 ? 'Healthy' : score >= 58 ? 'Watchlist' : 'Needs Attention';
  const benchmarkPercent = clamp(Math.round(score - 6 + data.growth * .7), 18, 96);

  const grossMarginGap = Math.max(0, 55 - grossMargin);
  const sgaGap = Math.max(0, sgaRatio - 22);
  const marginUpside = revenue * (grossMarginGap / 100);
  const sgaUpside = revenue * (sgaGap / 100);
  const cashUpside = Math.max(0, revenue * .08 - data.workingCapital);

  return {
    data,
    score,
    label,
    benchmarkPercent,
    metrics: { revenue, grossProfit, grossMargin, sgaRatio, ebitdaMargin, netMargin, cashRunwayMonths, workingCapitalRatio },
    drivers: { profitability, liquidity, growth, efficiency, stability },
    insights: [
      {
        title: sgaGap > 0 ? 'SG&A is above benchmark' : 'SG&A is controlled',
        body: sgaGap > 0 ? 'Administrative expenses are consuming more revenue than the FINOS benchmark range.' : 'Your SG&A base appears controlled relative to revenue.',
        impact: sgaGap > 0 ? sgaUpside : revenue * .015
      },
      {
        title: grossMarginGap > 0 ? 'Gross margin below target' : 'Gross margin is strong',
        body: grossMarginGap > 0 ? 'Improving pricing, purchasing, or delivery mix could lift EBITDA directly.' : 'Gross margin is currently a strength. Protect it as revenue grows.',
        impact: grossMarginGap > 0 ? marginUpside : revenue * .02
      },
      {
        title: cashUpside > 0 ? 'Working capital opportunity' : 'Cash conversion is healthy',
        body: cashUpside > 0 ? 'There may be liquidity trapped in receivables, inventory, or payment timing.' : 'Working capital appears healthy relative to revenue.',
        impact: cashUpside > 0 ? cashUpside : data.cash * .08
      }
    ]
  };
}

function renderReport(report){
  const scoreDegrees = Math.round(report.score / 100 * 360);
  document.getElementById('scoreRing').style.background = `conic-gradient(#fff 0deg, #8e8e8e ${scoreDegrees}deg, rgba(255,255,255,.08) ${scoreDegrees}deg)`;
  document.getElementById('scoreValue').textContent = report.score;
  document.getElementById('scoreLabel').textContent = report.label;
  document.getElementById('scoreNarrative').textContent = narrative(report);
  document.getElementById('benchmarkPercent').textContent = `${report.benchmarkPercent}%`;

  document.getElementById('financialCards').innerHTML = [
    ['Revenue', money(report.metrics.revenue), 'Top-line scale'],
    ['Gross Margin', pct(report.metrics.grossMargin), 'After COGS'],
    ['EBITDA Margin', pct(report.metrics.ebitdaMargin), 'Operating profitability'],
    ['Net Margin', pct(report.metrics.netMargin), 'Bottom-line result'],
    ['SG&A', pct(report.metrics.sgaRatio), 'Operating expense load'],
    ['Cash Runway', `${report.metrics.cashRunwayMonths.toFixed(1)} mo`, 'Liquidity cushion'],
    ['Working Capital', money(report.data.workingCapital), 'Operating liquidity'],
    ['Growth', pct(report.data.growth), 'Revenue trend']
  ].map(card => `
    <article class="metric-card">
      <span>${card[0]}</span>
      <strong>${card[1]}</strong>
      <small>${card[2]}</small>
    </article>
  `).join('');

  document.getElementById('benchmarkRows').innerHTML = [
    ['Gross Margin', pct(report.metrics.grossMargin), '55% benchmark'],
    ['EBITDA Margin', pct(report.metrics.ebitdaMargin), '18% benchmark'],
    ['SG&A', pct(report.metrics.sgaRatio), '22% benchmark']
  ].map(row => `
    <div class="benchmark-row"><span>${row[0]}</span><strong>${row[1]}</strong><span>${row[2]}</span></div>
  `).join('');

  document.getElementById('insightsList').innerHTML = report.insights.map((insight, index) => `
    <article class="insight-card">
      <span>Opportunity ${index + 1}</span>
      <h3>${insight.title}</h3>
      <p>${insight.body}</p>
      <strong>Estimated impact ${money(insight.impact)}</strong>
    </article>
  `).join('');

  document.getElementById('analyticsBars').innerHTML = [
    ['Profitability', report.drivers.profitability],
    ['Liquidity', report.drivers.liquidity],
    ['Growth', report.drivers.growth],
    ['Efficiency', report.drivers.efficiency],
    ['Stability', report.drivers.stability]
  ].map(row => `
    <div class="bar-row">
      <div class="bar-label">${row[0]}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${row[1]}%"></div></div>
      <div class="bar-value">${row[1]}</div>
    </div>
  `).join('');

  renderLeaders(report);
}

function renderLeaders(report){
  const currentName = report.data.businessName || 'Current participant';
  const current = {
    name: currentName,
    score: report.score,
    category: 'Current report',
    current: true
  };

  const saved = JSON.parse(localStorage.getItem('finosLeaders') || '[]');
  const withoutDuplicate = saved.filter(item => item.name !== current.name);
  const leaders = [...demoLeaders, ...withoutDuplicate, current]
    .sort((a,b) => b.score - a.score)
    .slice(0, 8);

  localStorage.setItem('finosLeaders', JSON.stringify([current, ...withoutDuplicate].slice(0, 12)));

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

function escapeHtml(value){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function answerQuestion(){
  const question = document.getElementById('aiQuestion').value.toLowerCase();
  const answer = document.getElementById('aiAnswer');
  if (!question.trim()) return;
  if (question.includes('score')) {
    answer.textContent = 'Your FINOS Score is driven by profitability, liquidity, growth, efficiency, and stability. The fastest way to improve it is to address the largest gap shown in AI Insights.';
  } else if (question.includes('cash')) {
    answer.textContent = 'The cash view focuses on cash position, working capital, and estimated runway. Improve collections and reduce trapped working capital to strengthen liquidity.';
  } else if (question.includes('margin') || question.includes('profit')) {
    answer.textContent = 'Profitability improves fastest through gross margin expansion and SG&A discipline. FINOS prioritizes the opportunity with the largest estimated financial impact.';
  } else {
    answer.textContent = 'FINOS would investigate the score drivers, benchmark gaps, and AI Insights first. In the full product, this chat will answer directly from uploaded financial statements.';
  }
}

function narrative(report){
  if (report.score >= 85) return 'Your business is financially strong. The main opportunity is to protect margins while scaling efficiently.';
  if (report.score >= 72) return 'Your business is healthy, but there are clear opportunities to improve profitability, efficiency, or cash flow.';
  if (report.score >= 58) return 'Your business has meaningful financial pressure. Focus on the largest margin or expense gap first.';
  return 'Your business needs attention. FINOS detected several financial weaknesses that may be suppressing cash flow and enterprise value.';
}
function ratio(a,b){ return b === 0 ? 0 : (a / b) * 100; }
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
function money(n){ return new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Math.max(0,n)); }
function pct(n){ return `${Number(n).toFixed(1)}%`; }
