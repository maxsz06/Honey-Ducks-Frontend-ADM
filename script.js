/* ═══════════════════════════════════════════════════
   DADOS — substitua por chamadas reais à sua API/BD
═══════════════════════════════════════════════════ */
const CATEGORIAS_JSON = [
  { id: 1, nome: "Bolos" },
  { id: 2, nome: "Tortas" },
  { id: 3, nome: "Docinhos" },
  { id: 4, nome: "Brigadeiros" },
  { id: 5, nome: "Cookies" },
  { id: 6, nome: "Cheesecakes" },
];

const TAMANHOS_JSON = [
  { id: 1, nome: "Pequeno (P)" },
  { id: 2, nome: "Médio (M)" },
  { id: 3, nome: "Grande (G)" },
  { id: 4, nome: "Família (XG)" },
  { id: 5, nome: "Mini" },
  { id: 6, nome: "Individual" },
];

const INGREDIENTES_JSON = [
  { id: 1,  nome: "Açúcar" },
  { id: 2,  nome: "Farinha de trigo" },
  { id: 3,  nome: "Ovos" },
  { id: 4,  nome: "Manteiga" },
  { id: 5,  nome: "Leite" },
  { id: 6,  nome: "Creme de leite" },
  { id: 7,  nome: "Chocolate meio amargo" },
  { id: 8,  nome: "Chocolate ao leite" },
  { id: 9,  nome: "Chocolate branco" },
  { id: 10, nome: "Leite condensado" },
  { id: 11, nome: "Mel" },
  { id: 12, nome: "Essência de baunilha" },
  { id: 13, nome: "Fermento em pó" },
  { id: 14, nome: "Bicarbonato de sódio" },
  { id: 15, nome: "Sal" },
  { id: 16, nome: "Canela em pó" },
  { id: 17, nome: "Noz-moscada" },
  { id: 18, nome: "Amêndoas" },
  { id: 19, nome: "Nozes" },
  { id: 20, nome: "Morango" },
  { id: 21, nome: "Limão" },
  { id: 22, nome: "Maracujá" },
  { id: 23, nome: "Cream cheese" },
  { id: 24, nome: "Açúcar de confeiteiro" },
  { id: 25, nome: "Cacau em pó" },
];

/* ═══════════════════════════════════════════════════
   ESTADO — ingredientes selecionados
═══════════════════════════════════════════════════ */
let ingredientesSelecionados = []; // array de { id, nome }

/* ═══════════════════════════════════════════════════
   INICIALIZAÇÃO
═══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  popularSelect("categoria", CATEGORIAS_JSON);
  popularSelect("tamanho",   TAMANHOS_JSON);
  initIngredientes();
  initUpload();
});

/* ── Popula um <select> a partir de um array JSON ── */
function popularSelect(id, dados) {
  const select = document.getElementById(id);
  dados.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.nome;
    select.appendChild(opt);
  });
}

/* ═══════════════════════════════════════════════════
   UPLOAD DE IMAGEM
═══════════════════════════════════════════════════ */
function initUpload() {
  const input       = document.getElementById("imagem-input");
  const preview     = document.getElementById("upload-preview");
  const placeholder = document.getElementById("upload-placeholder");
  const area        = document.getElementById("upload-label");

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      mostrarErro("imagem", "A imagem deve ter no máximo 5MB.");
      input.value = "";
      return;
    }
    limparErro("imagem");
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.classList.remove("hidden");
    placeholder.classList.add("hidden");
  });

  // Drag & drop
  area.addEventListener("dragover", e => { e.preventDefault(); area.style.borderColor = "var(--amber)"; });
  area.addEventListener("dragleave", ()  => { area.style.borderColor = ""; });
  area.addEventListener("drop", e => {
    e.preventDefault();
    area.style.borderColor = "";
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.match(/image\/(png|jpeg|webp)/)) return;
    input.files = e.dataTransfer.files;
    input.dispatchEvent(new Event("change"));
  });
}

/* ═══════════════════════════════════════════════════
   INGREDIENTES MULTI-SELECT
═══════════════════════════════════════════════════ */
function initIngredientes() {
  const searchInput = document.getElementById("ingredient-search");
  const dropdown    = document.getElementById("ingredient-dropdown");

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    renderDropdown(q);
  });

  searchInput.addEventListener("focus", () => {
    renderDropdown(searchInput.value.trim().toLowerCase());
  });

  // Fecha ao clicar fora
  document.addEventListener("click", e => {
    if (!e.target.closest(".field-group")) {
      dropdown.classList.add("hidden");
    }
  });
}

function renderDropdown(query) {
  const dropdown = document.getElementById("ingredient-dropdown");
  const selecionadosIds = ingredientesSelecionados.map(i => i.id);

  const filtrados = INGREDIENTES_JSON.filter(ing =>
    !selecionadosIds.includes(ing.id) &&
    ing.nome.toLowerCase().includes(query)
  );

  dropdown.innerHTML = "";

  if (filtrados.length === 0) {
    dropdown.innerHTML = `<div class="dropdown-empty">Nenhum ingrediente encontrado.</div>`;
  } else {
    filtrados.forEach(ing => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = ing.nome;
      item.addEventListener("mousedown", e => {
        e.preventDefault(); // evita blur antes do click
        selecionarIngrediente(ing);
      });
      dropdown.appendChild(item);
    });
  }
  dropdown.classList.remove("hidden");
}

