/**
 * ACS Conectado - Módulo "Meu ACS" (Buscador Local Geoendereçado)
 * Cidade-Piloto: Minas Novas / MG
 * Desempenho: Vanilla JS, API-Free, Otimizado para Mobile-First
 */

// 1. Mockup de Dados JSON (Simulando a base territorial de Minas Novas)
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

// 2. Inicialização do DOM após carregamento seguro
document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.getElementById("busca-endereco"); // CORRIGIDO: espaço adicionado
    const containerResultados = document.getElementById("resultados-acs"); // CORRIGIDO: espaço adicionado

    if (!inputBusca || !containerResultados) return;

    // EventListener com debounce simples para otimizar desempenho de digitação
    inputBusca.addEventListener("input", (e) => {
        const termoBusca = e.target.value.trim().toLowerCase(); // CORRIGIDO: espaço adicionado

        if (termoBusca.length < 3) {
            containerResultados.innerHTML = `<p role="status" class="aviso-busca">Digite pelo menos 3 letras para iniciar a busca...</p>`;
            return;
        }

        // Filtragem baseada no JSON
        const resultadosFiltrados = baseTerritorialMinasNovas.filter(local => // CORRIGIDO: espaço adicionado
            local.bairro.toLowerCase().includes(termoBusca)
        );

        renderizarResultados(resultadosFiltrados, containerResultados);
    });
});

// 3. Renderização Dinâmica e Acessível (WCAG Compliant)
function renderizarResultados(lista, container) { // CORRIGIDO: espaço adicionado
    container.innerHTML = ""; // Limpa resultados anteriores

    if (lista.length === 0) {
        container.innerHTML = `
        <div class="sem-resultado" role="alert"> <p>Nenhum ACS localizado para este endereço em Minas Novas.</p>
            <small>Verifique a grafia ou consulte a Secretaria de Saúde local.</small>
        </div>`;
        return;
    }

    // Criação dos fragmentos de layout para evitar repetições excessivas do DOM (Reflow)
    const fragmento = document.createDocumentFragment();

    lista.forEach(item => {
        const artigo = document.createElement("article");
        artigo.className = "card-resultado-acs";
        artigo.setAttribute("aria-live", "polite");

        artigo.innerHTML = `
            <div class="resultado-header"> <h3>Bairro/Localidade: ${item.bairro}</h3>
                <span class="tag-microarea">${item.microarea}</span> </div>
            <div class="resultado-body"> <p><strong>Unidade de Saúde:</strong> ${item.esf}</p>
                <p><strong>Seu Agente de Saúde:</strong> ${item.acs}</p>
                <p><strong>Próxima Visita Agendada:</strong><span class="destaque-agenda">${item.agendaVisita}</span></p> </div>
            <div class="resultado-footer"> <a href="https://api.whatsapp.com/send?phone=${item.whatsapp}&text=Olá%20${encodeURIComponent(item.acs)},%20sou%20morador(a)%20da%20sua%20microárea%20e%20gostaria%20de%20uma%20informação." 
                   class="btn-whatsapp" 
                   target="_blank" 
                   rel="noopener noreferrer" aria-label="Falar com o ACS ${item.acs} pelo WhatsApp">
                   💬 Contatar ACS via WhatsApp
                </a>
            </div>
        `;
        fragmento.appendChild(artigo);
    });

    container.appendChild(fragmento);
}


/**
 * Módulo de Acessibilidade e Interatividade para as Atribuições (Accordions)
 */
