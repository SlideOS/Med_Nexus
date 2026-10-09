tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Paleta personalizada em verde-saúde e azul-hospitalar
        health: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
                            500: "#10b981", // Verde-esmeralda associado à saúde
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        hospblue: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
                            500: "#0284c7", // Ciano/azul hospitalar
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
                            900: "#0f172a", // Azul-marinho profundo
        },
        mint: {
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
    },
  },
};
// Estado global do totem
const state = {
  currentStep: 0,
  serviceType: "",
  rawCpf: "",
  patientData: {
    name: "",
    cpf: "",
  },
  selectedSpecialty: "Clínica Geral",
  legalPriority: "CONVENCIONAL", // prioridade por lei (só no caminho leve)
  urgencyLevel: "", // gravidade: "MILD" (leve) | "MODERATE" (intermediário) | "URGENT" (grave)
  ticketCode: "",
  loadingToken: 0,

  // Opções de acessibilidade
  isHighContrast: false,
  voiceEnabled: false,
  // Temporizadores
  finishTimer: null,
  finishCountdownSeconds: 15,
  priorityTimer: null,
  priorityCountdownSeconds: 30,
  attendantScreenTimer: null,
};

// Tempo (em segundos) para o paciente responder a pergunta de gravidade.
// Se acabar, a equipe é avisada e o paciente vê que um atendente vai até o local.
const PRIORITY_TIMEOUT_SECONDS = 30;
// Quanto tempo o aviso "atendente a caminho" fica na tela antes do totem voltar ao início.
const ATTENDANT_SCREEN_SECONDS = 60;

// Ordem das etapas NA TELA -> id da seção no HTML (step-N).
// 1: Triagem/nível de dor (step-4) · 2: CPF (step-1) · 3: Prioridade por lei (step-6)
// 4: Serviço/motivo (step-2) · 5: Confirmação/especialidade (step-3) · 6: Ficha (step-5)
// Assim não foi preciso renumerar os ids do HTML nem do CSS.
const STEP_SECTIONS = { 1: 4, 2: 1, 3: 6, 4: 2, 5: 3, 6: 5 };
const TICKET_STEP = 6;

// Nome do nível do meio (dor moderada, mas constante) que aparece na ficha.
// Pode trocar por outro nome que fique antes de "urgência" (ex.: "Semiurgente").
const MODERATE_LEVEL_NAME = "Prioritário";

// Nomes das prioridades por lei, usados na ficha
const LEGAL_PRIORITY_LABELS = {
  IDOSO: "Idoso",
  GESTANTE: "Gestante / Lactante",
  PCD: "Pessoa com Deficiência",
  AUTISMO: "TEA",
  OUTROS: "Outras prioridades",
};

