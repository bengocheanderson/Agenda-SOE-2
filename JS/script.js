const calendario = document.querySelector("#calendario");
const tituloSemana = document.querySelector("#tituloSemana");

const btnAnterior = document.querySelector("#semanaAnterior");
const btnProxima = document.querySelector("#proximaSemana");
const btnHoje = document.querySelector("#irHoje");

const formulario = document.querySelector("#formAgendamento");
const nomeInput = document.querySelector("#nomeEstudante");
const turmaInput = document.querySelector("#turma");
const motivoInput = document.querySelector("#motivo");

const horarioSelecionado = document.querySelector("#horarioSelecionado");
const btnAgendar = document.querySelector("#btnAgendar");
const btnEnviarSolicitacao =
  document.querySelector("#btnEnviarSolicitacao");
const btnCancelarAgendamento =
  document.querySelector("#btnCancelarAgendamento");
const mensagem = document.querySelector("#mensagem");

const formularioOrientador =
  document.querySelector("#formAgendamentoOrientador");
const nomeInputOrientador =
  document.querySelector("#nomeEstudanteOrientador");
const turmaInputOrientador =
  document.querySelector("#turmaOrientador");
const motivoInputOrientador =
  document.querySelector("#motivoOrientador");
const horarioSelecionadoOrientador =
  document.querySelector("#horarioSelecionadoOrientador");
const btnAgendarOrientador =
  document.querySelector("#btnAgendarOrientador");
const mensagemOrientador =
  document.querySelector("#mensagemOrientador");

const CHAVE = "agendaSOE_agendamentos";

const telaLogin = document.querySelector("#telaLogin");
const telaProfessor = document.querySelector("#telaProfessor");
const telaOrientador = document.querySelector("#telaOrientador");

const formLogin = document.querySelector("#formLogin");
const usuarioInput = document.querySelector("#usuario");
const senhaInput = document.querySelector("#senha");
const mensagemLogin = document.querySelector("#mensagemLogin");

const botoesSair = document.querySelectorAll(".btnSair");

const calendarioOrientador =
  document.querySelector("#calendarioOrientador");

const tituloSemanaOrientador =
  document.querySelector("#tituloSemanaOrientador");

const btnAcessoOrientador =
  document.querySelector("#btnAcessoOrientador");
const btnVoltarAgendaPublica =
  document.querySelector("#btnVoltarAgendaPublica");

document.querySelector("#semanaAnteriorOrientador")
  .addEventListener("click", () => {
    dataReferencia = somarDias(dataReferencia, -7);
    limparSelecaoOrientador();
    renderizarCalendario();
  });

document.querySelector("#proximaSemanaOrientador")
  .addEventListener("click", () => {
    dataReferencia = somarDias(dataReferencia, 7);
    limparSelecaoOrientador();
    renderizarCalendario();
  });

document.querySelector("#hojeOrientador")
  .addEventListener("click", () => {
    dataReferencia = new Date();
    limparSelecaoOrientador();
    renderizarCalendario();
  });

let perfilAtual = null;

function limparSelecaoOrientador() {
  horarioEscolhido = null;
  horarioSelecionadoOrientador.textContent =
    "Nenhum horário selecionado";
  btnAgendarOrientador.disabled = true;
  mensagemOrientador.textContent = "";
}

function limparSelecaoProfessor() {
  formulario.reset();
  formulario.classList.add("formulario-oculto");
  btnAgendar.classList.remove("botao-oculto");
  btnAgendar.disabled = true;
  horarioEscolhido = null;
  horarioSelecionado.textContent = "Nenhum horário selecionado";
  mensagem.textContent = "";
}

function abrirFormularioProfessor() {
  if (!horarioEscolhido) return;

  const ocupado = agendamentos.some(
    item => item.chave === horarioEscolhido
  );

  if (ocupado) {
    limparSelecaoProfessor();
    renderizarCalendario();
    return;
  }

  formulario.classList.remove("formulario-oculto");
  btnAgendar.classList.add("botao-oculto");
  btnEnviarSolicitacao.focus();
}

function mostrarTela(tela) {
  telaLogin.hidden = true;
  telaProfessor.hidden = true;
  telaOrientador.hidden = true;

  tela.hidden = false;
}

btnAcessoOrientador.addEventListener("click", () => {
  mensagemLogin.textContent = "";
  formLogin.reset();
  mostrarTela(telaLogin);
});

formLogin.addEventListener("submit", evento => {
  evento.preventDefault();

  const usuario = usuarioInput.value.trim();
  const senha = senhaInput.value;

  if (usuario === "professor" && senha === "1234") {
  perfilAtual = "professor";
  mostrarTela(telaProfessor);
  renderizarCalendario();

} else if (usuario === "orientador" && senha === "1234") {
  perfilAtual = "orientador";
  mostrarTela(telaOrientador);
  renderizarCalendario();

} else {
  mensagemLogin.textContent = "Usuário ou senha inválidos.";
}
});

