// ============================================
// MENU
// ============================================
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".menu-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if(window.scrollY >= sectionTop){
            current = section.id;
        }

    });

    links.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === `#${current}`){
            link.classList.add("active");
        }

    });

});


// ============================================
// SISTEMA DE TEMAS
// ============================================

const tema1El = document.getElementById("tema1");
const tema2El = document.getElementById("tema2");
const tema3El = document.getElementById("tema3");

function aplicarTema(tema) {
    document.body.classList.remove("tema1", "tema2", "tema3");
    document.body.classList.add(tema);
    localStorage.setItem("specto-tema", tema);
    redesenharTodos();
}

tema1El.addEventListener("click", () => aplicarTema("tema1"));
tema2El.addEventListener("click", () => aplicarTema("tema2"));
tema3El.addEventListener("click", () => aplicarTema("tema3"));

// Restaurar tema salvo
(function () {
    const salvo = localStorage.getItem("specto-tema");
    if (salvo) {
        document.body.classList.remove("tema1", "tema2", "tema3");
        document.body.classList.add(salvo);
        const radio = document.getElementById(salvo);
        if (radio) radio.checked = true;
    }
})();





// ============================================
// SCROLL PROGRESS BAR
// ============================================

const scrollBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? (scrollTop / docH) * 100 : 0;
    if (scrollBar) scrollBar.style.width = progress + "%";
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function mostrarToast(msg, tipo = "info", duracao = 3200) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("removing");
        setTimeout(() => toast.remove(), 300);
    }, duracao);
}

window.mostrarToast = mostrarToast; // expor para uso inline

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================

function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-up, .reveal-fade");

    elements.forEach(el => {
        // Marcar elementos fora da viewport inicial
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            el.classList.add("hidden");
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("hidden");
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        if (el.classList.contains("hidden")) observer.observe(el);
    });
}

// ============================================
// CONTADORES ANIMADOS (Hero Stats)
// ============================================

function animarContadores() {
    const valores = document.querySelectorAll(".hero-stat-value[data-target]");
    
    valores.forEach(el => {
        const target = parseInt(el.getAttribute("data-target"), 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing out expo
            const eased = 1 - Math.pow(2, -10 * progress);
            const value = Math.round(eased * target);
            el.textContent = value.toLocaleString("pt-BR");
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

// ============================================
// CORES POR TEMA
// ============================================

function getCorDoTema() {
    const b = document.body;
    if (b.classList.contains("tema2")) return { ndvi: "#0055d4", ndwi: "#0055d4", nbr: "#0055d4", highlight: "#0055d4", bg: "#f5f7fa" };
    if (b.classList.contains("tema3")) return { ndvi: "#c084fc", ndwi: "#c084fc", nbr: "#c084fc", highlight: "#c084fc", bg: "#120826" };
    return { ndvi: "#77f54d", ndwi: "#38bdf8", nbr: "#f97316", highlight: "#77f54d", bg: "#08111f" };
}

// ============================================
// MINI GRÁFICOS (Cards)
// ============================================

const ndviData = [0.72, 0.74, 0.76, 0.73, 0.70, 0.68, 0.71, 0.75, 0.78, 0.81, 0.83, 0.84];
const ndwiData = [0.60, 0.61, 0.62, 0.60, 0.58, 0.56, 0.58, 0.60, 0.62, 0.64, 0.66, 0.67];
const nbrData  = [0.08, 0.07, 0.06, 0.08, 0.10, 0.12, 0.09, 0.07, 0.06, 0.05, 0.05, 0.05];

function desenharMiniGrafico(canvasId, dados, cor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    const width = parent ? parent.offsetWidth || 200 : 200;
    const height = 40;

    canvas.width = width;
    canvas.height = height;

    if (dados.length < 2) return;

    const min = Math.min(...dados) - 0.02;
    const max = Math.max(...dados) + 0.02;
    const range = max - min || 1;
    const pad = 4;

    const xs = dados.map((_, i) => pad + (i / (dados.length - 1)) * (width - pad * 2));
    const ys = dados.map(v => height - pad - ((v - min) / range) * (height - pad * 2));

    ctx.clearRect(0, 0, width, height);

    // Gradiente de área
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, cor + "55");
    grad.addColorStop(1, cor + "00");
    ctx.beginPath();
    ctx.moveTo(xs[0], height);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.lineTo(xs[xs.length - 1], height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Linha
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.strokeStyle = cor;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Ponto final
    ctx.beginPath();
    ctx.arc(xs[xs.length - 1], ys[ys.length - 1], 3, 0, 2 * Math.PI);
    ctx.fillStyle = cor;
    ctx.fill();
    ctx.shadowBlur = 8;
    ctx.shadowColor = cor;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function redesenharMiniGraficos() {
    atualizarMiniGraficosPeriodo(periodoAtivo);
}

// ============================================
// ANIMAÇÃO DOS VALORES NOS CARDS
// ============================================

function animarValoresCards() {
    function animarNumero(elId, alvo, decimais = 2) {
        const el = document.getElementById(elId);
        if (!el) return;
        const dur = 1400;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(2, -10 * p);
            el.textContent = (eased * alvo).toFixed(decimais);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    animarNumero("valNDVI", 0.84);
    animarNumero("valNDWI", 0.67);
    animarNumero("valNBR",  0.05);
}




// ============================================
// SLIDESHOW DE ÍNDICES ESPECTRAIS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('slideshowTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dots = document.querySelectorAll('.nav-dot');
    const progressBar = document.getElementById('progressBar');
    
    let currentIndex = 0;
    const totalSlides = 3;
    let autoPlayInterval = null;
    let isTransitioning = false;

    // Atualiza o slideshow
    function updateSlideshow(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Valida índice
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        currentIndex = index;
        
        // Move o track
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Atualiza dots
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Atualiza barra de progresso
        const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Pequeno delay para evitar múltiplos cliques
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Próximo slide
    function nextSlide() {
        if (isTransitioning) return;
        if (currentIndex + 1 < totalSlides) {
            updateSlideshow(currentIndex + 1);
        } else {
            // Volta ao primeiro com efeito suave
            updateSlideshow(0);
        }
        resetAutoPlay();
    }
    
    // Slide anterior
    function prevSlide() {
        if (isTransitioning) return;
        if (currentIndex - 1 >= 0) {
            updateSlideshow(currentIndex - 1);
        } else {
            updateSlideshow(totalSlides - 1);
        }
        resetAutoPlay();
    }
    
    // Auto-play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 8000);
    }
    
    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            if (!isNaN(slideIndex) && slideIndex !== currentIndex) {
                updateSlideshow(slideIndex);
                resetAutoPlay();
            }
        });
    });
    
    // Pausa auto-play no hover
    const wrapper = document.querySelector('.slideshow-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Inicia auto-play
    startAutoPlay();
    
    // Teclas de navegação
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });
});
// ============================================
// GRÁFICO HISTÓRICO EXPANDIDO
// ============================================

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Referência atual dos dados usados no tooltip
let _historicoAtualDados = null;
let _historicoAtualLabels = null;