// Dicionário de traduções
const i18nDict = {
  pt: {
    accessibilityBar: "Recursos de Acessibilidade:",
    utilityTitle: "Opções do atendimento",
    flowTitle: "Etapas do atendimento",
    contrast: "Contraste",
    voiceOff: "Voz: OFF",
    voiceOn: "Voz: ON",
    welcomeTitle1: "Retire sua Senha ou Faça seu",
    step1Label: "Identificação",
    step2Label: "Serviço",
    step3Label: "Confirmação",
    step4Label: "Prioridade",
    step1Title: "Como deseja se identificar?",
    step1Sub: "Digite os 11 números do CPF para simular o atendimento.",
    cpfLabel: "Número do CPF",
    cpfHelp: "Digite apenas os 11 números do documento.",
    cpfInvalid: "Digite os 11 números do CPF.",
    cpfLoading: "Validando CPF e preparando atendimento...",
    loadingLabel: "Demonstração do assistente de IA",
    loadingTitle: "Preparando seu atendimento",
    loadingStart: "A IA está organizando o fluxo e preparando sua identificação.",
    loadingCpf: "A IA está validando os dígitos e preparando os dados de demonstração.",
    loadingService: "A IA está organizando as opções e os setores para seu atendimento.",
    loadingPriority: "A IA está preparando as informações para direcionar seu atendimento.",
    loadingTicket: "A IA está montando sua senha e organizando a chamada na fila.",
    btnLimpar: "Limpar",
    btnConfirmID: "VALIDAR CPF",
    step2Title: "Qual o motivo do seu atendimento hoje?",
    step2Sub:
      "Selecione uma das opções abaixo tocando na caixa correspondente:",
    serv1Title: "Pronto Atendimento / Urgência",
    serv1Desc:
      "Para sintomas recentes, dores fortes, febre ou situações de emergência sem agendamento.",
    serv2Title: "Consulta Agendada (Check-in)",
    serv2Desc:
      "Confirme sua chegada para consultas ou exames já marcados previamente.",
    serv3Title: "Retirada de Exames / Laudos",
    serv3Desc:
      "Imprimir resultados de exames de laboratório ou exames de imagem no balcão.",
    serv4Title: "Informações e Setores",
    serv4Desc:
      "Visitas a pacientes internados, dúvidas gerais e guichê de autorizações.",
    triageMild: "Dor leve ou desconforto comum",
    triageMildDesc:
      "Dor de cabeça leve, gripe, dor muscular, curativos ou renovação de receita.",
    triageMod: "Dor moderada, mas constante",
    triageModDesc:
      "Não é tão forte, mas não passa: febre alta, enxaqueca, mal-estar persistente, pequenas fraturas.",
    triageUrg: "Dor extrema ou muito forte",
    triageUrgDesc:
      "Dor insuportável, dor no peito, falta de ar intensa, sangramento ativo ou queimaduras severas. Um atendente virá até você.",
    step3Title: "Confirme seus dados e escolha a Especialidade",
    step3Sub: "Localizamos os seguintes dados em nosso sistema:",
    foundPatient: "Paciente de demonstração",
    cpfSimulationError: "Não foi possível preparar a demonstração. Tente novamente.",
    btnNotYou: "Não é você? Alterar",
    selectSpecLabel: "Selecione o Setor / Especialidade Desejada:",
    step4Title: "Qual é o nível da sua dor agora?",
    step4Sub: "Selecione a opção que melhor descreve como você está:",
    stepTriageLabel: "Triagem",
    legalTitle: "Você possui direito a Atendimento Prioritário?",
    legalSub:
      "Selecione uma das opções prioritárias garantidas pela legislação vigente:",
    prioGeneral: "Atendimento Geral / Convencional",
    prioGeneralDesc: "Não me enquadro em categorias de prioridade legal.",
    prioElderly: "Idoso (60+ anos)",
    prioElderlyDesc: "Prioridade especial para 80+ anos.",
    prioPregnant: "Gestante / Lactante",
    prioPregnantDesc: "Com bebês de colo ou gestantes.",
    prioPCD: "Pessoa com Deficiência",
    prioPCDDesc: "Mobilidade reduzida ou limitações PCD.",
    prioTEA: "Espectro Autista (TEA)",
    prioTEADesc: "Direito garantido por lei prioritária.",
    prioOther: "Outras Prioridades",
    prioOtherDesc: "Doadores de sangue, obesidade severa, etc.",
    priorityTimerNote: "Responda em",
    priorityTimerNoteEnd: "ou um atendente irá até você.",
    attendantTitle: "Um atendente está a caminho",
    attendantDescTimeout:
      "Não recebemos sua resposta. Aguarde neste local: um atendente virá até você.",
    attendantDescSevere:
      "Seu caso foi identificado como grave. Fique neste local: um atendente virá até você agora.",
    ticketSuccess: "Sua Senha foi Gerada com Sucesso!",
    ticketSub:
      "Retire o comprovante impresso na abertura do totem ou acompanhe no celular pelo QR Code:",
    receiptSubtitle: "Comprovante de Atendimento Digital",
    yourNumber: "SUA SENHA",
    lblPatient: "Paciente:",
    lblSpec: "Especialidade:",
    lblLoc: "Local:",
    lblWait: "Tempo Estimado:",
    mobileTrack: "Acompanhar no Celular",
    tvPrompt: "Fique atento aos painéis de TV espalhados pela recepção.",
    btnPrint: "IMPRIMIR VIA EM PAPEL",
    resetCountdown: "Reiniciando em",
    seconds: "segundos...",
    statusReception: "Recepção: Fluxo Normal",
    ticketsCalled: "Senhas chamadas agora:",
  },
};

const specialtiesList = [
  { name: "Clínica Geral", icon: "stethoscope", wait: "12 min" },
  { name: "Pediatria", icon: "baby", wait: "10 min" },
  { name: "Ortopedia", icon: "bone", wait: "18 min" },
  { name: "Cardiologia", icon: "heart-pulse", wait: "25 min" },
  { name: "Ginecologia", icon: "user-check", wait: "15 min" },
  { name: "Exames / Lab", icon: "flask-conical", wait: "5 min" },
];