document.addEventListener("DOMContentLoaded", () => {
    const botoesAccordion = document.querySelectorAll(".accordion-header"); // CORRIGIDO: espaço adicionado

    botoesAccordion.forEach(botao => {
        botao.addEventListener("click", () => {
            const estaExpandido = botao.getAttribute("aria-expanded") === "true"; // CORRIGIDO: espaço adicionado
            const idPainel = botao.getAttribute("aria-controls"); // CORRIGIDO: espaço adicionado
            const painel = document.getElementById(idPainel);

            // Inverte o estado atual do botão clicado
            botao.setAttribute("aria-expanded", !estaExpandido);

            if (painel) {
                if (estaExpandido) {
                    painel.setAttribute("hidden", "");
                } else {
                    painel.removeAttribute("hidden");
                }
            }
        });

        // Suporte à navegação avançada por teclado (Setas cima/baixo)
        botao.addEventListener("keydown", (e) => {
            const itens = Array.from(botoesAccordion);
            const index = itens.indexOf(botao);

            if (e.key === "ArrowDown") {
                e.preventDefault();
                const proximo = itens[index + 1] || itens[0]; // CORRIGIDO: espaço adicionado
                proximo.focus();
            } else if (e.key === "ArrowUp") { // CORRIGIDO: "elseif" alterado para "else if"
                e.preventDefault();
                const anterior = itens[index - 1] || itens[itens.length - 1];
                anterior.focus();
            }
        });
    });
});


/**
 * Módulo: Prevenção e Cuidado (IMC + Triagem Preventiva)
 */
document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DA CALCULADORA DE IMC ---
    const formImc = document.getElementById("form-imc"); // CORRIGIDO: espaço adicionado
    const resultadoImc = document.getElementById("resultado-imc"); // CORRIGIDO: espaço adicionado

    if (formImc && resultadoImc) { // CORRIGIDO: espaço adicionado
        formImc.addEventListener("submit", (e) => {
            e.preventDefault();

            const peso = parseFloat(document.getElementById("imc-peso").value);
            const altura = parseFloat(document.getElementById("imc-altura").value);

            if (!peso || !altura || peso <= 0 || altura <= 0) {
                resultadoImc.removeAttribute("hidden");
                resultadoImc.className = "painel-feedback alerta-alto";
                resultadoImc.innerHTML = "<p>Por favor, insira valores válidos de peso e altura.</p>";
                return;
            }

            const imc = (peso / (altura * altura)).toFixed(1); // CORRIGIDO: espaço adicionado
            let classificacao = ""; // CORRIGIDO: espaço adicionado
            let classeCss = "painel-feedback"; // CORRIGIDO: espaço adicionado

            if (imc < 18.5) { // CORRIGIDO: espaço adicionado
                classificacao = "Abaixo do peso";
                classeCss += " alerta-moderado";
            } else if (imc >= 18.5 && imc < 25) { // CORRIGIDO: "elseif" e espaços corrigidos
                classificacao = "Peso adequado (Saudável)";
            } else if (imc >= 25 && imc < 30) { // CORRIGIDO: "elseif" e espaços corrigidos
                classificacao = "Sobrepeso";
                classeCss += " alerta-moderado";
            } else {
                classificacao = "Obesidade (Fator de risco para Hiperdia)";
                classeCss += " alerta-alto";
            }

            resultadoImc.removeAttribute("hidden");
            resultadoImc.className = classeCss;
            resultadoImc.innerHTML = `
                <p><strong>Seu IMC é ${imc}:</strong> ${classificacao}.</p>
                <small>Dica do ACS: Manter o peso na faixa saudável protege seu sistema cardiovascular e previne a sobrecarga do pâncreas.</small>
            `;
        });
    }

    // --- LÓGICA DO CHECKLIST DE SINAIS DE ALERTA ---
    const checkboxes = document.querySelectorAll('input[name="sintoma"]'); // CORRIGIDO: espaço adicionado
    const resultadoChecklist = document.getElementById("resultados-checklist") || document.getElementById("resultado-checklist"); // CORRIGIDO: espaço adicionado

    if (checkboxes.length > 0 && resultadoChecklist) { // CORRIGIDO: espaço adicionado
        checkboxes.forEach(box => {
            box.addEventListener("change", () => {
                const marcados = document.querySelectorAll('input[name="sintoma"]:checked').length;

                if (marcados === 0) {
                    resultadoChecklist.className = "painel-feedback";
                    resultadoChecklist.innerHTML = "<p>Marque os itens acima para receber a triagem educacional do seu ACS.</p>";
                } else if (marcados <= 2) { // CORRIGIDO: "elseif" corrigido para "else if"
                    resultadoChecklist.className = "painel-feedback alerta-moderado";
                    resultadoChecklist.innerHTML = `
                        <p><strong>Atenção Preventiva:</strong> Você marcou ${marcados} sinal(is). Recomenda-se aferir a pressão arterial e a glicemia de jejum na sua UBS de referência em Minas Novas durante a semana.</p>
                    `;
                } else {
                    resultadoChecklist.className = "painel-feedback alerta-alto";
                    resultadoChecklist.innerHTML = `
                        <p><strong>Alerta de Monitoramento:</strong> Foram identificados múltiplos fatores/sintomas (${marcados}). É altamente recomendável solicitar uma visita prioritária do seu ACS ou comparecer à sua equipe da Estratégia Saúde da Família (ESF) para uma avaliação clínica cuidadosa.</p>
                    `;
                }
            });
        });
    }
});


