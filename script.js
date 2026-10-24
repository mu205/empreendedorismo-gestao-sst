
console.log("sistema iniciado");

const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

function dataComDeslocamento(dias) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + dias);
    return data;
}
const certificados = [
    {
        trabalhador: "Carlos Souza",
        funcao: "Eletricista",
        obra: "Unidade A",
        treinamento: "NR-10",
        diasRestantes: -5
    },
    {
        trabalhador: "Ana Costa",
        funcao: "Técnica de manutenção",
        obra: "Unidade B",
        treinamento: "NR-35",
        diasRestantes: -1
    },
    {
        trabalhador: "João Martins",
        funcao: "Eletricista",
        obra: "Unidade B",
        treinamento: "NR-35",
        diasRestantes: 0
    },
    {
        trabalhador: "Mariana Lima",
        funcao: "Supervisora",
        obra: "Unidade B",
        treinamento: "NR-10",
        diasRestantes: 10
    },
    {
        trabalhador: "Pedro Alves",
        funcao: "Operador",
        obra: "Unidade A",
        treinamento: "NR-12",
        diasRestantes: 35
    },
    {
        trabalhador: "João Martins",
        funcao: "Eletricista",
        obra: "Unidade B",
        treinamento: "NR-10",
        diasRestantes: 15
    },
    {
        trabalhador: "Ana Costa",
        funcao: "Técnica de manutenção",
        obra: "Unidade B",
        treinamento: "NR-10",
        diasRestantes: 45
    },
    {
        trabalhador: "Pedro Alves",
        funcao: "Operador",
        obra: "Unidade A",
        treinamento: "NR-35",
        diasRestantes: 90
    }
];
const trabalhadores = [...new Set(certificados.map(certificado => certificado.trabalhador))];
function obterStatus(certificado) {
    if (certificado.diasRestantes < 0) {
        return "vencido";
    }
    if (certificado.diasRestantes <= 30) {
        return "proximo";
    }
    return "regular";
}
function obterTextoPrazo(dias) {
    if (dias < -1) {
        return `Vencido há ${Math.abs(dias)} dias`;
    }
    if (dias === -1) {
        return "Vencido há 1 dia";
    }
    if (dias === 0) {
        return "Vence hoje";
    }
    if (dias === 1) {
        return "Vence amanhã";
    }
    return `Vence em ${dias} dias`;
}
function formatarData(dias) {
    return dataComDeslocamento(dias).toLocaleDateString("pt-BR");
}
const nomesPaginas = {
    dashboard: "Visão geral",
    trabalhadores: "Trabalhadores",
    certificados: "Certificados",
    obras: "Obras e equipes"
};
function abrirPagina(nomePagina) {
    // esconde todas as páginas
    document.querySelectorAll(".page-content").forEach(pagina => {pagina.classList.add("hidden");});

    // encontra a página selecionada
    const paginaSelecionada = document.getElementById(`page-${nomePagina}`);
    if (!paginaSelecionada) {
        return;
    }

    // mostra a página correta e atualiza o visual do menu
    paginaSelecionada.classList.remove("hidden");
    document.getElementById("page-title").textContent = nomesPaginas[nomePagina];

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.page === nomePagina);
    });

    window.location.hash = nomePagina; // pra atualizar o endereço da página no navegador

    // atualiza os dados da tela correspondente
    if (nomePagina === "certificados") {
        renderizarTabelaCertificados();
    } else if (nomePagina === "trabalhadores") {
        renderizarTabelaTrabalhadores();
    } else if (nomePagina === "obras") {
        renderizarObras();
    }
}
// formata texto para uma busca sem diferença entre maiúsculas, minúsculas ou acentos.
function normalizarTexto(texto) {return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");}

// inicia o site
atualizarDashboard();
lucide.createIcons();

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", evento => {
        evento.preventDefault();
        abrirPagina(link.dataset.page);
    });
});

document.getElementById("current-date").textContent = hoje.toLocaleDateString("pt-BR");
const paginaInicial = window.location.hash.replace("#", "");
if (nomesPaginas[paginaInicial]) {
    abrirPagina(paginaInicial);
}

