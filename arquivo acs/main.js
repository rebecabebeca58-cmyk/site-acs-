/**
 * ACS Conectado - Módulo Geral e Interativo
 * Cidade-Piloto: Minas Novas / MG
 * Desempenho: Vanilla JS, API-Free, Otimizado para Mobile-First
 */

// 1. MOCKUP DE DADOS: Base Territorial (Minas Novas)
const baseTerritorialMinasNovas = [
    {
        bairro: "Centro",
        esf: "ESF Centro / Dona Maria",
        acs: "Ana Souza",
        whatsapp: "5533999991111",
        agendaVisita: "Terças e Quintas (Manhã)",
        microarea: "Microárea 01"
    },
    {
        bairro: "Cruzinha (Zona Rural)",
        esf: "ESF Rural II",
        acs: "João Silva",
        whatsapp: "5533999992222",
        agendaVisita: "Quartas-feiras (Integral)",
        microarea: "Microárea 08 - Comunidades"
    },
    {
        bairro: "Saudade",
        esf: "ESF Bairro Saudade",
        acs: "Mariana Costa",
        whatsapp: "5533999993333",
        agendaVisita: "Segundas e Sextas (Manhã)",
        microarea: "Microárea 03"
    },
    {
        bairro: "Lagoa",
        esf: "ESF Vista Alegre",
        acs: "Carlos Oliveira",
        whatsapp: "5533999994444",
        agendaVisita: "Terças-feiras (Tarde)",
        microarea: "Microárea 05"
    }
];

// 2. MOCKUP DE DADOS: Calendário de Vacinação Nacional (PNI 2026)
const baseVacinas = [
    { grupo: "crianca", idade: "Ao nascer", vacina: "BCG", doenca: "Formas graves de Tuberculose", dose: "Dose única" },
    { grupo: "crianca", idade: "Ao nascer", vacina: "Hepatite B", doenca: "Hepatite B", dose: "Dose única" },
    { grupo: "crianca", idade: "2 meses", vacina: "Pentavalente", doenca: "Difteria, Tétano, Coqueluche, Hep B e Hib", dose: "1ª Dose" },
    { grupo: "adolescente", idade: "9 a 14 anos", vacina: "HPV Quadrivalente", doenca: "Cânceres de colo do útero, vulva, vagina e ânus", dose: "Dose única" },
    { grupo: "adolescente", idade: "11 a 14 anos", vacina: "Meningocócica ACWY", doenca: "Meningite bacteriana dos sorogrupos A, C, W e Y", dose: "Dose única / Reforço" },
    { grupo: "adulto", idade: "A partir de 20 anos", vacina: "Dupla Adulto (dT)", doenca: "Difteria e Tétano", dose: "Reforço a cada 10 anos" },
    { grupo: "adulto", idade: "60 anos ou mais", vacina: "Influenza (Gripe)", doenca: "Complicações da Gripe Sazonal", dose: "Dose anual" },
    { grupo: "gestante", idade: "A partir da 20ª semana", vacina: "dTpa (Tríplice bacteriana)", doenca: "Difteria, Tétano e Coqueluche (Protege o bebê)", dose: "1 dose a cada gestação" }
];

// ==========================================
// MÓDULO 1: BUSCADOR LOCAL ("Meu ACS")
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.getElementById("busca-endereco");
    const containerResultados = document.getElementById("resultados-acs");

    if (!inputBusca || !containerResultados) return;

    let timeoutDebounce;
    inputBusca.addEventListener("input", (e) => {
        clearTimeout(timeoutDebounce);
        const termoBusca = e.target.value.trim().toLowerCase();

        timeoutDebounce = setTimeout(() => {
            if (termoBusca.length < 3) {
                containerResultados.innerHTML = `<p role="status" class="aviso-busca">Digite pelo menos 3 letras para iniciar a busca...</p>`;
                return;
            }

            const resultadosFiltrados = baseTerritorialMinasNovas.filter(local => 
                local.bairro.toLowerCase().includes(termoBusca)
            );

            renderizarResultadosBusca(resultadosFiltrados, containerResultados);
        }, 300); // 300ms de debounce para performance do teclado
    });
});