function desenharHistorico(period) {
    period = period || periodoAtivo || "7d";
    const canvas = document.getElementById("historicoChart");
    if (!canvas) return;

    const cfg = getDadosPeriodo(period);
    _historicoAtualDados = cfg;
    _historicoAtualLabels = cfg.labels;

    const parent = canvas.parentElement;
    const W = parent ? parent.offsetWidth : 800;
    const H = 160;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    const cores = getCorDoTema();
    const series = [
        { data: cfg.ndvi, cor: cores.ndvi },
        { data: cfg.ndwi, cor: cores.ndwi },
        { data: cfg.nbr,  cor: cores.nbr },
    ];

    const padL = 40, padR = 16, padT = 16, padB = 28;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Grade horizontal
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = padT + (i / gridLines) * plotH;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
        const val = (1 - i / gridLines).toFixed(1);
        ctx.fillStyle = "rgba(167,176,190,0.6)";
        ctx.font = "10px Space Mono, monospace";
        ctx.textAlign = "right";
        ctx.fillText(val, padL - 6, y + 4);
    }

    // Labels X — mostrar apenas os não-vazios, com densidade adaptativa
    const labels = cfg.labels;
    const n = labels.length;
    const maxLabels = Math.floor(plotW / 35); // evitar sobreposição
    labels.forEach((m, i) => {
        if (!m) return; // pula labels vazios (período 30d)
        if (n > maxLabels && i % Math.ceil(n / maxLabels) !== 0 && i !== n - 1) return;
        const x = padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
        ctx.fillStyle = "rgba(167,176,190,0.6)";
        ctx.font = "9px Space Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(m, x, H - 4);
    });

    // Linhas das séries
    series.forEach(({ data, cor }) => {
        if (!data || data.length < 2) return;
        const min = 0, max = 1, range = max - min;
        const xs = data.map((_, i) => padL + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2));
        const ys = data.map(v => padT + (1 - (v - min) / range) * plotH);

        const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
        grad.addColorStop(0, cor + "22");
        grad.addColorStop(1, cor + "00");
        ctx.beginPath();
        ctx.moveTo(xs[0], padT + plotH);
        xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
        ctx.lineTo(xs[xs.length - 1], padT + plotH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
        ctx.strokeStyle = cor;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();

        xs.forEach((x, i) => {
            ctx.beginPath();
            ctx.arc(x, ys[i], 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = cor;
            ctx.fill();
        });
    });
}