// renderiza a página certa
if (window.location.hash === "#certificados") {
  renderizarTabelaCertificados();
}
if (window.location.hash === "#trabalhadores") {
  renderizarTabelaTrabalhadores();
}
if (window.location.hash === "#obras") {
  renderizarObras();
}

// -------------------------------------------------------------

// DASHBOARD
function atualizarDashboard() {
    const vencidos = certificados.filter(certificado => obterStatus(certificado) === "vencido");
    const proximos = certificados.filter(certificado => obterStatus(certificado) === "proximo");
    const regulares = certificados.filter(certificado => obterStatus(certificado) === "regular");

    document.getElementById("total-trabalhadores").textContent = trabalhadores.length;
    document.getElementById("total-certificados").textContent = certificados.length;
    document.getElementById("total-vencidos").textContent = vencidos.length;
    document.getElementById("total-proximos").textContent = proximos.length;
    document.getElementById("total-regulares").textContent = regulares.length;

    renderizarPendencias();
}
function renderizarPendencias() {
    const lista = document.getElementById("lista-de-prioridade");

    const pendencias = certificados.filter(certificado => obterStatus(certificado) !== "regular").sort((a, b) => a.diasRestantes - b.diasRestantes);

    if (pendencias.length === 0) {
        lista.innerHTML = `
            <div class="p-6 text-sm text-slate-500">
                Nenhuma pendência encontrada.
            </div>
        `;
        return;
    }

    lista.innerHTML = pendencias.map(criarLinhaPendencia).join("");

    lucide.createIcons(); // aparentemente tem que executar essa função pra converter o data-lucide em ícones de verdade
}
function criarLinhaPendencia(certificado) {
    const status = obterStatus(certificado);
    const classeStatus = status === "vencido" ? "status-vencido" : "status-proximo";
    const textoStatus = status === "vencido" ? "Vencido" : "Próximo do vencimento";
    return `
    <div class="pending-row">
        <div class="flex items-start gap-3 min-w-0">
            <div class="mt-1 text-slate-400">
                <i data-lucide="${status === "vencido" ? "circle-alert" : "calendar-clock"}"></i>
            </div>

            <div class="min-w-0">
                <p class="pending-name">${certificado.treinamento} - ${certificado.trabalhador}</p>
                <p class="pending-detail">${certificado.funcao} - ${certificado.obra}</p>
                <p class="pending-detail">Validade: ${formatarData(certificado.diasRestantes)}</p>
                <p class="text-sm font-medium mt-2 ${status === "vencido" ? "text-red-600" : "text-amber-700"}"> ${obterTextoPrazo(certificado.diasRestantes)} </p>
            </div>
        </div>
        <span class="status-badge ${classeStatus}">${textoStatus}</span>
    </div>
    `;
}

// -------------------------------------------------------------

// TRABALHADORES