function selecionarIngrediente(ing) {
  if (ingredientesSelecionados.find(i => i.id === ing.id)) return;
  ingredientesSelecionados.push(ing);
  renderChips();
  document.getElementById("ingredient-search").value = "";
  document.getElementById("ingredient-dropdown").classList.add("hidden");
  limparErro("ingredientes");
}

function removerIngrediente(id) {
  ingredientesSelecionados = ingredientesSelecionados.filter(i => i.id !== id);
  renderChips();
}

function renderChips() {
  const box = document.getElementById("ingredient-box");
  // Remove chips antigos
  box.querySelectorAll(".chip").forEach(c => c.remove());

  const searchInput = document.getElementById("ingredient-search");
  ingredientesSelecionados.forEach(ing => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `
      ${ing.nome}
      <button class="chip-remove" title="Remover" onclick="removerIngrediente(${ing.id})">×</button>
    `;
    box.insertBefore(chip, searchInput);
  });
}

/* ═══════════════════════════════════════════════════
   VALIDAÇÃO
═══════════════════════════════════════════════════ */
const CAMPOS = ["nome", "categoria", "tamanho", "sabores", "estoque", "ingredientes", "imagem"];

function validarFormulario() {
  let valido = true;
  CAMPOS.forEach(c => limparErro(c));

  // Campos simples
  const nome = document.getElementById("nome").value.trim();
  if (!nome) { mostrarErro("nome", "Informe o nome do produto."); valido = false; }

  const categoria = document.getElementById("categoria").value;
  if (!categoria) { mostrarErro("categoria", "Selecione uma categoria."); valido = false; }

  const tamanho = document.getElementById("tamanho").value;
  if (!tamanho) { mostrarErro("tamanho", "Selecione um tamanho."); valido = false; }

  const sabores = document.getElementById("sabores").value.trim();
  if (!sabores) { mostrarErro("sabores", "Informe a quantidade de sabores."); valido = false; }

  const estoque = document.getElementById("estoque").value.trim();
  if (!estoque) { mostrarErro("estoque", "Informe a quantidade em estoque."); valido = false; }

  if (ingredientesSelecionados.length === 0) {
    mostrarErro("ingredientes", "Selecione ao menos um ingrediente.");
    document.getElementById("ingredient-box").classList.add("invalid");
    valido = false;
  }

  const imagem = document.getElementById("imagem-input").files[0];
  if (!imagem) { mostrarErro("imagem", "Selecione uma imagem para o produto."); valido = false; }

  return valido;
}

function mostrarErro(campo, msg) {
  const el = document.getElementById(`erro-${campo}`);
  if (el) el.textContent = msg;

  const input = document.getElementById(campo) || document.getElementById(`ingredient-box`);
  if (campo !== "ingredientes" && campo !== "imagem") {
    const field = document.getElementById(campo);
    if (field) field.classList.add("invalid");
  }
}

function limparErro(campo) {
  const el = document.getElementById(`erro-${campo}`);
  if (el) el.textContent = "";
  const field = document.getElementById(campo);
  if (field) field.classList.remove("invalid");
  if (campo === "ingredientes") {
    document.getElementById("ingredient-box").classList.remove("invalid");
  }
}

// Limpa erros ao interagir com os campos
["nome", "categoria", "tamanho", "sabores", "estoque"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input",  () => limparErro(id));
  if (el) el.addEventListener("change", () => limparErro(id));
});

/* ═══════════════════════════════════════════════════
   AÇÕES DOS BOTÕES
═══════════════════════════════════════════════════ */

/** Chamado ao clicar na seta de voltar.
 *  Substitua o conteúdo desta função pela sua lógica de navegação.
 *  Ex.: window.location.href = '/produtos';
 *       history.back();
 *       router.push('/produtos'); // Vue/React
 */
function handleVoltar() {
  // ← INSIRA SUA NAVEGAÇÃO AQUI
  console.log("Voltar para a página anterior");
  // Exemplo: window.location.href = 'produtos.html';
  history.back();
}

/** Limpa o formulário e volta */
function handleCancelar() {
  handleVoltar();
}

/** Valida e envia o formulário */
function handleSubmit() {
  if (!validarFormulario()) return;

  // Monta payload para enviar ao back-end
  const payload = {
    nome:        document.getElementById("nome").value.trim(),
    categoriaId: document.getElementById("categoria").value,
    tamanhoId:   document.getElementById("tamanho").value,
    sabores:     document.getElementById("sabores").value.trim(),
    estoque:     document.getElementById("estoque").value.trim(),
    ingredientes: ingredientesSelecionados.map(i => i.id),
    // imagem: trate como FormData na sua requisição real
  };

  console.log("Payload para a API:", payload);

  // ← Aqui você faria: fetch('/api/produtos', { method: 'POST', body: FormData(...) })
  // Após o sucesso, abre o alert personalizado:
  abrirAlert(`"${payload.nome}" foi cadastrado com sucesso na sua doceria.`);
}

/* ═══════════════════════════════════════════════════
   ALERT PERSONALIZADO
═══════════════════════════════════════════════════ */
function abrirAlert(msg) {
  document.getElementById("alert-msg").textContent = msg;
  document.getElementById("alert-overlay").classList.remove("hidden");
}

function fecharAlert() {
  document.getElementById("alert-overlay").classList.add("hidden");
  // Opcional: limpar o formulário após confirmar
  // resetFormulario();
}

// Fecha ao clicar no overlay (fora da caixa)
document.getElementById("alert-overlay").addEventListener("click", function (e) {
  if (e.target === this) fecharAlert();
});