// Tooltip para o gráfico histórico
function initHistoricoTooltip() {
    const canvas = document.getElementById("historicoChart");
    if (!canvas) return;

    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
        position: absolute; pointer-events: none; display: none;
        background: var(--bg-elevated); border: 1px solid var(--card-border);
        border-radius: 8px; padding: 8px 12px; font-size: 0.72rem; z-index: 10;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3); white-space: nowrap;
        font-family: Space Mono, monospace; color: var(--text-secondary);
    `;
    canvas.parentElement.style.position = "relative";
    canvas.parentElement.appendChild(tooltip);

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const W = canvas.width;
        const padL = 40, padR = 16;
        const plotW = W - padL - padR;

        // Usar dados do período atual
        const cfg = _historicoAtualDados || getDadosPeriodo(periodoAtivo);
        const labels = _historicoAtualLabels || cfg.labels;
        const n = cfg.ndvi.length;
        const idx = Math.min(n - 1, Math.max(0, Math.round(((x - padL) / plotW) * (n - 1))));

        if (idx >= 0 && idx < n) {
            const cores = getCorDoTema();
            const labelAtual = labels[idx] || `#${idx + 1}`;
            tooltip.innerHTML = `
                <strong style="color:var(--text-primary)">${labelAtual}</strong><br>
                <span style="color:${cores.ndvi}">NDVI: ${cfg.ndvi[idx].toFixed(2)}</span><br>
                <span style="color:${cores.ndwi}">NDWI: ${cfg.ndwi[idx].toFixed(2)}</span><br>
                <span style="color:${cores.nbr}">NBR: ${cfg.nbr[idx].toFixed(2)}</span>
            `;
            tooltip.style.display = "block";
            tooltip.style.left = (e.clientX - rect.left + 12) + "px";
            tooltip.style.top = (e.clientY - rect.top - 60) + "px";
        }
    });

    canvas.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });
}

// ============================================
// DATASETS POR PERÍODO
// ============================================

// Dados base: série anual de 12 meses (Jan–Dez, indexados de 0 a 11)
const dadosAnuais = {
    ndvi: [0.72, 0.74, 0.76, 0.73, 0.70, 0.68, 0.71, 0.75, 0.78, 0.81, 0.83, 0.84],
    ndwi: [0.60, 0.61, 0.62, 0.60, 0.58, 0.56, 0.58, 0.60, 0.62, 0.64, 0.66, 0.67],
    nbr:  [0.08, 0.07, 0.06, 0.08, 0.10, 0.12, 0.09, 0.07, 0.06, 0.05, 0.05, 0.05],
};

// Dados sintéticos diários (últimos 30 dias, gerados de forma consistente)
const dadosDiarios = (function () {
    const n = 30;
    // Base seed determinística para evitar variação a cada carregamento
    const ndvi = [], ndwi = [], nbr = [];
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        ndvi.push(+(0.75 + t * 0.09 + Math.sin(i * 0.7) * 0.015).toFixed(3));
        ndwi.push(+(0.58 + t * 0.09 + Math.cos(i * 0.5) * 0.012).toFixed(3));
        nbr.push(+(0.10 - t * 0.05 + Math.sin(i * 0.9) * 0.008).toFixed(3));
    }
    return { ndvi, ndwi, nbr };
})();

const dadosMensais3m = {
    ndvi: dadosAnuais.ndvi.slice(-3),
    ndwi: dadosAnuais.ndwi.slice(-3),
    nbr:  dadosAnuais.nbr.slice(-3),
};

// Mapeamento de período → configuração de dados e labels
const periodConfig = {
    "7d": {
        labels: ["D-6","D-5","D-4","D-3","D-2","D-1","Hoje"],
        ndvi: dadosDiarios.ndvi.slice(-7),
        ndwi: dadosDiarios.ndwi.slice(-7),
        nbr:  dadosDiarios.nbr.slice(-7),
    },
    "30d": {
        labels: Array.from({length: 30}, (_, i) => i % 5 === 0 ? `D-${29 - i}` : ""),
        ndvi: dadosDiarios.ndvi,
        ndwi: dadosDiarios.ndwi,
        nbr:  dadosDiarios.nbr,
    },
    "90d": {
        labels: ["Mês -2", "Mês -1", "Atual"],
        ndvi: dadosMensais3m.ndvi,
        ndwi: dadosMensais3m.ndwi,
        nbr:  dadosMensais3m.nbr,
    },
    "1y": {
        labels: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
        ndvi: dadosAnuais.ndvi,
        ndwi: dadosAnuais.ndwi,
        nbr:  dadosAnuais.nbr,
    },
};

// Período ativo globalmente (compartilhado por mini gráficos e histórico)
let periodoAtivo = "7d";

function getDadosPeriodo(period) {
    return periodConfig[period] || periodConfig["7d"];
}

// ============================================
// FILTRO DE PERÍODO (Botões) — REAL
// ============================================

function initFiltroPeriodo() {
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            periodoAtivo = pill.dataset.period;

            // Atualizar mini gráficos dos cards com dados do período
            atualizarMiniGraficosPeriodo(periodoAtivo);
            // Atualizar gráfico histórico
            desenharHistorico(periodoAtivo);
            // Atualizar valor final exibido nos cards
            atualizarValoresCardsPeriodo(periodoAtivo);

            mostrarToast(`📅 Período: ${pill.textContent}`, "info", 1800);
        });
    });
}