function agruparTrabalhadores() {
    const agrupados = new Map();

    for (const certificado of certificados) {
        const nome = certificado.trabalhador;

        if (!agrupados.has(nome)) {
            agrupados.set(nome, {
                nome: nome,
                funcao: certificado.funcao,
                obra: certificado.obra,
                certificados: []
            });
        }

        agrupados.get(nome).certificados.push(certificado);
    }

    return Array.from(agrupados.values()).map(processarTrabalhador);
}
function processarTrabalhador(trabalhador) {
    const lista = trabalhador.certificados;

    const vencidos = lista.filter(c => obterStatus(c) === "vencido").length;
    const proximos = lista.filter(c => obterStatus(c) === "proximo").length;
    const regulares = lista.filter(c => obterStatus(c) === "regular").length;

    let situacao = "regular";
    if (vencidos > 0) {
        situacao = "vencido";
    } else if (proximos > 0) {
        situacao = "atencao";
    }

    return {
        ...trabalhador,
        total: lista.length,
        vencidos,
        proximos,
        regulares,
        pendencias: vencidos + proximos,
        situacao
    };
}
function renderizarTabelaTrabalhadores() {
    const lista = filtrarTrabalhadores() // lista em ordem alfabetica dos trabalhadores dentro dos criterios de busca
    const tabela = document.getElementById("tabela-trabalhadores");

    tabela.innerHTML = lista.map(criarLinhaTrabalhador).join("");

    document.getElementById("trabalhadores-contagem").textContent = `${lista.length} de ${agruparTrabalhadores().length} trabalhadores`;
    document.getElementById("nenhum-trabalhador").classList.toggle("hidden", lista.length > 0);
}
function filtrarTrabalhadores() {
    const busca = normalizarTexto(document.getElementById("busca-trabalhadores").value.trim());
    const obraSelecionada = document.getElementById("filtro-obra").value;
    const situacaoSelecionada = document.getElementById("filtro-situacao-trabalhador").value;

    return agruparTrabalhadores().filter(trabalhador => {
        const texto = normalizarTexto(`${trabalhador.nome} ${trabalhador.funcao}`);
        const correspondeBusca = texto.includes(busca);
        const correspondeObra = obraSelecionada === "todas" || trabalhador.obra === obraSelecionada;
        const correspondeSituacao = situacaoSelecionada === "todas" || trabalhador.situacao === situacaoSelecionada;

        return (correspondeBusca && correspondeObra && correspondeSituacao);
    }).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}
function criarLinhaTrabalhador(trabalhador) {
    const classes = {
        vencido: "status-vencido",
        atencao: "status-proximo",
        regular: "status-regular"
    };
    const rotulos = {
        vencido: "Possui vencido",
        atencao: "Próximo do vencimento",
        regular: "Regular"
    };

    return `
        <tr>
            <td>
                <span class="font-semibold">${trabalhador.nome}</span>
                <p class="text-xs text-slate-500 mt-1">${trabalhador.funcao}</p>
            </td>

            <td>${trabalhador.obra}</td>

            <td>${trabalhador.total}</td>

            <td>
                <span class="text-emerald-700 font-semibold">${trabalhador.regulares}</span>
            </td>

            <td>
                <span class="${trabalhador.pendencias > 0 ? "text-amber-700 font-semibold" : "text-slate-500"}"> ${trabalhador.pendencias} </span>
            </td>

            <td>
                <span class="status-badge ${classes[trabalhador.situacao]}">
                ${rotulos[trabalhador.situacao]}
                </span>
            </td>

            <td>
                <button class="text-sm font-semibold text-blue-700 hover:text-blue-900" data-ver-certificados="${trabalhador.nome}">
                Ver certificados
                </button>
            </td>
        </tr>
    `;
}
// atualizar a tabela quando os filtros mudam
document.getElementById("busca-trabalhadores").addEventListener("input", renderizarTabelaTrabalhadores);
document.getElementById("filtro-obra").addEventListener("change", renderizarTabelaTrabalhadores);
document.getElementById("filtro-situacao-trabalhador").addEventListener("change", renderizarTabelaTrabalhadores);
// limpar filtros
document.getElementById("limpar-filtros-trabalhadores").addEventListener("click",
    () => {
        document.getElementById("busca-trabalhadores").value = "";
        document.getElementById("filtro-obra").value = "todas";
        document.getElementById("filtro-situacao-trabalhador").value = "todas";

        renderizarTabelaTrabalhadores();
    }
);
// para abrir os certificados de uma pessoa específica
document.getElementById("tabela-trabalhadores").addEventListener("click",
    evento => {
        const botao = evento.target.closest("[data-ver-certificados]");
        if (!botao) {
            return;
        }
        const nome = botao.dataset.verCertificados;

        abrirPagina("certificados");
        document.getElementById("busca-certificados").value = nome;
        renderizarTabelaCertificados();
    }
);

// -------------------------------------------------------------

// CERTIFICADOS