// Inicialização da aplicação
window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  renderSpecialties();
  updateStepperProgress(1);
  const main = document.getElementById("kiosk-main");
  main.addEventListener("scroll", atualizarBlurEtapas, { passive: true });
  window.addEventListener("resize", atualizarBlurEtapas);
  atualizarBlurEtapas();
});

async function startWizard() {
  const completed = await showAiLoading(1, "loadingPriority");
  if (!completed) return;
  playAudioTone(600, 0.1);
  speakText(i18nDict.pt.step4Title);
}

async function showAiLoading(nextStep, descriptionKey, onComplete = () => {}) {
  const loadingToken = ++state.loadingToken;
  const main = document.getElementById("kiosk-main");
  const loadingScreen = document.getElementById("screen-ai-loading");

  main.scrollTop = 0;
  document.getElementById("wizard-stepper").classList.remove("has-content-underlay");
  document.getElementById("welcome-brandmark").classList.add("hidden");
  document.getElementById("screen-welcome").classList.add("hidden");
  for (let step = 1; step <= 6; step++) {
    document.getElementById(`step-${step}`)?.classList.add("hidden");
  }
  main.classList.remove("wizard-active");
  main.classList.add("wizard-loading");
  document.getElementById("ai-loading-title").innerText =
    i18nDict.pt.loadingTitle;
  document.getElementById("ai-loading-description").innerText =
    i18nDict.pt[descriptionKey];
  loadingScreen.classList.remove("hidden");
  lucide.createIcons();
  atualizarBlurEtapas();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (loadingToken !== state.loadingToken) return false;

  onComplete();
  goToStep(nextStep);
  return true;
}

function goToStep(stepNum) {
  state.loadingToken += 1;
  cancelPriorityTimer();
  closePriorityTimeoutModal();
  state.currentStep = stepNum;
  document.getElementById("kiosk-main").scrollTop = 0;
  document.getElementById("wizard-stepper").classList.remove("has-content-underlay");
  document
    .getElementById("welcome-brandmark")
    .classList.toggle("hidden", stepNum !== 0);
  document.getElementById("screen-ai-loading").classList.add("hidden");
  document
    .getElementById("kiosk-main")
    .classList.toggle("wizard-active", stepNum >= 1 && stepNum < TICKET_STEP);
  document.getElementById("kiosk-main").classList.remove("wizard-loading");

  // Oculta todas as telas das etapas
  document.getElementById("screen-welcome").classList.add("hidden");
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.add("hidden");
  }

  const stepperBar = document.getElementById("wizard-stepper");

  if (stepNum === 0) {
    document.getElementById("screen-welcome").classList.remove("hidden");
    stepperBar.classList.add("hidden");
    updateStepperProgress(1);
  } else if (stepNum === TICKET_STEP) {
    document.getElementById("step-5").classList.remove("hidden");
    stepperBar.classList.add("hidden");
    startFinishCountdown();
  } else {
    document
      .getElementById(`step-${STEP_SECTIONS[stepNum]}`)
      .classList.remove("hidden");
    stepperBar.classList.remove("hidden");
    updateStepperProgress(stepNum);
    if (stepNum === 1) startPriorityTimer();
  }

  lucide.createIcons();
  atualizarBlurEtapas();
}

// Só é possível voltar depois que o CPF foi informado (etapa 3 em diante, até antes da ficha).
// Triagem (1) e CPF (2) não têm "Voltar".
function goToPreviousStep() {
  if (state.currentStep >= 3 && state.currentStep < TICKET_STEP) {
    goToStep(state.currentStep - 1);
  }
}

function updateStepperProgress(step) {
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (!node) continue;

    node.classList.toggle("is-complete", i < step);
    node.classList.toggle("is-current", i === step);
    node.classList.toggle("is-upcoming", i > step);
    if (i === step) node.setAttribute("aria-current", "step");
    else node.removeAttribute("aria-current");
  }

  for (let i = 1; i <= 4; i++) {
    const connector = document.getElementById(`step-connector-${i}`);
    connector.classList.toggle("is-complete", step > i);
  }
}