function atualizarMiniGraficosPeriodo(period) {
    const dados = getDadosPeriodo(period);
    const cores = getCorDoTema();
    desenharMiniGrafico("demoMiniNDVI", dados.ndvi, cores.ndvi);
    desenharMiniGrafico("demoMiniNDWI", dados.ndwi, cores.ndwi);
    desenharMiniGrafico("demoMiniNBR",  dados.nbr,  cores.nbr);
}

function atualizarValoresCardsPeriodo(period) {
    const dados = getDadosPeriodo(period);
    const lastNdvi = dados.ndvi[dados.ndvi.length - 1];
    const lastNdwi = dados.ndwi[dados.ndwi.length - 1];
    const lastNbr  = dados.nbr[dados.nbr.length - 1];

    const elNdvi = document.getElementById("valNDVI");
    const elNdwi = document.getElementById("valNDWI");
    const elNbr  = document.getElementById("valNBR");
    if (elNdvi) elNdvi.textContent = lastNdvi.toFixed(2);
    if (elNdwi) elNdwi.textContent = lastNdwi.toFixed(2);
    if (elNbr)  elNbr.textContent  = lastNbr.toFixed(2);
}

// ============================================
// CAMADAS DO MAPA
// ============================================

const mapaConfig = {
    ndvi: { label: "Vegetação (NDVI)", min: "0.0", max: "1.0", gradient: "linear-gradient(90deg, #d73027, #f46d43, #fdae61, #fee08b, #a6d96a, #66bd63, #1a9850)", blob1Color: "#77f54d", blob2Color: "#38bdf8" },
    ndwi: { label: "Umidade (NDWI)",    min: "0.0", max: "1.0", gradient: "linear-gradient(90deg, #d73027, #f46d43, #fdae61, #a6cee3, #1f78b4, #08519c)", blob1Color: "#38bdf8", blob2Color: "#0ea5e9" },
    nbr:  { label: "Queimadas (NBR)",   min: "0.0", max: "1.0", gradient: "linear-gradient(90deg, #1a9850, #a6d96a, #fee08b, #f46d43, #d73027, #a50026)", blob1Color: "#4ade80", blob2Color: "#f97316" },
    rgb:  { label: "Composição RGB",    min: "B",   max: "R",   gradient: "linear-gradient(90deg, #1e40af, #059669, #dc2626)", blob1Color: "#a3e635", blob2Color: "#fb923c" },
};

function initMapaLayers() {
    const btns = document.querySelectorAll(".map-layer-btn");
    const blob1 = document.getElementById("mapBlob1");
    const blob2 = document.getElementById("mapBlob2");
    const legend = document.getElementById("mapLegend");
    const csBar = document.getElementById("colorscaleBar");
    const csMin = document.getElementById("csMin");
    const csMax = document.getElementById("csMax");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const layer = btn.dataset.layer;
            const cfg = mapaConfig[layer];
            if (!cfg) return;

            // Atualizar legenda
            if (legend) legend.textContent = `🌍 Cerrado · Camada: ${cfg.label} · 14/05/2026`;
            if (csBar) csBar.style.background = cfg.gradient;
            if (csMin) csMin.textContent = cfg.min;
            if (csMax) csMax.textContent = cfg.max;

            // Animar blobs com nova cor
            if (blob1) blob1.style.background = `radial-gradient(circle, ${cfg.blob1Color} 0%, transparent 70%)`;
            if (blob2) blob2.style.background = `radial-gradient(circle, ${cfg.blob2Color} 0%, transparent 70%)`;

            mostrarToast(`🗺️ Camada alterada para ${cfg.label}`, "info", 2000);
        });
    });

    // Simular coordenadas ao mover o mouse sobre o mapa
    const mapEl = document.getElementById("demoMap");
    const coordsEl = document.getElementById("mapCoords");
    if (mapEl && coordsEl) {
        mapEl.addEventListener("mousemove", (e) => {
            const rect = mapEl.getBoundingClientRect();
            const xFrac = (e.clientX - rect.left) / rect.width;
            const yFrac = (e.clientY - rect.top) / rect.height;
            const lat = (-11.5 - yFrac * 3).toFixed(3);
            const lng = (-55.0 - xFrac * 3).toFixed(3);
            coordsEl.textContent = `${lat}°S  ${lng}°W`;
        });
    }
}

// ============================================
// ALERTAS — FILTRO E RESOLVER
// ============================================