function abrirAgendaPublica() {
  perfilAtual = "professor";

  mostrarTela(telaProfessor);
  renderizarCalendario();
}

btnVoltarAgendaPublica.addEventListener("click", () => {
  perfilAtual = null;
  abrirAgendaPublica();
});

botoesSair.forEach(botao => {
  botao.addEventListener("click", () => {
    formLogin.reset();
    mensagemLogin.textContent = "";
     perfilAtual = null
    mostrarTela(telaLogin);
  });
});

let agendamentos = carregarAgendamentos();
let dataReferencia = new Date();
let horarioEscolhido = null;



// Cria os horários de 30 em 30 minutos.
// O último atendimento começa às 16:30 e termina às 17:00.
const horarios = [];

for (let minutos = 9 * 60; minutos < 17 * 60; minutos += 30) {
  // Não cria horários durante o almoço.
  if (minutos >= 12 * 60 && minutos < 13 * 60) {
    continue;
  }

  horarios.push(minutos);
}

// Converte uma data para o formato AAAA-MM-DD.
function dataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// Converte minutos para HH:MM.
function formatarHora(minutos) {
  const hora = Math.floor(minutos / 60);
  const minuto = minutos % 60;

  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }).format(data);
}

function nomeDia(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long"
  }).format(data);
}

// Encontra a segunda-feira da semana da data recebida.
function inicioDaSemana(data) {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);

  const dia = inicio.getDay();
  const diferenca = dia === 0 ? -6 : 1 - dia;

  inicio.setDate(inicio.getDate() + diferenca);

  return inicio;
}

function somarDias(data, quantidade) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + quantidade);

  return novaData;
}

function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[caractere]);
}

// Carrega os dados que já estão salvos no navegador.
function carregarAgendamentos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (erro) {
    console.error("Erro ao carregar agenda:", erro);
    return [];
  }
}

// Salva os agendamentos no navegador.
function salvarAgendamentos() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(agendamentos));
    return true;
  } catch (erro) {
    mostrarMensagem("Não foi possível salvar os dados.", "erro");
    return false;
  }
}

function mostrarMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.style.color = tipo === "erro" ? "#b42318" : "#24804e";
}

function normalizarStatus(agendamento) {
  if (!agendamento.status) {
    agendamento.status = "pendente";
  }

  if (
    agendamento.status === "bloqueado" ||
    agendamento.status === "indisponivel"
  ) {
    return "indisponivel";
  }

  return ["pendente", "confirmado"].includes(agendamento.status)
    ? agendamento.status
    : "pendente";
}

function textoStatus(status) {
  const textos = {
    disponivel: "Disponível",
    pendente: "Pendente",
    confirmado: "Confirmado",
    indisponivel: "Indisponível"
  };

  return textos[status] || "Indisponível";
}

// Desenha novamente o calendário.
function renderizarCalendario() {
  desenharCalendario(calendario, tituloSemana, "professor");
  desenharCalendario(
    calendarioOrientador,
    tituloSemanaOrientador,
    "orientador"
  );
}

