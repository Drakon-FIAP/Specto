/* ============================================================
   SPECTO Dashboard — dashboard.js
   ============================================================ */

'use strict';

// ── DATA ─────────────────────────────────────────────────────

const MONTHS = ['Jul/25','Ago/25','Set/25','Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26'];

function generateTemporalData() {
  const ndvi  = [0.72,0.74,0.76,0.73,0.70,0.68,0.71,0.75,0.78,0.81,0.83,0.84];
  const ndwi  = [0.60,0.61,0.62,0.60,0.58,0.56,0.58,0.60,0.62,0.64,0.66,0.67];
  const nbr   = [0.08,0.07,0.06,0.08,0.10,0.12,0.09,0.07,0.06,0.05,0.05,0.05];
  return { ndvi, ndwi, nbr };
}

function generateArduinoData() {
  const hours = Array.from({length: 13}, (_, i) => `${String(i * 2).padStart(2,'0')}h`);
  const temp  = [26,25,24,24,25,27,29,31,32,31,30,29,28];
  const umid  = [78,80,82,83,81,76,72,68,65,67,70,72,74];
  const chuva = [0,0,0,2,5,3,0,0,0,0,1,0,0];
  return { hours, temp, umid, chuva };
}

// ── MINI CHARTS ──────────────────────────────────────────────

function drawMiniChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 200;
  canvas.width  = W;
  canvas.height = 40;
  const H = 40;
  const min = Math.min(...data) - 0.02;
  const max = Math.max(...data) + 0.02;
  const range = max - min || 1;
  const pad = 4;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - pad * 2));
  const ys = data.map(v => H - pad - ((v - min) / range) * (H - pad * 2));

  // gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.moveTo(xs[0], H);
  xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
  ctx.lineTo(xs[xs.length - 1], H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // line
  ctx.beginPath();
  ctx.moveTo(xs[0], ys[0]);
  xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // last dot
  const lx = xs[xs.length - 1];
  const ly = ys[ys.length - 1];
  ctx.beginPath();
  ctx.arc(lx, ly, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// ── MAIN CHARTS ──────────────────────────────────────────────

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111d2c',
      borderColor: '#1e3348',
      borderWidth: 1,
      titleColor: '#dceeff',
      bodyColor: '#6b8ea8',
      padding: 10,
      titleFont: { family: 'Space Mono', size: 11 },
      bodyFont: { family: 'DM Sans', size: 12 },
    }
  },
  scales: {
    x: {
      grid: { color: '#162236', drawTicks: false },
      ticks: { color: '#3d5870', font: { size: 10, family: 'Space Mono' } }
    },
    y: {
      grid: { color: '#162236', drawTicks: false },
      ticks: { color: '#3d5870', font: { size: 10, family: 'Space Mono' } }
    }
  },
  elements: {
    point: { radius: 3, hoverRadius: 5 },
    line: { tension: 0.4, borderWidth: 2 }
  }
};