function initAlertas() {
    const filterSelect = document.getElementById("alertFilter");
    const alertList = document.getElementById("alertList");
    const alertCount = document.getElementById("alertCount");

    // Filtro por tipo
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            const val = filterSelect.value;
            const items = alertList.querySelectorAll(".demo-alert-item");
            let visíveis = 0;
            items.forEach(item => {
                const tipo = item.dataset.type;
                const match = val === "all" || tipo === val;
                item.style.display = match ? "flex" : "none";
                if (match && !item.classList.contains("resolved")) visíveis++;
            });
            alertCount.textContent = `${visíveis} ativo${visíveis !== 1 ? "s" : ""}`;
        });
    }

    // Botões de resolver
    if (alertList) {
        alertList.addEventListener("click", (e) => {
            const btn = e.target.closest(".alert-resolve-btn");
            if (!btn) return;
            const item = btn.closest(".demo-alert-item");
            if (item && !item.classList.contains("resolved")) {
                item.classList.add("resolved");
                mostrarToast("✓ Alerta marcado como resolvido", "success", 2500);
                // Atualizar contagem
                const nao_resolvidos = alertList.querySelectorAll(".demo-alert-item:not(.resolved)").length;
                if (alertCount) alertCount.textContent = `${nao_resolvidos} ativo${nao_resolvidos !== 1 ? "s" : ""}`;
            }
        });
    }
}

// ============================================
// MODAL DO LAUDO
// ============================================

function abrirModalLaudo() {
    const modal = document.getElementById("modalLaudo");
    if (!modal) return;
    modal.classList.add("open");

    // Animar barras de indicador
    setTimeout(() => {
        modal.querySelectorAll(".indicador-fill[data-target]").forEach(bar => {
            const t = bar.getAttribute("data-target");
            bar.style.width = t + "%";
        });
    }, 200);
}

function fecharModalLaudo() {
    const modal = document.getElementById("modalLaudo");
    if (modal) {
        modal.classList.remove("open");
        // Reset barras para próxima abertura
        modal.querySelectorAll(".indicador-fill[data-target]").forEach(bar => {
            bar.style.transition = "none";
            bar.style.width = "0%";
            setTimeout(() => {
                bar.style.transition = "";
            }, 50);
        });
    }
}

// ============================================
// MODAL DE CONTATO
// ============================================

function abrirModalContato() {
    const modal = document.getElementById("modalContato");
    if (modal) modal.classList.add("open");
}

window.abrirModalContato = abrirModalContato;

function fecharModalContato() {
    const modal = document.getElementById("modalContato");
    if (modal) modal.classList.remove("open");
}

function validarFormContato() {
    let valido = true;
    const nome  = document.getElementById("inputNome");
    const email = document.getElementById("inputEmail");
    const area  = document.getElementById("inputArea");

    // Reset erros
    ["errNome", "errEmail", "errArea"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });
    [nome, email, area].forEach(el => {
        if (el) el.classList.remove("error");
    });

    if (!nome || !nome.value.trim()) {
        document.getElementById("errNome").textContent = "Nome é obrigatório";
        if (nome) nome.classList.add("error");
        valido = false;
    }

    if (!email || !email.value.trim()) {
        document.getElementById("errEmail").textContent = "E-mail é obrigatório";
        if (email) email.classList.add("error");
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        document.getElementById("errEmail").textContent = "E-mail inválido";
        if (email) email.classList.add("error");
        valido = false;
    }

    if (!area || !area.value) {
        document.getElementById("errArea").textContent = "Selecione uma área";
        if (area) area.classList.add("error");
        valido = false;
    }

    return valido;
}

function initFormContato() {
    const btnEnviar = document.getElementById("btnEnviarContato");
    if (!btnEnviar) return;

    btnEnviar.addEventListener("click", () => {
        if (!validarFormContato()) return;

        // Simular envio
        const txtEl = btnEnviar.querySelector(".btn-text");
        const loadEl = btnEnviar.querySelector(".btn-loading");
        if (txtEl) txtEl.style.display = "none";
        if (loadEl) loadEl.style.display = "inline";
        btnEnviar.disabled = true;

        setTimeout(() => {
            fecharModalContato();
            mostrarToast("✅ Solicitação enviada! Retornaremos em até 24h.", "success", 4000);
            if (txtEl) txtEl.style.display = "inline";
            if (loadEl) loadEl.style.display = "none";
            btnEnviar.disabled = false;

            // Limpar formulário
            ["inputNome", "inputEmail", "inputTelefone", "inputArea", "inputMsg"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });
        }, 1800);
    });
}

// ============================================
// FECHAR MODAIS AO CLICAR NO OVERLAY
// ============================================

function initFecharModais() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("open");
        });
    });

    // Tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
        }
    });
}

// ============================================
// SCROLL SUAVE
// ============================================

