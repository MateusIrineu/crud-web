const lista = document.getElementById("ul__tarefa");
const botaoAdd = document.querySelector(".card__tarefa_btn_add");
const input = document.getElementById("inputTarefa");
const inputTelefone = document.getElementById("inputTelefone");
const inputEmail = document.getElementById("inputEmail");

let cardsData = [];

function salvarNoLocalStorage() {
  const itens = [];
  document.querySelectorAll("#ul__tarefa li").forEach((li) => {
    const dadosElement = li.querySelector(".dados-tarefa");
    if (dadosElement) {
      itens.push({
        nome: dadosElement.dataset.nome,
        telefone: dadosElement.dataset.telefone,
        email: dadosElement.dataset.email,
        feito: li.classList.contains("checked"),
      });
    }
  });
  localStorage.setItem("tarefas", JSON.stringify(itens));
  cardsData = itens;
  console.log("Dados salvos:", cardsData);
}

function criarItem(nome, telefone, email, feito = false) {
  const li = document.createElement("li");
  li.style.position = "relative";
  
  const dadosDiv = document.createElement("div");
  dadosDiv.className = "dados-tarefa";
  dadosDiv.dataset.nome = nome;
  dadosDiv.dataset.telefone = telefone;
  dadosDiv.dataset.email = email;
  dadosDiv.innerHTML = `
    <strong>Nome:</strong> <span class="span-nome">${nome}</span><input class="input-nome" style="display:none;" value="${nome}"><br>
    <strong>Telefone:</strong> <span class="span-telefone">${telefone}</span><input class="input-telefone" style="display:none" value="${telefone}"><br>
    <strong>Email:</strong> <span class="span-email">${email}</span><input class="input-email" style="display:none;" value="${email}">
  `;
  li.appendChild(dadosDiv);
  
  if (feito) {
    li.classList.add("checked");
  }
  
  const btnEdit = document.createElement("span");
  btnEdit.textContent = "✏️";
  btnEdit.className = "edit";
  btnEdit.title = "Editar";
  li.appendChild(btnEdit);
  
  const btn = document.createElement("span");
  btn.textContent = "💔";
  btn.className = "close";
  li.appendChild(btn);
  
  return li;
}

function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas"));
  if (!tarefasSalvas) return;
  tarefasSalvas.forEach((item) => {
    lista.appendChild(
      criarItem(item.nome, item.telefone, item.email, item.feito)
    );
  });
}

carregarTarefas();

botaoAdd.addEventListener("click", () => {
  const nome = input.value.trim();
  const telefone = inputTelefone.value.trim();
  const email = inputEmail.value.trim();
  if (!nome || !telefone || !email) {
    alert("Digite todas as informações!");
    return;
  }
  lista.appendChild(criarItem(nome, telefone, email));
  salvarNoLocalStorage();
  input.value = "";
  inputTelefone.value = "";
  inputEmail.value = "";
});

let editLi = null;
let oldValues = {};

lista.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    salvarNoLocalStorage();
  }
  
  if (e.target.classList.contains("close")) {
    e.target.parentElement.remove();
    salvarNoLocalStorage();
  }
  
  if (e.target.classList.contains("edit") && !e.target.classList.contains("salvando")) {
    const li = e.target.closest("li");
    if (editLi && editLi !== li) {
      cancelarEdicao(editLi);
    }
    editLi = li;
    const dadosDiv = li.querySelector(".dados-tarefa");
    
    oldValues = {
      nome: dadosDiv.querySelector(".input-nome").value,
      telefone: dadosDiv.querySelector(".input-telefone").value,
      email: dadosDiv.querySelector(".input-email").value
    };
    
    dadosDiv.querySelector(".span-nome").style.display = "none";
    dadosDiv.querySelector(".input-nome").style.display = "inline-block";
    dadosDiv.querySelector(".span-telefone").style.display = "none";
    dadosDiv.querySelector(".input-telefone").style.display = "inline-block";
    dadosDiv.querySelector(".span-email").style.display = "none";
    dadosDiv.querySelector(".input-email").style.display = "inline-block";
    
    li.querySelector(".close").style.display = "none";
    
    e.target.textContent = "💾";
    e.target.title = "Salvar";
    e.target.classList.add("salvando");
  } else if (e.target.classList.contains("salvando")) {
    const li = e.target.closest("li");
    const dadosDiv = li.querySelector(".dados-tarefa");
    
    const nome = dadosDiv.querySelector(".input-nome").value.trim();
    const telefone = dadosDiv.querySelector(".input-telefone").value.trim();
    const email = dadosDiv.querySelector(".input-email").value.trim();
    
    if (!nome || !telefone || !email) {
      alert("Preencha todos os campos!");
      return;
    }
    
    dadosDiv.dataset.nome = nome;
    dadosDiv.dataset.telefone = telefone;
    dadosDiv.dataset.email = email;
    
    dadosDiv.querySelector(".span-nome").textContent = nome;
    dadosDiv.querySelector(".span-telefone").textContent = telefone;
    dadosDiv.querySelector(".span-email").textContent = email;
    
    dadosDiv.querySelector(".span-nome").style.display = "inline";
    dadosDiv.querySelector(".input-nome").style.display = "none";
    dadosDiv.querySelector(".span-telefone").style.display = "inline";
    dadosDiv.querySelector(".input-telefone").style.display = "none";
    dadosDiv.querySelector(".span-email").style.display = "inline";
    dadosDiv.querySelector(".input-email").style.display = "none";
    
    li.querySelector(".close").style.display = "";
    
    e.target.textContent = "✏️";
    e.target.title = "Editar";
    e.target.classList.remove("salvando");
    editLi = null;
    salvarNoLocalStorage();
  }
});

function cancelarEdicao(li) {
  const dadosDiv = li.querySelector(".dados-tarefa");
  dadosDiv.querySelector(".input-nome").value = oldValues.nome;
  dadosDiv.querySelector(".input-telefone").value = oldValues.telefone;
  dadosDiv.querySelector(".input-email").value = oldValues.email;
  
  dadosDiv.querySelector(".span-nome").style.display = "inline";
  dadosDiv.querySelector(".input-nome").style.display = "none";
  dadosDiv.querySelector(".span-telefone").style.display = "inline";
  dadosDiv.querySelector(".input-telefone").style.display = "none";
  dadosDiv.querySelector(".span-email").style.display = "inline";
  dadosDiv.querySelector(".input-email").style.display = "none";
  
  li.querySelector(".close").style.display = "";
  
  const btnEdit = li.querySelector(".edit");
  btnEdit.textContent = "✏️";
  btnEdit.title = "Editar";
  btnEdit.classList.remove("salvando");
}