function desenharCalendario(elementoCalendario, elementoTitulo, perfil) {
  elementoCalendario.innerHTML = "";

  const segunda = inicioDaSemana(dataReferencia);
  const sexta = somarDias(segunda, 4);

  elementoTitulo.textContent =
    `${formatarData(segunda)} a ${formatarData(sexta)}`;

  const cabecalhoHora = document.createElement("div");
  cabecalhoHora.className = "cabecalho-dia";
  cabecalhoHora.textContent = "HORA";
  elementoCalendario.appendChild(cabecalhoHora);

  const dias = [];

  for (let i = 0; i < 5; i++) {
    const data = somarDias(segunda, i);
    dias.push(data);

    const cabecalho = document.createElement("div");
    cabecalho.className = "cabecalho-dia";

    if (dataISO(data) === dataISO(new Date())) {
      cabecalho.classList.add("hoje");
    }

    const nome = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short"
    }).format(data).replace(".", "").toUpperCase();

    const nomeDiaElemento = document.createElement("strong");
    nomeDiaElemento.textContent = nome;

    const dataElemento = document.createElement("span");
    dataElemento.textContent = formatarData(data);

    cabecalho.append(nomeDiaElemento, dataElemento);
    elementoCalendario.appendChild(cabecalho);
  }

  horarios.forEach(minutos => {
    if (minutos === 13 * 60) {
      const almoco = document.createElement("div");
      almoco.className = "almoco";
      almoco.textContent =
        "Intervalo de almoço · 12:00 às 13:00";

      elementoCalendario.appendChild(almoco);
    }

    const rotulo = document.createElement("div");
    rotulo.className = "rotulo-hora";
    rotulo.textContent = formatarHora(minutos);
    elementoCalendario.appendChild(rotulo);

    dias.forEach(data => {
      const chave =
        `${dataISO(data)}T${formatarHora(minutos)}`;

      const agendamento = agendamentos.find(
        item => item.chave === chave
      );

      const celula = document.createElement("div");
      celula.className = "celula";

      if (agendamento) {
        const statusAtual = normalizarStatus(agendamento);
        celula.classList.add(`celula-${statusAtual}`);

        if (perfil === "professor") {
          const indicador = document.createElement("span");
          indicador.className = "indicador-status";
          indicador.textContent = textoStatus(statusAtual);
          celula.appendChild(indicador);
          elementoCalendario.appendChild(celula);
          return;
        }

        const cartao = document.createElement("div");
        cartao.className = "agendamento";

        const nome = document.createElement("strong");
        nome.textContent = agendamento.nome;

        const turma = document.createElement("span");
        turma.textContent = agendamento.turma;

        const status = document.createElement("span");
        status.className = "status-agendamento";
        status.classList.add(`status-${statusAtual}`);

        status.textContent =
          textoStatus(statusAtual);

        cartao.append(nome, turma, status);

        // Somente o orientador vê o motivo.
        if (perfil === "orientador") {
          const motivo = agendamento.motivo || "";

          const resumo = document.createElement("p");
          resumo.className = "motivo-resumo";

          const limite = 35;
          resumo.textContent = motivo.length > limite
            ? motivo.slice(0, limite) + "..."
            : motivo;

          const motivoCompleto = document.createElement("p");
          motivoCompleto.className = "motivo-completo";
          motivoCompleto.textContent = motivo;
          motivoCompleto.hidden = true;

          const botaoExpandir = document.createElement("button");
          botaoExpandir.type = "button";
          botaoExpandir.className = "botao-expandir";
          botaoExpandir.textContent = "Ver motivo";

          botaoExpandir.addEventListener("click", evento => {
            evento.stopPropagation();

            const expandido = !motivoCompleto.hidden;
            motivoCompleto.hidden = expandido;
            resumo.hidden = !expandido;

            botaoExpandir.textContent = expandido
              ? "Ver motivo"
              : "Recolher";
          });

          cartao.append(resumo, motivoCompleto, botaoExpandir);

          // Ações administrativas exclusivas do orientador.
          if (statusAtual === "pendente") {
            const botaoConfirmar = document.createElement("button");
            botaoConfirmar.type = "button";
            botaoConfirmar.textContent = "Confirmar";

            botaoConfirmar.addEventListener("click", evento => {
              evento.stopPropagation();

              const statusAnterior = agendamento.status;
              agendamento.status = "confirmado";

              if (salvarAgendamentos()) {
                mostrarMensagem("Agendamento confirmado.");
                renderizarCalendario();
              } else {
                agendamento.status = statusAnterior;
              }
            });

            const botaoRecusar = document.createElement("button");
            botaoRecusar.type = "button";
            botaoRecusar.textContent = "Recusar";

            botaoRecusar.addEventListener("click", evento => {
              evento.stopPropagation();

              const desejaRecusar = confirm(
                `Deseja recusar o pedido de ${agendamento.nome}?`
              );

              if (!desejaRecusar) return;

              const anteriores = agendamentos;
              agendamentos = agendamentos.filter(
                item => item.id !== agendamento.id
              );

              if (salvarAgendamentos()) {
                mostrarMensagem(
                  "Solicitação recusada. Horário liberado."
                );
                renderizarCalendario();
              } else {
                agendamentos = anteriores;
              }
            });

            cartao.append(botaoConfirmar, botaoRecusar);
          } else if (statusAtual === "confirmado") {
            const botaoCancelar = document.createElement("button");
            botaoCancelar.type = "button";
            botaoCancelar.textContent = "Cancelar atendimento";

            botaoCancelar.addEventListener("click", evento => {
              evento.stopPropagation();

              if (!confirm(
                `Deseja cancelar o atendimento de ${agendamento.nome}?`
              )) return;

              const anteriores = agendamentos;
              agendamentos = agendamentos.filter(
                item => item.id !== agendamento.id
              );

              if (salvarAgendamentos()) {
                mostrarMensagem(
                  "Atendimento cancelado. Horário liberado."
                );
                renderizarCalendario();
              } else {
                agendamentos = anteriores;
              }
            });

            cartao.appendChild(botaoCancelar);
          }
        }

        celula.appendChild(cartao);

      } else {
        celula.classList.add("celula-disponivel");

        const disponivel = document.createElement("span");
        disponivel.className = "indicador-status";
        disponivel.textContent = textoStatus("disponivel");
        celula.appendChild(disponivel);

        if (
          (perfil === "professor" || perfil === "orientador") &&
          horarioEscolhido === chave
        ) {
          celula.classList.add("selecionada");
        }

        if (perfil === "professor" || perfil === "orientador") {
          celula.addEventListener("click", () => {
            selecionarHorario(chave, data, minutos);
          });
        }
      }

      elementoCalendario.appendChild(celula);
    });
  });
}