function rolarParaDemonstracao() {
    const el = document.getElementById("dashboard-demo");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function rolarParaPlanos() {
    const el = document.getElementById("planos");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================
// BOTÃO GERAR LAUDO (com loading fake)
// ============================================

function initBtnGerarLaudo() {
    const btn = document.getElementById("btnGerarLaudo");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const txtEl = btn.querySelector(".btn-text");
        const loadEl = btn.querySelector(".btn-loading");
        if (txtEl) txtEl.style.display = "none";
        if (loadEl) loadEl.style.display = "inline";
        btn.disabled = true;

        mostrarToast("🛰️ Buscando imagens satelitais...", "info", 1500);

        setTimeout(() => {
            if (txtEl) txtEl.style.display = "inline";
            if (loadEl) loadEl.style.display = "none";
            btn.disabled = false;
            rolarParaDemonstracao();
            setTimeout(() => mostrarToast("✅ Dados carregados! Confira a demonstração abaixo.", "success"), 400);
        }, 1600);
    });
}

// ============================================
// REDESENHAR TUDO (ao trocar tema ou redimensionar)
// ============================================

function redesenharTodos() {
    redesenharMiniGraficos();
    desenharHistorico();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    // Scroll reveal
    initScrollReveal();

    // Gráficos
    redesenharMiniGraficos();
    desenharHistorico();
    initHistoricoTooltip();

    // Animações ao scroll (hero stats e cards)
    const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animarContadores();
                animarValoresCards();
                heroObs.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector(".hero-stats");
    if (heroStats) heroObs.observe(heroStats);
    else { animarContadores(); animarValoresCards(); }

    // Botões
    initBtnGerarLaudo();

    const btnVerDemo = document.getElementById("btnVerDemo");
    if (btnVerDemo) btnVerDemo.addEventListener("click", rolarParaDemonstracao);

    const btnSaberMais = document.getElementById("btnSaberMais");
    if (btnSaberMais) btnSaberMais.addEventListener("click", rolarParaPlanos);

    const btnSolicitar = document.getElementById("btnSolicitar");
    if (btnSolicitar) btnSolicitar.addEventListener("click", abrirModalContato);

    const btnVerLaudo = document.getElementById("btnVerLaudo");
    if (btnVerLaudo) btnVerLaudo.addEventListener("click", abrirModalLaudo);

    // Fechar modais
    const btnFecharLaudo = document.getElementById("fecharModalLaudo");
    if (btnFecharLaudo) btnFecharLaudo.addEventListener("click", fecharModalLaudo);

    const btnFecharLaudo2 = document.getElementById("btnFecharLaudo");
    if (btnFecharLaudo2) btnFecharLaudo2.addEventListener("click", fecharModalLaudo);

    const btnFecharContato = document.getElementById("fecharModalContato");
    if (btnFecharContato) btnFecharContato.addEventListener("click", fecharModalContato);

    initFecharModais();
    initFiltroPeriodo();
    initMapaLayers();
    initAlertas();
    initFormContato();

    // Links do footer
    document.querySelectorAll(".footer-link").forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                e.preventDefault();
                mostrarToast("🔗 Página em construção!", "info", 2000);
            }
        });
    });
});

// Redesenhar ao redimensionar
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redesenharTodos, 200);
});
// ============================================
// QUIZ INTERATIVO
// ============================================

