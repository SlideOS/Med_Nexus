tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        health: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981",
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
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
          900: "#0f172a",
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

const state = {
  currentStep: 0,
  serviceType: "",
  rawCpf: "",
  patientData: {
    name: "",
    cpf: "",
  },
  selectedSpecialty: "Clínica Geral",
  priorityLevel: "CONVENCIONAL",
  legalPriority: "CONVENCIONAL",
  urgencyLevel: "MILD",
  examDetails: null,
  ticketCode: "",
  loadingToken: 0,
  isHighContrast: false,
  voiceEnabled: false,
  finishTimer: null,
  finishCountdownSeconds: 15,
  priorityTimer: null,
  priorityCountdownSeconds: 30,
  attendantTimer: null,
  attendantCountdownSeconds: 15,
};

const TICKET_STEP = 5;
const STEP_SECTIONS = { 1: 4, 2: 1, 3: 6, 4: 3 };
const PRIORITY_TIMEOUT_SECONDS = 30;
const ATTENDANT_RESET_SECONDS = 15;
const MODERATE_LEVEL_NAME = "Prioritário";
const LEGAL_PRIORITY_LABELS = {
  IDOSO: "Idoso",
  GESTANTE: "Gestante / Lactante",
  PCD: "Pessoa com Deficiência",
  AUTISMO: "TEA",
  OUTROS: "Outras prioridades",
};
const EXAM_CATEGORIES = {
  LAB_SANGUE: { name: "Exames Laboratoriais", location: "Laboratório • 1º andar", wait: "~ 5 min" },
  IMAGEM: { name: "Exames de Imagem", location: "Raio-X • Térreo", wait: "~ 20 min" },
  CARDIO: { name: "Exames Cardiológicos", location: "Cardiologia • 1º andar", wait: "~ 25 min" },
  RETIRADA: { name: "Retirada de Laudos", location: "Recepção B • 1º andar", wait: "~ 5 min" },
};

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
    step3Label: "Confirmação",
    step4Label: "Prioridade",
    step1Title: "Como deseja se identificar?",
    step1Sub: "Digite os 11 números do CPF para simular o atendimento.",
    cpfLabel: "Número do CPF",
    cpfHelp: "Digite apenas os 11 números do documento.",
    cpfInvalid: "Digite os 11 números do CPF.",
    cpfInvalidDigits: "CPF inválido. Confira os números e tente novamente.",
    loadingLabel: "Demonstração do assistente de IA",
    loadingTitle: "Preparando seu atendimento",
    loadingStart: "A IA está organizando o fluxo e preparando sua identificação.",
    loadingCpf: "A IA está validando os dígitos e preparando os dados de demonstração.",
    loadingPriority: "A IA está preparando as informações para direcionar seu atendimento.",
    loadingTicket: "A IA está montando sua senha e organizando a chamada na fila.",
    btnLimpar: "Limpar",
    btnConfirmID: "VALIDAR CPF",
    triageMild: "Dor leve ou desconforto comum",
    triageMildDesc: "Dor de cabeça leve, gripe, dor muscular, curativos ou renovação de receita.",
    triageMod: "Dor moderada, mas constante",
    triageModDesc: "Não é tão forte, mas não passa: febre alta, enxaqueca, mal-estar persistente, pequenas fraturas.",
    triageUrg: "Dor extrema ou muito forte",
    triageUrgDesc: "Dor insuportável, dor no peito, falta de ar intensa, sangramento ativo ou queimaduras severas. Um atendente virá até você.",
    step3Title: "Confirme seus dados e escolha a Especialidade",
    step3Sub: "Localizamos os seguintes dados em nosso sistema:",
    foundPatient: "Paciente de demonstração",
    selectSpecLabel: "Selecione o Setor / Especialidade Desejada:",
    step4Title: "Qual é o nível da sua dor agora?",
    step4Sub: "Selecione a opção que melhor descreve como você está:",
    stepTriageLabel: "Triagem",
    legalTitle: "Você possui direito a Atendimento Prioritário?",
    legalSub: "Selecione uma das opções prioritárias garantidas pela legislação vigente:",
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
    attendantDescTimeout: "Não recebemos sua resposta. Aguarde neste local: um atendente virá até você.",
    attendantDescSevere: "Seu caso foi identificado como grave. Fique neste local: um atendente virá até você agora.",
    ticketSuccess: "Sua Senha foi Gerada com Sucesso!",
    ticketSub: "Retire o comprovante impresso na abertura do totem ou acompanhe no celular pelo QR Code:",
    receiptSubtitle: "Comprovante de Atendimento Digital",
    yourNumber: "SUA SENHA",
    lblPatient: "Paciente:",
    lblSpec: "Especialidade:",
    lblLoc: "Local:",
    lblWait: "Tempo Estimado:",
    tvPrompt: "Fique atento aos painéis de TV espalhados pela recepção.",
    btnPrint: "IMPRIMIR VIA EM PAPEL",
    resetCountdown: "Reiniciando em",
    seconds: "segundos...",
    examOptionTitle: "Exames e Procedimentos Diagnósticos",
    examOptionDesc: "Coleta de sangue, exames laboratoriais, raio-x, tomografia ou retirada de laudos.",
    examLabTitle: "Exames Laboratoriais",
    examLabDesc: "Sangue, urina, fezes e testes de análises clínicas.",
    examImgTitle: "Exames de Imagem",
    examImgDesc: "Raio-X, tomografia, ressonância e ultrassonografia.",
    examCardioTitle: "Exames Cardiológicos",
    examCardioDesc: "ECG, holter, MAPA e ecocardiograma.",
    examRetiradaTitle: "Retirada de Laudos",
    examRetiradaDesc: "Imprimir ou retirar resultados já prontos no balcão.",
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