function atualizarBlurEtapas() {
  const main = document.getElementById("kiosk-main");
  const stepper = document.getElementById("wizard-stepper");
  const haConteudoAbaixo = main.scrollHeight > main.clientHeight + 1;
  const conteudoSobEtapas =
    !stepper.classList.contains("hidden") && haConteudoAbaixo && main.scrollTop > 1;

  stepper.classList.toggle("has-content-underlay", conteudoSobEtapas);

  const isMobileViewport = window.innerWidth <= 768;
  document.querySelectorAll(".accessibility-dock-control").forEach((control) => {
    if (!isMobileViewport) {
      control.classList.remove("accessibility-obscured");
      return;
    }

    const bounds = control.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const previousVisibility = control.style.visibility;
    control.style.visibility = "hidden";
    const elementBehind = document.elementFromPoint(
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2,
    );
    control.style.visibility = previousVisibility;

    const contentBehind =
      elementBehind &&
      main.contains(elementBehind) &&
      elementBehind !== main &&
      !stepper.contains(elementBehind);
    control.classList.toggle("accessibility-obscured", Boolean(contentBehind));
  });
}

function pressKey(key) {
  playAudioTone(800, 0.05);
  setCpfLookupStatus("");
  if (key === "CLEAR") {
    state.rawCpf = "";
  } else if (key === "BACKSPACE") {
    state.rawCpf = state.rawCpf.slice(0, -1);
  } else {
    if (state.rawCpf.length < 11) {
      state.rawCpf += key;
    }
  }
  updateKeypadDisplay();
}

function updateKeypadDisplay() {
  const inputEl = document.getElementById("kiosk-id-input");
  if (!inputEl) return;

  state.rawCpf = String(state.rawCpf).replace(/\D/g, "").slice(0, 11);
  inputEl.value = formatCpf(state.rawCpf);
}