const quizPerguntas = [
    {
        pergunta: "Uma plantação apresentou queda contínua no NDVI durante várias semanas. O que isso pode indicar?",
        opcoes: ["Vegetação mais saudável", "Possível perda de vegetação", "Excesso de satélites", "Nenhuma alteração relevante"],
        correta: 1,
        explicacao: "O NDVI mede a densidade e saúde da vegetação. Valores em queda indicam perda de biomassa, podendo sinalizar estresse hídrico, praga, doença ou degradação do solo."
    },
    {
        pergunta: "Qual índice espectral é mais utilizado para análise de umidade da vegetação e corpos hídricos?",
        opcoes: ["NDVI", "NBR", "NDWI", "RGB"],
        correta: 2,
        explicacao: "O NDWI (Normalized Difference Water Index) é calculado com as bandas verde e infravermelho próximo, sendo ideal para detectar umidade na vegetação e identificar corpos d'água."
    },
    {
        pergunta: "Por que monitorar uma área agrícola com frequência via satélite?",
        opcoes: ["Apenas para armazenar dados", "Não possui utilidade prática", "Para identificar problemas antes que gerem prejuízos", "Apenas para criar relatórios de compliance"],
        correta: 2,
        explicacao: "O monitoramento frequente permite detectar precocemente estresse hídrico, pragas, doenças e degradação vegetal, possibilitando intervenção antes de perdas irreversíveis."
    },
    {
        pergunta: "O satélite Sentinel-2 revisita uma mesma região do Brasil aproximadamente a cada:",
        opcoes: ["1 dia", "5 dias", "30 dias", "6 meses"],
        correta: 1,
        explicacao: "Com dois satélites em órbita (Sentinel-2A e 2B), a constelação da ESA oferece revisita de 5 dias para qualquer ponto da Terra, com resolução espacial de até 10 metros."
    },
    {
        pergunta: "Um valor de NBR próximo de zero ou negativo em uma área previamente vegetada indica:",
        opcoes: ["Vegetação densa e saudável", "Alta umidade do solo", "Área possivelmente atingida por queimada ou desmatamento", "Cobertura de nuvens na imagem"],
        correta: 2,
        explicacao: "O NBR (Normalized Burn Ratio) usa bandas NIR e SWIR. Valores baixos ou negativos indicam baixa refletância no NIR e alta no SWIR, padrão de áreas queimadas ou solo exposto."
    },
    {
        pergunta: "Qual das afirmações sobre o NDVI é correta?",
        opcoes: ["Valores próximos de 1 indicam solo exposto ou água", "Valores negativos indicam vegetação muito densa", "Valores próximos de 0.8 indicam vegetação densa e saudável", "O NDVI não varia com as estações do ano"],
        correta: 2,
        explicacao: "O NDVI varia de -1 a +1. Valores entre 0.6 e 1.0 correspondem à vegetação densa e saudável; próximos de 0 indicam solo exposto ou estresse severo; negativos indicam água ou nuvens."
    },
    {
        pergunta: "Para um produtor que quer detectar seca antes que afete a colheita, qual combinação de índices seria mais útil?",
        opcoes: ["NBR + RGB", "NDVI + NDWI", "Apenas RGB", "NBR + EVI"],
        correta: 1,
        explicacao: "O NDVI monitora a saúde da vegetação e o NDWI avalia o teor de água. Juntos, permitem detectar estresse hídrico precoce — quando o NDWI cai antes de ser visível no campo."
    },
    {
        pergunta: "O que diferencia o Specto de uma simples imagem de satélite?",
        opcoes: ["Resolução maior", "Apenas colorização diferente", "Transformação de dados orbitais em laudos técnicos interpretáveis", "Acesso a imagens exclusivas de satélites privados"],
        correta: 2,
        explicacao: "O Specto processa automaticamente índices espectrais, cruza com dados locais do sensor Proxi e gera laudos em linguagem acessível — transformando terabytes de dados em decisões práticas."
    }
];

let quizEstado = {
    perguntaAtual: 0,
    pontos: 0,
    respostas: [], // true/false por pergunta
    respondida: false,
};

function initQuiz() {
    const btnIniciar    = document.getElementById("btnIniciarQuiz");
    const btnProxima    = document.getElementById("btnProximaPergunta");
    const btnReiniciar  = document.getElementById("btnReiniciarQuiz");

    if (btnIniciar)   btnIniciar.addEventListener("click", quizIniciar);
    if (btnProxima)   btnProxima.addEventListener("click", quizProxima);
    if (btnReiniciar) btnReiniciar.addEventListener("click", quizReiniciar);
}

function quizIniciar() {
    quizEstado = { perguntaAtual: 0, pontos: 0, respostas: [], respondida: false };
    mostrarTela("quizQuestion");
    quizRenderPergunta();
}

function quizReiniciar() {
    mostrarTela("quizStart");
}

function mostrarTela(id) {
    ["quizStart", "quizQuestion", "quizResult"].forEach(tid => {
        const el = document.getElementById(tid);
        if (el) {
            if (tid === id) el.classList.remove("quiz-hidden");
            else el.classList.add("quiz-hidden");
        }
    });
}

function quizRenderPergunta() {
    const total = quizPerguntas.length;
    const idx   = quizEstado.perguntaAtual;
    const p     = quizPerguntas[idx];

    // Progresso
    const fillEl = document.getElementById("quizProgressFill");
    const labelEl = document.getElementById("quizProgressLabel");
    if (fillEl)  fillEl.style.width = ((idx / total) * 100) + "%";
    if (labelEl) labelEl.textContent = `${idx + 1} / ${total}`;

    // Pontuação
    const badgeEl = document.getElementById("quizScoreBadge");
    if (badgeEl) badgeEl.textContent = `${quizEstado.pontos} pts`;

    // Pergunta
    const qEl = document.getElementById("quizQuestionText");
    if (qEl) qEl.textContent = p.pergunta;

    // Opções
    const optsEl = document.getElementById("quizOptions");
    if (optsEl) {
        optsEl.innerHTML = "";
        const letras = ["A", "B", "C", "D"];
        p.opcoes.forEach((opcao, i) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option";
            btn.innerHTML = `<span class="quiz-option-letter">${letras[i]}</span>${opcao}`;
            btn.addEventListener("click", () => quizResponder(i));
            optsEl.appendChild(btn);
        });
    }

    // Limpar feedback e botão próxima
    const fbEl = document.getElementById("quizFeedback");
    if (fbEl) { fbEl.className = "quiz-feedback"; fbEl.textContent = ""; }

    const btnProx = document.getElementById("btnProximaPergunta");
    if (btnProx) btnProx.classList.add("quiz-hidden");

    quizEstado.respondida = false;
}

