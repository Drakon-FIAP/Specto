# Specto — Laudos territoriais por sensoriamento remoto

> *O dado que estava no espaço. O laudo que chegou até você.*

O Brasil é um dos países mais monitorados por satélite do mundo — mas todo esse dado permanece inacessível para a maioria das pessoas que mais se beneficiariam dele. O **Specto** é a camada que faltava: uma plataforma que transforma imagens do Sentinel-2 em laudos territoriais em português, sem exigir nenhum conhecimento técnico em sensoriamento remoto.

---

## Sumário

- [O problema](#o-problema)
- [A solução](#a-solução)
- [Como funciona](#como-funciona)
- [Índices espectrais](#índices-espectrais)
- [Classificação de saúde territorial](#classificação-de-saúde-territorial)
- [Fontes de dados](#fontes-de-dados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Disciplinas e entregas](#disciplinas-e-entregas)
- [Equipe](#equipe)

---

## O problema

O Sentinel-2 fotografa cada metro quadrado do Brasil a cada 5 dias. O INPE tem dados abertos de desmatamento desde 2004. A ESA disponibiliza imagens com resolução de 10 metros para qualquer ponto do território — de graça.

O problema é que acessar dado espectral hoje exige dominar sistemas de coordenadas geográficas, manipular arquivos GeoTIFF de vários gigabytes, instalar bibliotecas de geoprocessamento e interpretar índices numéricos que não dizem nada para quem não tem formação técnica.

**O dado existe, é gratuito e é atualizado a cada 5 dias. O que não existe é a camada que o torna útil para quem mais precisa.**

---

## A solução

O Specto consome imagens do Sentinel-2 via API do Copernicus Data Space Ecosystem, calcula índices espectrais sobre a área de interesse informada pelo usuário e entrega um **laudo territorial em português** — com classificação de saúde ambiental, histórico temporal e recomendação de ação.

É como um exame de sangue do território. O satélite coleta os dados, o sistema processa, o laudo entrega o resultado em linguagem que qualquer pessoa entende.

**Público-alvo:**

| Perfil | O que o Specto entrega |
|---|---|
| Agricultores familiares | Laudo de estresse hídrico e vegetação antes da perda visual da cultura |
| Gestores municipais | Histórico temporal para fundamentar políticas de recuperação ambiental |
| ONGs e sociedade civil | Laudo técnico pronto para o Ministério Público ou imprensa |
| Jornalistas investigativos | Verificação independente de queimadas e desmatamento com fonte rastreável |
| Extensionistas rurais | Triagem remota de propriedades sem deslocamento físico |
| Pesquisadores e academia | Séries históricas com dados Sentinel-2, INPE e IBGE já cruzados |

---

## Como funciona

```
1. Usuário informa CEP, município ou coordenadas geográficas
2. Sistema geocodifica a entrada e constrói um polígono de área de interesse
3. API do Copernicus localiza a imagem Sentinel-2 mais recente (< 10% nuvens)
4. Apenas as bandas necessárias são baixadas — sem o tile completo de vários GB
5. Python calcula NDVI, NDWI e NBR com numpy e rasterio
6. Valores numéricos são convertidos em classificações legíveis
7. Resultados são cruzados com shapefile do IBGE para contextualização
8. Sistema gera laudo em português com histórico de 12 meses e série temporal
9. Laudo exportado como PDF
```

---

## Índices espectrais

| Índice | Nome completo | Fórmula | O que revela |
|---|---|---|---|
| **NDVI** | Normalized Difference Vegetation Index | `(B08 - B04) / (B08 + B04)` | Saúde e densidade da cobertura vegetal. Detecta desmatamento, estresse hídrico, degradação de pastagens e recuperação de áreas. |
| **NDWI** | Normalized Difference Water Index | `(B03 - B08) / (B03 + B08)` | Presença de água superficial e umidade do solo. Identifica alagamentos, secas progressivas e variação de corpos hídricos. |
| **NBR** | Normalized Burn Ratio | `(B08 - B12) / (B08 + B12)` | Detecção e quantificação de áreas queimadas. O dNBR (diferença pré/pós-evento) revela extensão de incêndios com alta precisão. |

Todos os índices são calculados a partir das bandas do **Sentinel-2B (MSI, 13 bandas, 786 km de altitude, resolução de 10 m/pixel)**.

---

## Classificação de saúde territorial

O valor numérico bruto do índice (entre -1 e +1) é convertido em uma classificação calibrada por bioma brasileiro:

| Classificação | Critério |
|---|---|
| 🟢 **Excelente** | Vegetação densa e saudável, acima da média histórica regional |
| 🟩 **Estável** | Vegetação dentro do padrão esperado para o período e bioma |
| 🟡 **Instável** | Variação moderada — monitoramento recomendado |
| 🟠 **Em declínio** | Queda significativa detectada — possível supressão ou estresse hídrico |
| 🔴 **Crítico** | Queda acima de 30% em relação à referência histórica — ação imediata |
| 🔵 **Em recuperação** | Tendência de alta após evento de degradação documentado |

---

## Fontes de dados

Todas as fontes são públicas, gratuitas e de acesso aberto:

| Fonte | URL | Uso |
|---|---|---|
| Copernicus Data Space Ecosystem (ESA) | [dataspace.copernicus.eu](https://dataspace.copernicus.eu) | Imagens Sentinel-2 desde 2015 via API OData |
| IBGE — Malha Municipal | [ibge.gov.br/geociencias](https://ibge.gov.br/geociencias) | Shapefiles de municípios e biomas |
| INPE / MapBiomas | [data.inpe.br](http://data.inpe.br) | Dados de referência e contextualização territorial |
| NASA Earthdata | [earthdata.nasa.gov](https://earthdata.nasa.gov) | Validação e dados complementares |

---

## Estrutura do projeto

```
Specto/
│
├── assets/             
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│   
│── index.html
│
└── README.md
```

---

## Disciplinas e entregas

Projeto desenvolvido para a **Global Solution FIAP 2026 — Indústria Espacial**, cobrindo seis disciplinas com uma arquitetura única e coerente:

| Disciplina | Entrega | Tecnologias |
|---|---|---|
| **Python (CT)** | Menu interativo: consultar área, calcular índice, comparar períodos, histórico temporal, gerar relatório | `def`, listas, `if-elif`, `while`, `for`, `match-case` |
| **Edge Computing / Arduino** | Dispositivo Proxi — TMP36, LDR e sensor de umidade simulando medição de campo | Arduino C++, Tinkercad |
| **Front-End Design** | Landing page com 6 seções, mapa visual e demonstração de laudo | HTML, CSS, Flexbox, variáveis CSS, Google Fonts |
| **Web Development** | Quiz sobre sensoriamento remoto, slideshow Sentinel-2, formulário com validação, 3 temas de cor | JavaScript puro, sem frameworks |
| **Matemática (DPS)** | Modelagem do NDVI como função racional, análise de domínio e imagem, regressão linear em série temporal | Python, NumPy, Matplotlib |
| **STED / UX** | User Flow completo, Declaração de Visão do Produto, backlog com 5+ histórias de usuário | UX, histórias de usuário |

---

## ODS contemplados

- **ODS 2** — Fome zero e agricultura sustentável
- **ODS 9** — Indústria, inovação e infraestrutura
- **ODS 10** — Redução das desigualdades
- **ODS 13** — Ação contra a mudança global do clima
- **ODS 15** — Vida terrestre

---

## Equipe

Projeto desenvolvido por alunos do curso de **Engenharia de Software — FIAP**, turma 2026.

| Nome | RM | LinkedIn |
|---|---|---|
| Guilherme Pereira Ruiz da Silva | 573360 | [linkedin.com/in/](https://www.linkedin.com/in/) |
| Antonio do Nascimento Ferreira de Sousa | 573706 | [linkedin.com/in/](https://www.linkedin.com/in/) |
| Gustavo Leal | 569361 | [linkedin.com/in/](https://www.linkedin.com/in/) |
| Matheus Mendes Duarte da Silva | 569559 | [linkedin.com/in/](https://www.linkedin.com/in/) |
| Matheus Sato Oliveira do Prado | 569392 | [linkedin.com/in/](https://www.linkedin.com/in/) |

---

*Global Solution FIAP 2026 · Indústria Espacial · Maio/Junho 2026*