// Registra qual horário o usuário selecionou.
function selecionarHorario(chave, data, minutos) {
  horarioEscolhido = chave;

  const textoHorario =
    `${nomeDia(data)}, ${formatarData(data)} às ${formatarHora(minutos)}`;

  if (perfilAtual === "orientador") {
    document.querySelector("#horarioSelecionadoOrientador").textContent =
      textoHorario;

    document.querySelector("#btnAgendarOrientador").disabled = false;
  } else {
    horarioSelecionado.textContent = textoHorario;
    btnAgendar.disabled = false;
    mostrarMensagem("");
  }

  renderizarCalendario();
}

btnAgendar.addEventListener("click", abrirFormularioProfessor);

btnCancelarAgendamento.addEventListener("click", () => {
  limparSelecaoProfessor();
  renderizarCalendario();
});

// Captura os campos quando o formulário é enviado.
formulario.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!horarioEscolhido) {
    mostrarMensagem("Selecione um horário na agenda.", "erro");
    return;
  }

  // Verifica se o horário continua disponível.
  const ocupado = agendamentos.some(
    item => item.chave === horarioEscolhido
  );

  if (ocupado) {
    mostrarMensagem("Esse horário já está ocupado.", "erro");
    return;
  }

  const nome = nomeInput.value.trim();
  const turma = turmaInput.value.trim();
  const motivo = motivoInput.value.trim();

  if (!nome || !turma || !motivo) {
    mostrarMensagem("Preencha todos os campos.", "erro");
    return;
  }

  const novoAgendamento = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    chave: horarioEscolhido,
    nome: nome,
    turma: turma,
    motivo: motivo,
    status: perfilAtual === "orientador"
      ? "confirmado"
      : "pendente"
  };

  agendamentos.push(novoAgendamento);

  if (!salvarAgendamentos()) {
    agendamentos.pop();
    return;
  }

  limparSelecaoProfessor();

  mostrarMensagem("Atendimento agendado com sucesso!");
  renderizarCalendario();
});

formularioOrientador.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!horarioEscolhido) {
    mensagemOrientador.textContent = "Selecione um horário na agenda.";
    mensagemOrientador.style.color = "#b42318";
    return;
  }

  const ocupado = agendamentos.some(
    item => item.chave === horarioEscolhido
  );

  if (ocupado) {
    mensagemOrientador.textContent = "Esse horário já está ocupado.";
    mensagemOrientador.style.color = "#b42318";
    return;
  }

  const nome = nomeInputOrientador.value.trim();
  const turma = turmaInputOrientador.value.trim();
  const motivo = motivoInputOrientador.value.trim();

  if (!nome || !turma || !motivo) {
    mensagemOrientador.textContent = "Preencha todos os campos.";
    mensagemOrientador.style.color = "#b42318";
    return;
  }

  const novoAgendamento = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    chave: horarioEscolhido,
    nome: nome,
    turma: turma,
    motivo: motivo,
    status: "confirmado"
  };

  agendamentos.push(novoAgendamento);

  if (!salvarAgendamentos()) {
    agendamentos.pop();
    return;
  }

  formularioOrientador.reset();
  horarioEscolhido = null;
  horarioSelecionadoOrientador.textContent =
    "Nenhum horário selecionado";
  btnAgendarOrientador.disabled = true;
  mensagemOrientador.textContent =
    "Atendimento agendado com sucesso!";
  mensagemOrientador.style.color = "#24804e";
  renderizarCalendario();
});

// Muda a referência em sete dias para navegar por semana.
function mudarSemana(quantidade) {
  dataReferencia = somarDias(dataReferencia, quantidade * 7);

  limparSelecaoProfessor();

  mostrarMensagem("");
  renderizarCalendario();
}

btnAnterior.addEventListener("click", () => mudarSemana(-1));
btnProxima.addEventListener("click", () => mudarSemana(1));

btnHoje.addEventListener("click", () => {
  dataReferencia = new Date();

  limparSelecaoProfessor();

  mostrarMensagem("");
  renderizarCalendario();
});

// Mostra a agenda ao abrir a página.
renderizarCalendario();
abrirAgendaPublica();