function quizResponder(indiceEscolhido) {
    if (quizEstado.respondida) return;
    quizEstado.respondida = true;

    const p = quizPerguntas[quizEstado.perguntaAtual];
    const acertou = indiceEscolhido === p.correta;

    if (acertou) quizEstado.pontos++;
    quizEstado.respostas.push(acertou);

    // Marcar opções
    const optsEl = document.getElementById("quizOptions");
    const botoesOpcao = optsEl.querySelectorAll(".quiz-option");
    botoesOpcao.forEach((btn, i) => {
        btn.disabled = true;
        if (i === p.correta) btn.classList.add("correta");
        else if (i === indiceEscolhido && !acertou) btn.classList.add("errada");
    });

    // Feedback
    const fbEl = document.getElementById("quizFeedback");
    if (fbEl) {
        fbEl.className = "quiz-feedback " + (acertou ? "acerto" : "erro");
        fbEl.innerHTML = acertou
            ? `✓ Correto! ${p.explicacao}`
            : `✗ Incorreto. ${p.explicacao}`;
    }

    // Pontuação
    const badgeEl = document.getElementById("quizScoreBadge");
    if (badgeEl) badgeEl.textContent = `${quizEstado.pontos} pts`;

    // Botão próxima / resultado
    const btnProx = document.getElementById("btnProximaPergunta");
    if (btnProx) {
        const ehUltima = quizEstado.perguntaAtual >= quizPerguntas.length - 1;
        btnProx.textContent = ehUltima ? "Ver resultado →" : "Próxima pergunta →";
        btnProx.classList.remove("quiz-hidden");
    }
}

function quizProxima() {
    quizEstado.perguntaAtual++;
    if (quizEstado.perguntaAtual >= quizPerguntas.length) {
        quizMostrarResultado();
    } else {
        quizRenderPergunta();
    }
}

function quizMostrarResultado() {
    mostrarTela("quizResult");

    const total  = quizPerguntas.length;
    const pontos = quizEstado.pontos;
    const pct    = Math.round((pontos / total) * 100);

    // Ícone e título conforme desempenho
    const resultados = [
        { min: 0,   max: 2,  icon: "🌱", titulo: "Continue aprendendo!", msg: "Ainda há muito a descobrir sobre monitoramento orbital. Revise os conceitos de NDVI, NDWI e NBR e tente novamente!" },
        { min: 3,   max: 4,  icon: "📡", titulo: "Bom começo!",           msg: "Você tem uma base sólida sobre sensoriamento remoto. Com mais prática, você dominará os índices espectrais." },
        { min: 5,   max: 6,  icon: "🛰️", titulo: "Muito bem!",            msg: "Seu conhecimento em monitoramento orbital é acima da média. Você sabe interpretar os principais índices espectrais." },
        { min: 7,   max: 7,  icon: "🌿", titulo: "Excelente!",            msg: "Quase perfeito! Você domina sensoriamento remoto agrícola e entende como transformar dados orbitais em decisões práticas." },
        { min: 8,   max: 8,  icon: "🏆", titulo: "Perfeito!",             msg: "Pontuação máxima! Você tem domínio completo sobre índices espectrais, satélites e monitoramento agrícola. Parabéns!" },
    ];

    const r = resultados.find(x => pontos >= x.min && pontos <= x.max) || resultados[0];

    const iconEl  = document.getElementById("quizResultIcon");
    const titleEl = document.getElementById("quizResultTitle");
    const scoreEl = document.getElementById("quizResultScore");
    const msgEl   = document.getElementById("quizResultMsg");
    const barsEl  = document.getElementById("quizResultBars");

    if (iconEl)  iconEl.textContent  = r.icon;
    if (titleEl) titleEl.textContent = r.titulo;
    if (scoreEl) scoreEl.textContent = `${pontos} / ${total}`;
    if (msgEl)   msgEl.textContent   = r.msg;

    // Barras de resumo por pergunta
    if (barsEl) {
        barsEl.innerHTML = "";
        quizEstado.respostas.forEach((acertou, i) => {
            const row = document.createElement("div");
            row.className = "quiz-result-bar-row";
            row.innerHTML = `
                <span class="quiz-result-bar-label">P${i + 1}: ${quizPerguntas[i].pergunta.slice(0, 28)}…</span>
                <div class="quiz-result-bar-track">
                    <div class="quiz-result-bar-fill ${acertou ? 'acerto' : 'erro'}" data-fill="${acertou ? 100 : 100}" style="width:0%"></div>
                </div>
                <span class="quiz-result-bar-badge ${acertou ? 'acerto' : 'erro'}">${acertou ? '✓' : '✗'}</span>
            `;
            barsEl.appendChild(row);
        });

        // Animar barras após render
        setTimeout(() => {
            barsEl.querySelectorAll(".quiz-result-bar-fill").forEach(bar => {
                bar.style.width = "100%";
            });
        }, 100);
    }
}

// Garantir que o quiz inicializa corretamente
document.addEventListener("DOMContentLoaded", () => {
    initQuiz();
});