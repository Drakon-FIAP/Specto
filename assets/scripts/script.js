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
    const cores = getCorDoTema();
    desenharMiniGrafico("demoMiniNDVI", ndviData, cores.ndvi);
    desenharMiniGrafico("demoMiniNDWI", ndwiData, cores.ndwi);
    desenharMiniGrafico("demoMiniNBR",  nbrData,  cores.nbr);
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
// GRÁFICO HISTÓRICO EXPANDIDO
// ============================================

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function desenharHistorico() {
    const canvas = document.getElementById("historicoChart");
    if (!canvas) return;

    const parent = canvas.parentElement;
    const W = parent ? parent.offsetWidth : 800;
    const H = 160;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    const cores = getCorDoTema();
    const series = [
        { data: ndviData, cor: cores.ndvi },
        { data: ndwiData, cor: cores.ndwi },
        { data: nbrData,  cor: cores.nbr },
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
        // Label Y
        const val = (1 - i / gridLines).toFixed(1);
        ctx.fillStyle = "rgba(167,176,190,0.6)";
        ctx.font = "10px Space Mono, monospace";
        ctx.textAlign = "right";
        ctx.fillText(val, padL - 6, y + 4);
    }

    // Labels X
    meses.forEach((m, i) => {
        const x = padL + (i / (meses.length - 1)) * plotW;
        ctx.fillStyle = "rgba(167,176,190,0.6)";
        ctx.font = "9px Space Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(m, x, H - 4);
    });

    // Linhas das séries
    series.forEach(({ data, cor }) => {
        const min = 0, max = 1, range = max - min;
        const xs = data.map((_, i) => padL + (i / (data.length - 1)) * plotW);
        const ys = data.map(v => padT + (1 - (v - min) / range) * plotH);

        // Área
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

        // Linha
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
        ctx.strokeStyle = cor;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Pontos
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
        const idx = Math.round(((x - padL) / plotW) * (ndviData.length - 1));

        if (idx >= 0 && idx < ndviData.length) {
            const cores = getCorDoTema();
            tooltip.innerHTML = `
                <strong style="color:var(--text-primary)">${meses[idx]}</strong><br>
                <span style="color:${cores.ndvi}">NDVI: ${ndviData[idx].toFixed(2)}</span><br>
                <span style="color:${cores.ndwi}">NDWI: ${ndwiData[idx].toFixed(2)}</span><br>
                <span style="color:${cores.nbr}">NBR: ${nbrData[idx].toFixed(2)}</span>
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
// FILTRO DE PERÍODO (Botões)
// ============================================

function initFiltroPeriodo() {
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const period = pill.dataset.period;
            mostrarToast(`📅 Exibindo dados dos últimos ${pill.textContent}`, "info", 2000);
        });
    });
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