/**
 * Módulo: Calendário Vacinal Dinâmico PNI 2026
 * Dados estruturados simulando integração com e-SUS
 */
const mockupCalendarioVacinal = [
    { idade: "Ao nascer", nome: "BCG", evita: "Formas graves de Tuberculose", esquema: "Dose única", categoria: "crianca" },
    { idade: "Ao nascer", nome: "Hepatite B", evita: "Hepatite B", esquema: "Dose única", categoria: "crianca" },
    { idade: "2 e 4 meses", nome: "Pentavalente", evita: "Difteria, Tétano, Coqueluche, Hepatite B e Meningite por Hib", esquema: "2 doses (1ª e 2ª)", categoria: "crianca" },
    { status: "Atualizado", idade: "9 meses", nome: "Febre Amarela", evita: "Febre Amarela", esquema: "1ª Dose (Reforço aos 4 anos)", categoria: "crianca" },
    { idade: "9 anos a 14 anos", nome: "HPV Quadrivalente", evita: "Cânceres de colo do útero, vulva, vagina, ânus e verrugas genitais", esquema: "Dose única (Esquema 2026)", categoria: "adolescente" },
    { idade: "A partir de 60 anos", nome: "Influenza (Gripe)", evita: "Complicações da Gripe H1N1, H3N2 e Tipo B", esquema: "Dose anual (Campanha Minas Novas)", categoria: "adulto" },
    { idade: "A partir da 20ª semana", nome: "dTpa (Tríplice bacteriana acelular)", evita: "Difteria, Tétano e Coqueluche (Proteção do recém-nascido)", esquema: "Uma dose a cada gestação", categoria: "gestante" }
];

document.addEventListener("DOMContentLoaded", () => {
    const corpoTabela = document.getElementById("corpo-tabela-vacinas"); // CORRIGIDO: espaço adicionado
    const botoesFiltro = document.querySelectorAll(".btn-filtro"); // CORRIGIDO: espaço adicionado

    if (!corpoTabela || botoesFiltro.length === 0) return;

    // Função interna para exibir as linhas na tabela
    function renderizarTabela(categoriaFiltro) { // CORRIGIDO: espaço adicionado
        corpoTabela.innerHTML = "";

        const dadosFiltrados = categoriaFiltro === "todos"  // CORRIGIDO: espaço adicionado
            ? mockupCalendarioVacinal
            : mockupCalendarioVacinal.filter(v => v.categoria === categoriaFiltro); // CORRIGIDO: espaço adicionado

        const fragmento = document.createDocumentFragment();

        dadosFiltrados.forEach(vacina => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td><strong>${vacina.idade}</strong></td>
                <td><span class="tag-microarea" style="background-color: #e0f2fe; color: #0369a1;">${vacina.nome}</span></td> <td>${vacina.evita}</td>
                <td>${vacina.esquema}</td>
            `;
            fragmento.appendChild(linha);
        });

        corpoTabela.appendChild(fragmento);
    }

    // Gerenciador de eventos para os botões de filtro
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            // Remove classe ativo de todos e adiciona no clicado
            botoesFiltro.forEach(b => b.classList.remove("ativo")); // CORRIGIDO: espaço adicionado
            botao.classList.add("ativo");

            const filtroSelecionado = botao.getAttribute("data-filtro"); // CORRIGIDO: espaço adicionado
            renderizarTabela(filtroSelecionado);
        });
    });

    // Renderização inicial padrão (Mostrar todas)
    renderizarTabela("todos");
});