function renderizarResultadosBusca(lista, container) {
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = `
        <div class="sem-resultado" role="alert">
            <p>Nenhum ACS localizado para este endereço em Minas Novas.</p>
            <small>Verifique a grafia ou consulte a Secretaria de Saúde local.</small>
        </div>`;
        return;
    }

    const fragmento = document.createDocumentFragment();

    lista.forEach(item => {
        const artigo = document.createElement("article");
        artigo.className = "card-resultado-acs";
        artigo.setAttribute("aria-live", "polite");

        artigo.innerHTML = `
            <div class="resultado-header">
                <h3>Bairro/Localidade: ${item.bairro}</h3>
                <span class="tag-microarea">${item.microarea}</span>
            </div>
            <div class="resultado-body">
                <p><strong>Unidade de Saúde:</strong> ${item.esf}</p>
                <p><strong>Seu Agente de Saúde:</strong> ${item.acs}</p>
                <p><strong>Próxima Visita Agendada:</strong> <span class="destaque-agenda">${item.agendaVisita}</span></p>
            </div>
            <div class="resultado-footer">
                <a href="https://whatsapp.com{item.whatsapp}&text=Olá%20${encodeURIComponent(item.acs)},%20sou%20morador(a)%20da%20sua%20microárea%20e%20gostaria%20de%20uma%20informação." 
                   class="btn-whatsapp" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   aria-label="Falar com o ACS ${item.acs} pelo WhatsApp">
                   💬 Contatar ACS via WhatsApp
                </a>
            </div>
        `;
        fragmento.appendChild(artigo);
    });

    container.appendChild(fragmento);
}

// ==========================================
// MÓDULO 2: ACCORDIONS (Atribuições Legais)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const botoesAccordion = document.querySelectorAll(".accordion-header");

    botoesAccordion.forEach(botao => {
        botao.addEventListener("click", () => {
            const estaExpandido = botao.getAttribute("aria-expanded") === "true";
            const idPainel = botao.getAttribute("aria-controls");
            const painel = document.getElementById(idPainel);

            botao.setAttribute("aria-expanded", !estaExpandido);

            if (painel) {
                if (estaExpandido) {
                    painel.setAttribute("hidden", "");
                } else {
                    painel.removeAttribute("hidden");
                }
            }
        });

        botao.addEventListener("keydown", (e) => {
            const itens = Array.from(botoesAccordion);
            const index = itens.indexOf(botao);

            if (e.key === "ArrowDown") {
                e.preventDefault();
                const proximo = itens[index + 1] || itens[0];
                proximo.focus();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const anterior = itens[index - 1] || itens[itens.length - 1];
                anterior.focus();
            }
        });
    });
});

// ==========================================
// MÓDULO 3: CALCULADORA DE IMC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const formImc = document.getElementById("form-imc");
    const resultadoImc = document.getElementById("resultado-imc");

    if (formImc && resultadoImc) {
        formImc.addEventListener("submit", (e) => {
            e.preventDefault();

            const peso = parseFloat(document.getElementById("imc-peso").value);
            const altura = parseFloat(document.getElementById("imc-altura").value);

            if (!peso || !altura || peso <= 0 || altura <= 0) {
                resultadoImc.removeAttribute("hidden");
                resultadoImc.className = "painel-feedback painel-alerta";
                resultadoImc.innerHTML = "<p>Por favor, insira valores válidos de peso e altura.</p>";
                return;
            }

            const imc = (peso / (altura * altura)).toFixed(1);
            let classificacao = "";
            let classeCss = "painel-feedback";

            if (imc < 18.5) {
                classificacao = "Abaixo do peso";
                classeCss += " painel-alerta"; 
            } else if (imc >= 18.5 && imc < 25) {
                classificacao = "Peso adequado (Saudável)";
            } else if (imc >= 25 && imc < 30) {
                classificacao = "Sobrepeso";
                classeCss += " painel-alerta";
            } else {
                classificacao = "Obesidade (Fator de risco para Hiperdia)";
                classeCss += " painel-alerta";
            }

            resultadoImc.removeAttribute("hidden");
            resultadoImc.className = classeCss;
            resultadoImc.innerHTML = `
                <p><strong>Seu IMC é ${imc}:</strong> ${classificacao}.</p>
                <small>Dica do ACS: Manter o peso na faixa saudável protege seu sistema cardiovascular e previne a sobrecarga das articulações. Marque uma consulta na sua UBS para acompanhamento nutricional personalizado!</small>
            `;
        });
    }
});

// ==========================================
// MÓDULO 4: CALENDÁRIO DE VACINAÇÃO DINÂMICO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const corpoTabela = document.getElementById("corpo-tabela-vacinas");
    const botoesFiltro = document.querySelectorAll(".btn-filtro");

    if (!corpoTabela || botoesFiltro.length === 0) return;

    function renderizarTabelaVacinas(categoria) {
        corpoTabela.innerHTML = "";
        
        const vacinasFiltradas = categoria === "todos" 
            ? baseVacinas 
            : baseVacinas.filter(v => v.grupo === categoria);

        const fragmento = document.createDocumentFragment();

        vacinasFiltradas.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${v.idade}</strong></td>
                <td>${v.vacina}</td>
                <td>${v.doenca}</td>
                <td><span class="tag-microarea">${v.dose}</span></td>
            `;
            fragmento.appendChild(tr);
        });
        
        corpoTabela.appendChild(fragmento);
    }

    renderizarTabelaVacinas("todos");

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");
            
            const filtroSelecionado = botao.getAttribute("data-filtro");
            renderizarTabelaVacinas(filtroSelecionado);
        });
    });
});