let scrollTimeout = null;

window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  renderSpecialties();
  updateStepperProgress(1);
  const main = document.getElementById("kiosk-main");
  if (main) {
    main.addEventListener("scroll", () => {
      if (scrollTimeout) return;
      scrollTimeout = requestAnimationFrame(() => {
        atualizarBlurEtapas();
        scrollTimeout = null;
      });
    }, { passive: true });
  }
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
  clearPriorityTimer();
  const loadingToken = ++state.loadingToken;
  const main = document.getElementById("kiosk-main");
  const loadingScreen = document.getElementById("screen-ai-loading");

  if (main) main.scrollTop = 0;
  document.getElementById("wizard-stepper")?.classList.remove("has-content-underlay");
  document.getElementById("welcome-brandmark")?.classList.add("hidden");
  document.getElementById("screen-welcome")?.classList.add("hidden");
  for (let step = 1; step <= 6; step++) {
    document.getElementById(`step-${step}`)?.classList.add("hidden");
  }
  if (main) {
    main.classList.remove("wizard-active");
    main.classList.add("wizard-loading");
  }
  const titleEl = document.getElementById("ai-loading-title");
  const descEl = document.getElementById("ai-loading-description");
  if (titleEl) titleEl.innerText = i18nDict.pt.loadingTitle;
  if (descEl) descEl.innerText = i18nDict.pt[descriptionKey];
  loadingScreen?.classList.remove("hidden");
  lucide.createIcons();
  atualizarBlurEtapas();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (loadingToken !== state.loadingToken) return false;

  onComplete();
  goToStep(nextStep);
  return true;
}

function goToStep(stepNum) {
  clearPriorityTimer();
  state.loadingToken += 1;
  state.currentStep = stepNum;
  const main = document.getElementById("kiosk-main");
  if (main) main.scrollTop = 0;
  document.getElementById("wizard-stepper")?.classList.remove("has-content-underlay");
  document.getElementById("welcome-brandmark")?.classList.toggle("hidden", stepNum !== 0);
  document.getElementById("screen-ai-loading")?.classList.add("hidden");
  if (main) {
    main.classList.toggle("wizard-active", stepNum >= 1 && stepNum < TICKET_STEP);
    main.classList.remove("wizard-loading");
  }

  document.getElementById("screen-welcome")?.classList.add("hidden");
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`step-${i}`);
    if (el) el.classList.add("hidden");
  }

  const stepperBar = document.getElementById("wizard-stepper");

  if (stepNum === 0) {
    document.getElementById("screen-welcome")?.classList.remove("hidden");
    stepperBar?.classList.add("hidden");
    updateStepperProgress(1);
  } else if (stepNum === TICKET_STEP) {
    document.getElementById("step-5")?.classList.remove("hidden");
    stepperBar?.classList.add("hidden");
    startFinishCountdown();
  } else {
    document.getElementById(`step-${STEP_SECTIONS[stepNum]}`)?.classList.remove("hidden");
    stepperBar?.classList.remove("hidden");
    updateStepperProgress(stepNum);
    if (stepNum === 1) startPriorityTimer();
  }

  lucide.createIcons();
  atualizarBlurEtapas();
}