function formatCpf(cpf) {
  const digits = String(cpf ?? "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validarCpf(cpf) {
  const digits = String(cpf ?? "").replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calcularDigito = (base) => {
    const soma = [...base].reduce(
      (total, digito, indice) => total + Number(digito) * (base.length + 1 - indice),
      0,
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(digits.slice(0, 9)) === Number(digits[9]) &&
    calcularDigito(digits.slice(0, 10)) === Number(digits[10])
  );
}

function gerarNomeAleatorio() {
  const nomes = [
    "Ana Clara Martins",
    "Beatriz Almeida Costa",
    "Camila Rodrigues Lima",
    "Daniel Ferreira Santos",
    "Eduardo Carvalho Souza",
    "Gabriela Oliveira Rocha",
    "João Pedro Ribeiro",
    "Larissa Mendes Alves",
    "Marcos Vinícius Barros",
    "Rafael Gomes Nascimento",
    "Ronaldo Silva Pereira",
    "Sofia Fernandes Castro",
    "Thiago Lima Barbosa",
    "Vitória Santos Moreira",
    "Ronaldo sixevenaldo da silva",
  ];
  return nomes[Math.floor(Math.random() * nomes.length)];
}

function setCpfLookupStatus(message, isError = false) {
  const status = document.getElementById("cpf-lookup-status");
  if (!status) return;

  status.textContent = message;
  status.className = message
    ? `text-sm font-semibold text-center ${isError ? "text-rose-700" : "text-slate-600"} hc-text`
    : "hidden";
}

async function confirmPatientIdentification() {
  if (!validarCpf(state.rawCpf)) {
    setCpfLookupStatus(i18nDict.pt.cpfInvalid, true);
    playAudioTone(350, 0.12);
    return;
  }

  const cpfDigitado = state.rawCpf;
  // Intermediário: após identificar pelo CPF já recebe a ficha (pula serviço e confirmação)
  const isModerate = state.urgencyLevel === "MODERATE";
  const completed = await showAiLoading(
    isModerate ? TICKET_STEP : 3,
    isModerate ? "loadingTicket" : "loadingCpf",
    () => {
    state.patientData.name = gerarNomeAleatorio();
    state.patientData.cpf = formatCpf(cpfDigitado);
    document.getElementById("confirm-patient-name").innerText = state.patientData.name;
    document.getElementById("confirm-patient-cpf").innerText = state.patientData.cpf;
    setCpfLookupStatus("");
    if (isModerate) generateFinalTicket();
  });
  if (completed) {
    speakText(isModerate ? i18nDict.pt.ticketSuccess : i18nDict.pt.legalTitle);
  }
}

async function selectService(type) {
  state.serviceType = type;
  playAudioTone(700, 0.1);
  const completed = await showAiLoading(5, "loadingService");
  if (completed) speakText(i18nDict.pt.step3Title);
}

function renderSpecialties() {
  const container = document.getElementById("specialties-grid");
  if (!container) return;

  container.innerHTML = specialtiesList
    .map(
      (s) => `
                <button onclick="selectSpecialty('${s.name}')" class="hc-card bg-white hover:bg-health-50 border-2 border-slate-200 hover:border-health-500 rounded-2xl p-4 shadow-sm text-left flex flex-col justify-between space-y-3 transition-all group active:scale-95">
                    <div class="p-3 bg-health-100 text-health-700 rounded-xl w-fit group-hover:scale-110 transition-transform">
                        <i data-lucide="${s.icon}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 class="font-black text-slate-800 text-sm hc-text">${s.name}</h4>
                        <span class="text-[11px] text-slate-400 font-semibold">Espera: ${s.wait}</span>
                    </div>
                </button>
            `,
    )
    .join("");
}

async function selectSpecialty(spec) {
  state.selectedSpecialty = spec;
  playAudioTone(700, 0.1);
  const completed = await showAiLoading(
    TICKET_STEP,
    "loadingTicket",
    generateFinalTicket,
  );
  if (completed) speakText(i18nDict.pt.ticketSuccess);
}

async function selectLegalPriority(priority) {
  state.legalPriority = priority;
  playAudioTone(700, 0.1);
  const completed = await showAiLoading(4, "loadingService");
  if (completed) speakText(i18nDict.pt.step2Title);
}

async function selectPriority(level) {
  // level: "MILD" | "MODERATE" | "URGENT"
  cancelPriorityTimer();
  state.urgencyLevel = level;
  playAudioTone(700, 0.1);

  // Grave: não segue o fluxo, o atendente vem direto
  if (level === "URGENT") {
    callAttendant("CASO_GRAVE");
    return;
  }

  // Intermediário: só identifica pelo CPF e recebe a ficha
  if (level === "MODERATE") {
    state.serviceType = "URGENCIA";
    state.selectedSpecialty = "Pronto Atendimento";
  }

  // Leve: segue por todas as perguntas
  const completed = await showAiLoading(2, "loadingStart");
  if (completed) speakText(i18nDict.pt.step1Title);
}

// ---------- Timer da pergunta de prioridade ----------
function startPriorityTimer() {
  cancelPriorityTimer();
  state.priorityCountdownSeconds = PRIORITY_TIMEOUT_SECONDS;
  updatePriorityCountdown();

  state.priorityTimer = setInterval(() => {
    state.priorityCountdownSeconds--;
    updatePriorityCountdown();

    if (state.priorityCountdownSeconds <= 0) {
      cancelPriorityTimer();
      onPriorityTimeout();
    }
  }, 1000);
}

function cancelPriorityTimer() {
  clearInterval(state.priorityTimer);
  state.priorityTimer = null;
}

function updatePriorityCountdown() {
  const el = document.getElementById("priority-countdown");
  if (el) el.innerText = Math.max(state.priorityCountdownSeconds, 0);
}

function onPriorityTimeout() {
  // Sem resposta em 30s: gravidade fica indefinida e o atendente vai até o local
  state.urgencyLevel = "";
  callAttendant("SEM_RESPOSTA");
}

function callAttendant(reason) {
  cancelPriorityTimer();
  const isSevere = reason === "CASO_GRAVE";

  notifyStaff({
    motivo: reason, // "CASO_GRAVE" | "SEM_RESPOSTA"
    gravidade: state.urgencyLevel || "NAO_INFORMADA",
    local: "Totem de autoatendimento",
    horario: new Date().toISOString(),
  });

  const description = isSevere
    ? i18nDict.pt.attendantDescSevere
    : i18nDict.pt.attendantDescTimeout;
  document.getElementById("priority-timeout-title").innerText =
    i18nDict.pt.attendantTitle;
  document.getElementById("priority-timeout-desc").innerText = description;
  document.getElementById("modal-priority-timeout").classList.remove("hidden");

  playAudioTone(isSevere ? 900 : 500, 0.4);
  speakText(`${i18nDict.pt.attendantTitle}. ${description}`);
  lucide.createIcons();

  // O totem volta ao início sozinho depois de um tempo
  clearTimeout(state.attendantScreenTimer);
  state.attendantScreenTimer = setTimeout(
    resetToWelcomeScreen,
    ATTENDANT_SCREEN_SECONDS * 1000,
  );
}

// Ponto de integração: troque pelo envio real (fetch/WebSocket) para o painel da recepção.
function notifyStaff(payload) {
  console.info("[Totem] Atendente solicitado:", payload);
  window.dispatchEvent(
    new CustomEvent("totem:atendente-solicitado", { detail: payload }),
  );
}

function closePriorityTimeoutModal() {
  clearTimeout(state.attendantScreenTimer);
  const modal = document.getElementById("modal-priority-timeout");
  if (modal) modal.classList.add("hidden");
}

function generateFinalTicket() {
  // N = convencional · P = prioritária (dor moderada e constante, ou prioridade por lei)
  const hasLegalPriority = state.legalPriority !== "CONVENCIONAL";
  const isPriority = state.urgencyLevel === "MODERATE" || hasLegalPriority;
  const prefix = isPriority ? "P" : "N";

  const randomNum = Math.floor(Math.random() * 80) + 10;
  state.ticketCode = `${prefix}-0${randomNum}`;

  document.getElementById("ticket-number-display").innerText = state.ticketCode;
  document.getElementById("ticket-patient-name").innerText =
    state.patientData.name;
  document.getElementById("ticket-specialty-name").innerText =
    state.selectedSpecialty;

  const badgeEl = document.getElementById("ticket-priority-badge");
  if (isPriority) {
    badgeEl.innerText = hasLegalPriority
      ? `ATENDIMENTO PRIORITÁRIO (${(LEGAL_PRIORITY_LABELS[state.legalPriority] || state.legalPriority).toUpperCase()})`
      : `ATENDIMENTO ${MODERATE_LEVEL_NAME.toUpperCase()}`;
    badgeEl.className =
      "inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300";
  } else {
    badgeEl.innerText = "ATENDIMENTO CONVENCIONAL";
    badgeEl.className =
      "inline-block px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300";
  }

  playAudioTone(1000, 0.3);
}

function simulatePrintButton() {
  const btn = document.getElementById("btn-print-action");
  btn.innerHTML = `<i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i><span>IMPRIMINDO...</span>`;
  playAudioTone(400, 0.4);

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="check" class="w-6 h-6 text-emerald-300"></i><span>SENHA IMPRESSA!</span>`;
    btn.classList.remove("from-health-600", "to-hospblue-600");
    btn.classList.add("bg-slate-800");
  }, 1200);
}

function startFinishCountdown() {
  clearInterval(state.finishTimer);
  state.finishCountdownSeconds = 15;
  const el = document.getElementById("finish-countdown");

  state.finishTimer = setInterval(() => {
    state.finishCountdownSeconds--;
    if (el) el.innerText = state.finishCountdownSeconds;

    if (state.finishCountdownSeconds <= 0) {
      clearInterval(state.finishTimer);
      resetToWelcomeScreen();
    }
  }, 1000);
}

function resetToWelcomeScreen() {
  clearInterval(state.finishTimer);
  cancelPriorityTimer();
  closePriorityTimeoutModal();
  state.rawCpf = "";
  state.patientData = { name: "", cpf: "" };
  state.currentStep = 0;
  state.serviceType = "";
  state.urgencyLevel = "";
  state.legalPriority = "CONVENCIONAL";
  state.selectedSpecialty = "Clínica Geral";
  updateKeypadDisplay();
  setCpfLookupStatus("");
  document.getElementById("confirm-patient-name").innerText = "";
  document.getElementById("confirm-patient-cpf").innerText = "";

  const btnPrint = document.getElementById("btn-print-action");
  if (btnPrint) {
    btnPrint.innerHTML = `<i data-lucide="printer" class="w-6 h-6"></i><span>IMPRIMIR VIA EM PAPEL</span>`;
    btnPrint.className =
      "w-full bg-health-600 hover:bg-health-700 text-white font-extrabold py-4 px-6 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 hc-btn-primary";
  }

  goToStep(0);
}

// Funções de acessibilidade
function toggleHighContrast() {
  state.isHighContrast = !state.isHighContrast;
  document
    .getElementById("kiosk-body")
    .classList.toggle("high-contrast", state.isHighContrast);
  playAudioTone(500, 0.1);
}

function toggleVoiceAssistant() {
  state.voiceEnabled = !state.voiceEnabled;
  const icon = document.getElementById("icon-voice");
  const label = document.getElementById("text-voice-state");

  if (state.voiceEnabled) {
    label.innerText = i18nDict.pt.voiceOn;
    icon.className = "w-3.5 h-3.5 text-emerald-400 animate-pulse";
    speakText("Leitor de áudio ativado.");
  } else {
    label.innerText = i18nDict.pt.voiceOff;
    icon.className = "w-3.5 h-3.5 text-emerald-300";
  }
}

function speakText(text) {
  if (!state.voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // Interrompe a leitura anterior
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);
}

// Retorno sonoro com a API de áudio da Web
function playAudioTone(freq, duration) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Trata restrições de reprodução automática de áudio do navegador
  }
}