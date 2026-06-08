// ============================================
// SISTEMA DE TEMAS
// ============================================

const tema1 = document.getElementById("tema1");
const tema2 = document.getElementById("tema2");
const tema3 = document.getElementById("tema3");

tema1.addEventListener("click", () => {
    document.body.classList.remove("tema2", "tema3");
    document.body.classList.add("tema1");
    redesenharGraficosDemo();
});

tema2.addEventListener("click", () => {
    document.body.classList.remove("tema1", "tema3");
    document.body.classList.add("tema2");
    redesenharGraficosDemo();
});

tema3.addEventListener("click", () => {
    document.body.classList.remove("tema1", "tema2");
    document.body.classList.add("tema3");
    redesenharGraficosDemo();
});

// ============================================
// GRÁFICOS MINIATURAS DA DEMONSTRAÇÃO
// ============================================

// Dados simulados para os gráficos
const ndviData = [0.72, 0.74, 0.76, 0.73, 0.70, 0.68, 0.71, 0.75, 0.78, 0.81, 0.83, 0.84];
const ndwiData = [0.60, 0.61, 0.62, 0.60, 0.58, 0.56, 0.58, 0.60, 0.62, 0.64, 0.66, 0.67];
const nbrData  = [0.08, 0.07, 0.06, 0.08, 0.10, 0.12, 0.09, 0.07, 0.06, 0.05, 0.05, 0.05];

// Função para obter as cores baseadas no tema atual
function getCorDoTema() {
    const body = document.body;
    const isTema2 = body.classList.contains('tema2');
    const isTema3 = body.classList.contains('tema3');
    
    if (isTema2) return { ndvi: '#0066ff', ndwi: '#0066ff', nbr: '#0066ff', highlight: '#0066ff' };
    if (isTema3) return { ndvi: '#c084fc', ndwi: '#c084fc', nbr: '#c084fc', highlight: '#c084fc' };
    return { ndvi: '#77f54d', ndwi: '#38bdf8', nbr: '#f97316', highlight: '#77f54d' };
}