function goToPreviousStep() {
  if (state.currentStep > 1) {
    goToStep(state.currentStep - 1);
  }
}

function updateStepperProgress(step) {
  for (let i = 1; i <= 4; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (!node) continue;
    node.classList.toggle("is-complete", i < step);
    node.classList.toggle("is-current", i === step);
    node.classList.toggle("is-upcoming", i > step);
    if (i === step) node.setAttribute("aria-current", "step");
    else node.removeAttribute("aria-current");
  }

  for (let i = 1; i <= 3; i++) {
    const connector = document.getElementById(`step-connector-${i}`);
    if (connector) connector.classList.toggle("is-complete", step > i);
  }
}

function atualizarBlurEtapas() {
  const main = document.getElementById("kiosk-main");
  const stepper = document.getElementById("wizard-stepper");
  if (!main || !stepper) return;
  const haConteudoAbaixo = main.scrollHeight > main.clientHeight + 1;
  const conteudoSobEtapas = !stepper.classList.contains("hidden") && haConteudoAbaixo && main.scrollTop > 1;
  stepper.classList.toggle("has-content-underlay", conteudoSobEtapas);

  document.querySelectorAll(".accessibility-dock-control").forEach((control) => {
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
    setCpfLookupStatus(
      state.rawCpf.length < 11 ? i18nDict.pt.cpfInvalid : i18nDict.pt.cpfInvalidDigits,
      true,
    );
    playAudioTone(350, 0.12);
    return;
  }

  const cpfDigitado = state.rawCpf;
  const isModerate = state.urgencyLevel === "MODERATE";
  const completed = await showAiLoading(
    isModerate ? TICKET_STEP : 3,
    isModerate ? "loadingTicket" : "loadingCpf",
    () => {
      const cleanCpf = String(cpfDigitado).replace(/\D/g, "");
      if (cleanCpf === "16992072404") {
        state.patientData.name = "Maria Daniela de Faria";
      } else if (cleanCpf === "11144477735") {
        state.patientData.name = "Franciele Samara";
      } else {
        state.patientData.name = gerarNomeAleatorio();
      }
      state.patientData.cpf = formatCpf(cpfDigitado);
      const nameEl = document.getElementById("confirm-patient-name");
      const cpfEl = document.getElementById("confirm-patient-cpf");
      if (nameEl) nameEl.innerText = state.patientData.name;
      if (cpfEl) cpfEl.innerText = state.patientData.cpf;
      setCpfLookupStatus("");
      if (isModerate) generateFinalTicket();
    }
  );
  if (completed) {
    speakText(isModerate ? i18nDict.pt.ticketSuccess : i18nDict.pt.legalTitle);
  }
}

async function selectPriority(level) {
  state.urgencyLevel = level;
  state.examDetails = null;
  state.legalPriority = "CONVENCIONAL";

  if (level === "URGENT") {
    playAudioTone(350, 0.25);
    showAttendantModal("severe");
    return;
  }

  playAudioTone(700, 0.1);
  const completed = await showAiLoading(2, "loadingStart");
  if (completed) speakText(i18nDict.pt.step1Title);
}

function startPriorityTimer() {
  clearPriorityTimer();
  state.priorityCountdownSeconds = PRIORITY_TIMEOUT_SECONDS;
  const el = document.getElementById("priority-countdown");
  if (el) el.innerText = state.priorityCountdownSeconds;

  state.priorityTimer = setInterval(() => {
    state.priorityCountdownSeconds--;
    if (el) el.innerText = Math.max(state.priorityCountdownSeconds, 0);
    if (state.priorityCountdownSeconds <= 0) {
      clearPriorityTimer();
      showAttendantModal("timeout");
    }
  }, 1000);
}

function clearPriorityTimer() {
  clearInterval(state.priorityTimer);
  state.priorityTimer = null;
}

function showAttendantModal(reason) {
  clearPriorityTimer();
  state.loadingToken += 1;
  const key = reason === "severe" ? "attendantDescSevere" : "attendantDescTimeout";
  const titleEl = document.getElementById("priority-timeout-title");
  const descEl = document.getElementById("priority-timeout-desc");
  if (titleEl) titleEl.innerText = i18nDict.pt.attendantTitle;
  if (descEl) descEl.innerText = i18nDict.pt[key];
  document.getElementById("modal-priority-timeout")?.classList.remove("hidden");
  speakText(`${i18nDict.pt.attendantTitle}. ${i18nDict.pt[key]}`);

  clearInterval(state.attendantTimer);
  state.attendantCountdownSeconds = ATTENDANT_RESET_SECONDS;
  const el = document.getElementById("attendant-countdown");
  if (el) el.innerText = state.attendantCountdownSeconds;

  state.attendantTimer = setInterval(() => {
    state.attendantCountdownSeconds--;
    if (el) el.innerText = Math.max(state.attendantCountdownSeconds, 0);
    if (state.attendantCountdownSeconds <= 0) resetToWelcomeScreen();
  }, 1000);
}

function hideAttendantModal() {
  clearInterval(state.attendantTimer);
  state.attendantTimer = null;
  document.getElementById("modal-priority-timeout")?.classList.add("hidden");
}

function toggleExamOptions() {
  const wrapper = document.getElementById("exam-derivatives-wrapper");
  const open = wrapper?.classList.contains("hidden");
  setExamOptionsOpen(Boolean(open));
  playAudioTone(600, 0.05);
}

function collapseExamOptions() {
  setExamOptionsOpen(false);
}

function setExamOptionsOpen(open) {
  const wrapper = document.getElementById("exam-derivatives-wrapper");
  const toggle = document.getElementById("btn-toggle-exams");
  const label = document.getElementById("exam-toggle-label");
  const chevron = document.getElementById("exam-toggle-chevron");
  if (!wrapper) return;
  wrapper.classList.toggle("hidden", !open);
  if (toggle) toggle.setAttribute("aria-expanded", String(open));
  if (label) label.innerText = open ? "Ocultar" : "Ver opções";
  if (chevron) chevron.classList.toggle("rotate-180", open);
}

async function selectExamCategory(category) {
  const exam = EXAM_CATEGORIES[category];
  if (!exam) return;
  state.urgencyLevel = "MILD";
  state.legalPriority = "CONVENCIONAL";
  state.examDetails = { location: exam.location, wait: exam.wait };
  state.selectedSpecialty = exam.name;
  playAudioTone(700, 0.1);
  const completed = await showAiLoading(2, "loadingStart");
  if (completed) speakText(i18nDict.pt.step1Title);
}

async function selectLegalPriority(type) {
  state.legalPriority = type;
  state.priorityLevel = type;
  playAudioTone(700, 0.1);

  if (state.examDetails) {
    const done = await showAiLoading(TICKET_STEP, "loadingTicket", generateFinalTicket);
    if (done) speakText(i18nDict.pt.ticketSuccess);
    return;
  }
  const completed = await showAiLoading(4, "loadingCpf");
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

function generateFinalTicket() {
  const isModerate = state.urgencyLevel === "MODERATE";
  const hasLegalPriority = Boolean(state.legalPriority) && state.legalPriority !== "CONVENCIONAL";
  const isPriority = isModerate || hasLegalPriority;
  const isExam = Boolean(state.examDetails);
  const prefix = isPriority ? "P" : "N";

  const randomNum = Math.floor(Math.random() * 80) + 10;
  state.ticketCode = `${prefix}-0${randomNum}`;

  const numDisp = document.getElementById("ticket-number-display");
  const nameDisp = document.getElementById("ticket-patient-name");
  const specDisp = document.getElementById("ticket-specialty-name");
  if (numDisp) numDisp.innerText = state.ticketCode;
  if (nameDisp) nameDisp.innerText = state.patientData.name;
  if (specDisp) specDisp.innerText = state.selectedSpecialty;

  const locEl = document.getElementById("ticket-location-name");
  const waitEl = document.getElementById("ticket-wait-time");
  if (state.examDetails) {
    if (locEl) locEl.innerText = state.examDetails.location;
    if (waitEl) waitEl.innerText = state.examDetails.wait;
  } else {
    if (locEl) locEl.innerText = "Recepção A • Térreo";
    if (waitEl) waitEl.innerText = "~ 12 min";
  }

  const badgeEl = document.getElementById("ticket-priority-badge");
  if (badgeEl) {
    if (isPriority) {
      badgeEl.innerText = hasLegalPriority
        ? `ATENDIMENTO PRIORITÁRIO (${(LEGAL_PRIORITY_LABELS[state.legalPriority] || state.legalPriority).toUpperCase()})`
        : `ATENDIMENTO ${MODERATE_LEVEL_NAME.toUpperCase()}`;
      badgeEl.className = "inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300";
    } else if (isExam) {
      badgeEl.innerText = "ATENDIMENTO CONVENCIONAL (EXAMES)";
      badgeEl.className = "inline-block px-3 py-1 rounded-full text-xs font-black bg-hospblue-100 text-hospblue-800 border border-hospblue-200";
    } else {
      badgeEl.innerText = "ATENDIMENTO CONVENCIONAL";
      badgeEl.className = "inline-block px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300";
    }
  }

  const qrImg = document.getElementById("ticket-qrcode-img");
  if (qrImg) {
    qrImg.src = state.isHighContrast ? "assets/ui/qrcode_escuro.png" : "assets/ui/qrcode_claro.png";
  }

  playAudioTone(1000, 0.3);
}

function simulatePrintButton() {
  const btn = document.getElementById("btn-print-action");
  if (!btn) return;
  btn.innerHTML = `<i data-lucide="loader-circle" class="w-6 h-6 animate-spin"></i><span>IMPRIMINDO...</span>`;
  lucide.createIcons();
  playAudioTone(400, 0.4);

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="check" class="w-6 h-6 text-emerald-300"></i><span>SENHA IMPRESSA!</span>`;
    btn.classList.remove("bg-health-600", "hover:bg-health-700");
    btn.classList.add("bg-slate-800");
    lucide.createIcons();
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
  state.rawCpf = "";
  state.patientData = { name: "", cpf: "" };
  state.currentStep = 0;
  state.serviceType = "";
  state.priorityLevel = "CONVENCIONAL";
  state.legalPriority = "CONVENCIONAL";
  state.urgencyLevel = "MILD";
  state.examDetails = null;
  state.selectedSpecialty = "Clínica Geral";
  state.ticketCode = "";
  state.loadingToken += 1;
  clearPriorityTimer();
  hideAttendantModal();
  collapseExamOptions();
  updateKeypadDisplay();
  setCpfLookupStatus("");
  const nameEl = document.getElementById("confirm-patient-name");
  const cpfEl = document.getElementById("confirm-patient-cpf");
  if (nameEl) nameEl.innerText = "";
  if (cpfEl) cpfEl.innerText = "";

  const btnPrint = document.getElementById("btn-print-action");
  if (btnPrint) {
    btnPrint.innerHTML = `<i data-lucide="printer" class="w-6 h-6"></i><span>IMPRIMIR VIA EM PAPEL</span>`;
    btnPrint.className = "w-full bg-health-600 hover:bg-health-700 text-white font-extrabold py-4 px-6 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 hc-btn-primary";
  }

  goToStep(0);
}

function toggleHighContrast() {
  state.isHighContrast = !state.isHighContrast;
  document.getElementById("kiosk-body")?.classList.toggle("high-contrast", state.isHighContrast);
  
  const qrImg = document.getElementById("ticket-qrcode-img");
  if (qrImg) {
    qrImg.src = state.isHighContrast ? "assets/ui/qrcode_escuro.png" : "assets/ui/qrcode_claro.png";
  }

  playAudioTone(500, 0.1);
}

function toggleVoiceAssistant() {
  state.voiceEnabled = !state.voiceEnabled;
  const icon = document.getElementById("icon-voice");
  const label = document.getElementById("text-voice-state");
  if (label) label.innerText = state.voiceEnabled ? i18nDict.pt.voiceOn : i18nDict.pt.voiceOff;
  if (icon) {
    icon.classList.toggle("text-emerald-600", state.voiceEnabled);
    icon.classList.toggle("animate-pulse", state.voiceEnabled);
  }
  if (state.voiceEnabled) {
    speakText("Leitor de áudio ativado.");
  } else if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakText(text) {
  if (!state.voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  window.speechSynthesis.speak(utterance);
}

let sharedAudioCtx = null;
function playAudioTone(freq, duration) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx) sharedAudioCtx = new AudioContextClass();
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
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
  } catch (e) {}
}