// mostra os certificados filtrados na tabela.
function renderizarTabelaCertificados() {
    const resultado = filtrarCertificados(); // lista ordenada dos certificados dentro dos criterios de busca
    const corpoTabela = document.getElementById("tabela-certificados");

    corpoTabela.innerHTML = resultado.map(criarLinhaCertificado).join("");

    document.getElementById("certificados-contagem").textContent = `${resultado.length} de ${certificados.length} certificados`;
    document.getElementById("nenhum-certificado").classList.toggle("hidden", resultado.length !== 0);
}
function filtrarCertificados() {
    const busca = normalizarTexto(document.getElementById("busca-certificados").value.trim());
    const filtroStatus = document.getElementById("filtro-status").value;
    const filtroTreinamento = document.getElementById("filtro-treinamento").value;
    
    return certificados.filter(certificado => {
        const textoBusca = normalizarTexto([
            certificado.trabalhador,
            certificado.treinamento,
            certificado.obra,
            certificado.funcao
        ].join(" "));

        const correspondeBusca = textoBusca.includes(busca);
        const correspondeStatus = filtroStatus === "todos" || obterStatus(certificado) === filtroStatus;
        const correspondeTreinamento = filtroTreinamento === "todos" || certificado.treinamento === filtroTreinamento;

        return (correspondeBusca && correspondeStatus && correspondeTreinamento);
    }).sort((a, b) => {
        // primeiro por nome do trabalhador
        const porNome = a.trabalhador.localeCompare(b.trabalhador, "pt-BR");
        if (porNome !== 0) {
            return porNome;
        }
        // se for o mesmo trabalhador, ordena pelo treinamento
        return a.treinamento.localeCompare(b.treinamento, "pt-BR");
    });
}
function criarLinhaCertificado(certificado) {
    const status = obterStatus(certificado);
    const classes = {
        vencido: "status-vencido",
        proximo: "status-proximo",
        regular: "status-regular"
    };
    const rotulos = {
        vencido: "Vencido",
        proximo: "Próximo do vencimento",
        regular: "Regular"
    };

    return `
        <tr>
            <td>
                <span class="font-semibold"> ${certificado.trabalhador} </span>
                <p class="text-xs text-slate-500 mt-1"> ${certificado.funcao} </p>
            </td>

            <td> ${certificado.treinamento} </td>
            <td> ${certificado.obra} </td>
            <td> ${formatarData(certificado.diasRestantes)} </td>
            <td> ${obterTextoPrazo(certificado.diasRestantes)} </td>
            <td>
                <span class="status-badge ${classes[status]}"> ${rotulos[status]} </span>
            </td>
        </tr>
    `;
}
// atualizar a tabela quando os filtros mudam
document.getElementById("busca-certificados").addEventListener("input", renderizarTabelaCertificados);
document.getElementById("filtro-status").addEventListener("change", renderizarTabelaCertificados);
document.getElementById("filtro-treinamento").addEventListener("change", renderizarTabelaCertificados);
// limpar filtros
document.getElementById("limpar-filtros").addEventListener("click",
    () => {
        document.getElementById("busca-certificados").value = "";
        document.getElementById("filtro-status").value = "todos";
        document.getElementById("filtro-treinamento").value = "todos";

        renderizarTabelaCertificados();
    }
);

// -------------------------------------------------------------

// OBRAS

function obterResumoObras() {
    const nomesObras = [...new Set(certificados.map(certificado => certificado.obra))];

    return nomesObras.map(nomeObra => {
        const registros = certificados.filter(certificado => certificado.obra === nomeObra);
        const nomesTrabalhadores = [...new Set(registros.map(certificado => certificado.trabalhador))];

        const vencidos = registros.filter(certificado => obterStatus(certificado) === "vencido").length;
        const proximos = registros.filter(certificado => obterStatus(certificado) === "proximo").length;
        const regulares = registros.filter(certificado => obterStatus(certificado) === "regular").length;

        return {
            nome: nomeObra,
            trabalhadores: nomesTrabalhadores.length,
            totalCertificados: registros.length,
            vencidos,
            proximos,
            regulares,
            pendencias: vencidos + proximos
        };
    });
}