// Função principal para desenhar um mini gráfico
function desenharMiniGrafico(canvasId, dados, cor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement?.offsetWidth || 200;
    const height = 40;
    
    canvas.width = width;
    canvas.height = height;
    
    if (dados.length < 2) return;
    
    const min = Math.min(...dados) - 0.02;
    const max = Math.max(...dados) + 0.02;
    const range = max - min;
    const padding = 4;
    
    const xs = dados.map((_, i) => padding + (i / (dados.length - 1)) * (width - padding * 2));
    const ys = dados.map(v => height - padding - ((v - min) / range) * (height - padding * 2));
    
    ctx.clearRect(0, 0, width, height);
    
    // Gradiente de preenchimento
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, cor + '66');
    grad.addColorStop(1, cor + '00');
    ctx.beginPath();
    ctx.moveTo(xs[0], height);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.lineTo(xs[xs.length - 1], height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Linha principal
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.strokeStyle = cor;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    
    // Ponto final destacado
    ctx.beginPath();
    ctx.arc(xs[xs.length - 1], ys[ys.length - 1], 3, 0, 2 * Math.PI);
    ctx.fillStyle = cor;
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Função para redesenhar todos os gráficos (usada na mudança de tema)
function redesenharGraficosDemo() {
    const cores = getCorDoTema();
    desenharMiniGrafico('demoMiniNDVI', ndviData, cores.ndvi);
    desenharMiniGrafico('demoMiniNDWI', ndwiData, cores.ndwi);
    desenharMiniGrafico('demoMiniNBR', nbrData, cores.nbr);
}

// ============================================
// SCROLL SUAVE PARA BOTÕES
// ============================================

function rolarParaDemonstracao() {
    const demonstracao = document.getElementById('dashboard-demo');
    if (demonstracao) {
        demonstracao.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function rolarParaHero() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================
// MODAL DE DEMONSTRAÇÃO DO LAUDO
// ============================================

function criarModalLaudo() {
    // Verificar se o modal já existe
    if (document.getElementById('modalLaudoDemo')) return;
    
    const modalHTML = `
        <div class="modal-overlay-demo" id="modalLaudoDemo">
            <div class="modal-demo">
                <div class="modal-demo-header">
                    <div>
                        <div class="modal-demo-title"><span class="highlight-text">SPECTO</span> — Laudo Territorial</div>
                        <div class="modal-demo-sub">Relatório Técnico de Análise Satelital</div>
                    </div>
                    <button class="modal-demo-close" id="fecharModalDemo">✕</button>
                </div>
                <div class="modal-demo-meta">
                    <div><span class="meta-label">Área</span><span class="meta-value">Sorriso – MT</span></div>
                    <div><span class="meta-label">Bioma</span><span class="meta-value">Cerrado</span></div>
                    <div><span class="meta-label">Satélite</span><span class="meta-value">Sentinel-2B</span></div>
                    <div><span class="meta-label">Data</span><span class="meta-value">14/05/2026</span></div>
                </div>
                <div class="modal-demo-indicadores">
                    <div class="indicador">
                        <div class="indicador-header"><span>NDVI</span><strong>0.84</strong></div>
                        <div class="indicador-bar"><div class="indicador-fill ndvi-fill" style="width:84%"></div></div>
                        <div class="indicador-status">Excelente</div>
                    </div>
                    <div class="indicador">
                        <div class="indicador-header"><span>NDWI</span><strong>0.67</strong></div>
                        <div class="indicador-bar"><div class="indicador-fill ndwi-fill" style="width:67%"></div></div>
                        <div class="indicador-status">Estável</div>
                    </div>
                    <div class="indicador">
                        <div class="indicador-header"><span>NBR</span><strong>0.05</strong></div>
                        <div class="indicador-bar"><div class="indicador-fill nbr-fill" style="width:5%"></div></div>
                        <div class="indicador-status">Sem risco</div>
                    </div>
                </div>
                <div class="modal-demo-conclusao">
                    <h4>Conclusão Automática</h4>
                    <p>A área apresenta excelente cobertura vegetal (NDVI 0.84) com níveis adequados de umidade no solo (NDWI 0.67). Não foram detectados sinais de queimadas recentes (NBR 0.05). As condições gerais da vegetação são favoráveis e estáveis para o período analisado.</p>
                </div>
                <div class="modal-demo-footer">
                    <span>Próxima imagem disponível em <strong>5 dias</strong></span>
                    <button class="btn-fechar-modal" id="btnFecharModalDemo">Fechar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar estilos dinâmicos para o modal
    const styleModal = document.createElement('style');
    styleModal.textContent = `
        .modal-overlay-demo {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .modal-overlay-demo.open {
            opacity: 1;
            visibility: visible;
        }
        .modal-demo {
            background: var(--bg-color);
            border: 1px solid var(--pill-border);
            border-radius: 1rem;
            max-width: 550px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            padding: 1.5rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .modal-demo-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        .modal-demo-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        .modal-demo-sub {
            font-size: 0.75rem;
            color: var(--text-secondary);
        }
        .modal-demo-close {
            background: transparent;
            border: 1px solid var(--pill-border);
            border-radius: 0.5rem;
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 1rem;
        }
        .modal-demo-meta {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.75rem;
            background: rgba(0,0,0,0.2);
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .modal-demo-meta div {
            display: flex;
            flex-direction: column;
        }
        .meta-label {
            font-size: 0.65rem;
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        .meta-value {
            font-size: 0.85rem;
            font-weight: 600;
        }
        .indicador {
            margin-bottom: 1rem;
        }
        .indicador-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;
            font-size: 0.85rem;
        }
        .indicador-header strong {
            color: var(--text-highlight);
        }
        .indicador-bar {
            height: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 0.3rem;
        }
        .indicador-fill {
            height: 100%;
            border-radius: 3px;
        }
        .ndvi-fill { background: var(--text-highlight); }
        .ndwi-fill { background: #38bdf8; }
        .nbr-fill { background: #f97316; }
        .indicador-status {
            font-size: 0.7rem;
            text-align: right;
        }
        .modal-demo-conclusao {
            background: rgba(119,245,77,0.05);
            border: 1px solid var(--pill-border);
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
        }
        .modal-demo-conclusao h4 {
            font-size: 0.85rem;
            color: var(--text-highlight);
            margin-bottom: 0.5rem;
        }
        .modal-demo-conclusao p {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        .modal-demo-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--pill-border);
            font-size: 0.75rem;
        }
        .btn-fechar-modal {
            background: var(--button-primary-bg);
            color: var(--button-primary-text);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
        }
    `;
    document.head.appendChild(styleModal);
    
    // Eventos do modal
    const modal = document.getElementById('modalLaudoDemo');
    const fechar = document.getElementById('fecharModalDemo');
    const btnFechar = document.getElementById('btnFecharModalDemo');
    
    const fecharModal = () => modal.classList.remove('open');
    
    fechar.addEventListener('click', fecharModal);
    btnFechar.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Desenhar gráficos da demonstração
    redesenharGraficosDemo();
    
    // Criar estrutura do modal
    criarModalLaudo();
    
    // Adicionar evento ao botão "Ver demonstração" do hero
    const btnVerDemo = document.querySelector('.btn-secondary');
    if (btnVerDemo) {
        btnVerDemo.addEventListener('click', rolarParaDemonstracao);
    }
    
    // Adicionar evento ao botão "Ver Demonstração do Laudo" na seção de alertas
    const btnLaudoDemo = document.querySelector('.demo-laudo-btn');
    if (btnLaudoDemo) {
        btnLaudoDemo.addEventListener('click', () => {
            const modal = document.getElementById('modalLaudoDemo');
            if (modal) modal.classList.add('open');
        });
    }
    
    // Adicionar evento ao botão "Solicitar Demonstração Personalizada"
    const btnSolicitar = document.querySelector('.demo-cta-btn');
    if (btnSolicitar) {
        btnSolicitar.addEventListener('click', () => {
            alert('📧 Entre em contato: contato@specto.agro\n📞 (11) 99999-9999\n\nNossa equipe retornará em até 24h!');
        });
    }
    
    // Adicionar evento aos botões principais (Gerar laudo)
    const btnGerarLaudo = document.querySelector('.btn-primary');
    if (btnGerarLaudo) {
        btnGerarLaudo.addEventListener('click', () => {
            alert('🚀 Em breve você poderá gerar laudos personalizados!\nPor enquanto, confira a demonstração abaixo.');
            rolarParaDemonstracao();
        });
    }
});

// Redesenhar gráficos ao redimensionar a tela
let timeoutResize;
window.addEventListener('resize', () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(redesenharGraficosDemo, 200);
});