function initTemporalChart() {
  const { ndvi, ndwi, nbr } = generateTemporalData();
  const ctx = document.getElementById('chartTemporal');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: 'NDVI',
          data: ndvi,
          borderColor: '#39ff6e',
          backgroundColor: 'rgba(57,255,110,0.05)',
          fill: true,
          pointBackgroundColor: '#39ff6e'
        },
        {
          label: 'NDWI',
          data: ndwi,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56,189,248,0.05)',
          fill: true,
          pointBackgroundColor: '#38bdf8'
        },
        {
          label: 'NBR',
          data: nbr,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.05)',
          fill: true,
          pointBackgroundColor: '#f97316'
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            title: (items) => items[0].label,
            label: (item) => ` ${item.dataset.label}: ${item.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        ...CHART_DEFAULTS.scales,
        y: {
          ...CHART_DEFAULTS.scales.y,
          min: 0, max: 1,
          ticks: { ...CHART_DEFAULTS.scales.y.ticks, stepSize: 0.25 }
        }
      }
    }
  });
}

function initArduinoChart() {
  const { hours, temp, umid, chuva } = generateArduinoData();
  const ctx = document.getElementById('chartArduino');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temp,
          borderColor: '#f87171',
          backgroundColor: 'rgba(248,113,113,0.05)',
          fill: true,
          yAxisID: 'yTemp',
          pointBackgroundColor: '#f87171'
        },
        {
          label: 'Umidade (%)',
          data: umid,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56,189,248,0.05)',
          fill: true,
          yAxisID: 'yTemp',
          pointBackgroundColor: '#38bdf8'
        },
        {
          label: 'Chuva (mm)',
          data: chuva,
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167,139,250,0.08)',
          fill: true,
          yAxisID: 'yChuva',
          pointBackgroundColor: '#a78bfa',
          borderDash: [4, 3]
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            title: (items) => `Hora: ${items[0].label}`,
            label: (item) => {
              if (item.dataset.label.includes('Temp'))  return ` Temperatura: ${item.parsed.y}°C`;
              if (item.dataset.label.includes('Umid'))  return ` Umidade: ${item.parsed.y}%`;
              return ` Chuva: ${item.parsed.y} mm`;
            }
          }
        }
      },
      scales: {
        x: CHART_DEFAULTS.scales.x,
        yTemp: {
          position: 'left',
          grid: { color: '#162236' },
          ticks: { color: '#3d5870', font: { size: 10, family: 'Space Mono' } },
          min: 0, max: 100
        },
        yChuva: {
          position: 'right',
          grid: { display: false },
          ticks: { color: '#3d5870', font: { size: 10, family: 'Space Mono' } },
          min: 0, max: 10
        }
      }
    }
  });
}

// ── MAP ──────────────────────────────────────────────────────

let map;
const mapLayers = {};

function initMap() {
  map = L.map('map', {
    center: [-12.5, -55.7],
    zoom: 6,
    zoomControl: true,
    attributionControl: true
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Simulated polygon layers using GeoJSON-style rectangles
  const layerDefs = {
    ndvi:  { color: '#39ff6e', fill: 'rgba(57,255,110,0.15)',  coords: [[-10,-58],[-15,-52]] },
    ndwi:  { color: '#38bdf8', fill: 'rgba(56,189,248,0.12)',  coords: [[-11,-57],[-14,-53]] },
    nbr:   { color: '#f97316', fill: 'rgba(249,115,22,0.12)',  coords: [[-9,-56], [-12,-54]] },
    agri:  { color: '#facc15', fill: 'rgba(250,204,21,0.1)',   coords: [[-13,-56],[-16,-53]] },
    mun:   { color: '#a78bfa', fill: 'rgba(167,139,250,0.12)', coords: [[-10,-57],[-16,-51]] },
    res:   { color: '#34d399', fill: 'rgba(52,211,153,0.12)',  coords: [[-8, -58],[-11,-55]] }
  };

  for (const [key, def] of Object.entries(layerDefs)) {
    const [sw, ne] = def.coords;
    const poly = L.rectangle(
      [[sw[0], sw[1]], [ne[0], ne[1]]],
      { color: def.color, weight: 1.5, fillColor: def.fill, fillOpacity: 1 }
    );
    mapLayers[key] = poly;
    if (['ndvi','ndwi'].includes(key)) poly.addTo(map);
  }

  // Layer checkboxes
  document.querySelectorAll('.layer-cb').forEach(cb => {
    cb.addEventListener('change', function() {
      const key = this.dataset.layer;
      if (mapLayers[key]) {
        if (this.checked) mapLayers[key].addTo(map);
        else              map.removeLayer(mapLayers[key]);
      }
    });
  });
}

// ── MODAL ────────────────────────────────────────────────────

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ── NAV ──────────────────────────────────────────────────────

function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Mini charts
  const { ndvi, ndwi, nbr } = generateTemporalData();
  drawMiniChart('miniNDVI', ndvi, '#39ff6e');
  drawMiniChart('miniNDWI', ndwi, '#38bdf8');
  drawMiniChart('miniNBR',  nbr,  '#f97316');

  // Main charts
  initTemporalChart();
  initArduinoChart();

  // Map
  initMap();

  // Nav
  initNav();

  // Modal
  document.getElementById('btnLaudo').addEventListener('click', openModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Animate indicator bars on modal open
  document.getElementById('btnLaudo').addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.ind-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = w));
      });
    }, 50);
  });
});