function renderizarObras() {
    const todasObras = obterResumoObras();
    const obrasFiltradas = filtrarObras();

    document.getElementById("obras-total").textContent = todasObras.length;
    document.getElementById("obras-trabalhadores").textContent = new Set(certificados.map(c => c.trabalhador)).size;
    document.getElementById("obras-vencidos").textContent = certificados.filter(c => obterStatus(c) === "vencido").length;

    const container = document.getElementById("lista-obras");
    container.innerHTML = obrasFiltradas.map(criarCardObra).join("");

    document.getElementById("nenhuma-obra").classList.toggle("hidden", obrasFiltradas.length > 0);
    
    lucide.createIcons();
}

function filtrarObras() {
    const filtro = document.getElementById("filtro-situacao-obra").value;
    const todasObras = obterResumoObras();

    return todasObras.filter(obra => {
        if (filtro === "vencidos") {
            return obra.vencidos > 0;
        }
        if (filtro === "pendencias") {
            return obra.pendencias > 0;
        }
        if (filtro === "regular") {
            return obra.vencidos === 0;
        }
        return true;
    });
}
function criarCardObra(obra) {
    const situacao = obra.vencidos > 0 ? "Possui certificados vencidos" : obra.proximos > 0 ? "Atenção aos vencimentos" : "Sem pendências";
    const classeSituacao = obra.vencidos > 0 ? "status-vencido" : obra.proximos > 0 ? "status-proximo" : "status-regular";

    return `
        <article class="bg-white border border-slate-200 rounded-xl p-5">
            <div class="flex items-start justify-between gap-3 mb-5">
                <div class="flex items-start gap-3">
                    <div class="rounded-xl bg-blue-50 text-blue-700 p-3">
                        <i data-lucide="building-2"></i>
                    </div>

                    <div>
                        <h3 class="font-bold text-slate-800"> ${obra.nome} </h3>
                        <p class="text-sm text-slate-500 mt-1">
                            ${obra.trabalhadores} ${obra.trabalhadores === 1 ? "trabalhador" : "trabalhadores"}
                        </p>
                    </div>

                </div>
                <span class="status-badge ${classeSituacao}"> ${situacao} </span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="rounded-lg bg-slate-50 p-3">
                    <p class="text-xs text-slate-500"> Certificados cadastrados </p>
                    <p class="text-xl font-bold text-slate-800 mt-1"> ${obra.totalCertificados} </p>
                </div>

                <div class="rounded-lg bg-slate-50 p-3">
                    <p class="text-xs text-slate-500"> Certificados regulares </p>
                    <p class="text-xl font-bold text-emerald-700 mt-1"> ${obra.regulares} </p>
                </div>

                <div class="rounded-lg bg-red-50 p-3">
                    <p class="text-xs text-red-600"> Certificados vencidos </p>
                    <p class="text-xl font-bold text-red-700 mt-1"> ${obra.vencidos} </p>
                </div>

                <div class="rounded-lg bg-amber-50 p-3">
                    <p class="text-xs text-amber-700"> Próximos do vencimento </p>
                    <p class="text-xl font-bold text-amber-800 mt-1"> ${obra.proximos} </p>
                </div>
            </div>

            <div class="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <p class="text-sm text-slate-500">
                    ${obra.pendencias} pendência(s) identificada(s)
                </p>
                <button class="text-sm font-semibold text-blue-700 hover:text-blue-900" data-ver-obra="${obra.nome}">
                    Ver certificados
                </button>
            </div>
        </article>
    `;
}
// atualiza os cartões quando o filtro muda
document.getElementById("filtro-situacao-obra").addEventListener("change", renderizarObras);

// abre os certificados da unidade selecionada
document.getElementById("lista-obras").addEventListener("click", evento => {
    const botao = evento.target.closest("[data-ver-obra]");
    if (!botao) {
        return
    };

    const nomeObra = botao.dataset.verObra;
    abrirPagina("certificados");
    document.getElementById("busca-certificados").value = nomeObra;
    renderizarTabelaCertificados();
  });



  