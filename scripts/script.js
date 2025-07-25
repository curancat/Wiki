

// Initialize Firebase (replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyDV-t-KixXdKzBkTIJ3k2sHDRRm0JgU0fg",
    authDomain: "wiki-92718.firebaseapp.com",
    projectId: "wiki-92718",
    storageBucket: "wiki-92718.firebasestorage.app",
    messagingSenderId: "711754008723",
    appId: "1:711754008723:web:0e966eb47fb9eb1a1ee566",
    measurementId: "G-JM0MRLPDJH"
  };


// Only initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Get references to buttons
const registerItemBtn = document.querySelector('.botao:nth-child(1)');
const registerCharacterBtn = document.querySelector('.botao:nth-child(2)');
const registerConceptBtn = document.querySelector('.botao:nth-child(3)');
const accessRegistrationsBtn = document.querySelector('.botao:nth-child(4)');
const draftsBtn = document.querySelector('.botao:nth-child(5)');
const chalkboardContainer = document.querySelector('.chalkboard-container');

// --- Helper Functions to Clear and Render Content ---
function clearChalkboard() {
  chalkboardContainer.innerHTML = ''; // Clears all existing content
}

function renderHomePage() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Wiki-Au</h1>
    <div class="center">
      <button class="botao">cadastrar Item</button>
      <button class="botao">cadastrar Personagem</button>
      <button class="botao">cadastrar Conceito</button>
      <button class="botao">Acessar Cadastros</button>
      <button class="botao">Rascunhos</button>
    </div>
  `;
  attachButtonListeners(); // Re-attach listeners after re-rendering
}

// --- Registration Functions ---

async function registerData(collectionName, fields) {
  const data = {};
  for (const field of fields) {
    let value = prompt(`Por favor, insira o ${field} do(a) ${collectionName}:`);
    if (value === null) return; // User cancelled
    data[field] = value;
  }

  try {
    const docRef = await db.collection(collectionName).add(data);
    alert(`${collectionName} cadastrado(a) com sucesso! ID: ${docRef.id}`);
  } catch (error) {
    console.error("Erro ao cadastrar: ", error);
    alert("Erro ao cadastrar. Verifique o console para mais detalhes.");
  }
}

// --- Access Registrations ---

async function accessRegistrations() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Acessar Cadastros</h1>
    <div class="registration-menu">
      <button class="botao small-button" id="access-characters">Personagens</button>
      <button class="botao small-button" id="access-items">Itens</button>
      <button class="botao small-button" id="access-concepts">Conceitos</button>
      <button class="botao small-button" id="back-to-home">Voltar</button>
    </div>
  `;

  document.getElementById('access-characters').addEventListener('click', displayCharacters);
  document.getElementById('access-items').addEventListener('click', displayItems);
  document.getElementById('access-concepts').addEventListener('click', displayConcepts);
  document.getElementById('back-to-home').addEventListener('click', renderHomePage);
}

// --- Display Functions for Registered Data ---

async function displayCharacters() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Personagens Cadastrados</h1>
    <div class="character-grid"></div>
    <button class="botao small-button" id="back-to-registrations">Voltar aos Cadastros</button>
  `;

  document.getElementById('back-to-registrations').addEventListener('click', accessRegistrations);

  const characterGrid = document.querySelector('.character-grid');
  try {
    const snapshot = await db.collection('Personagem').get();
    if (snapshot.empty) {
      characterGrid.innerHTML = '<p class="no-data">Nenhum personagem cadastrado ainda.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const characterCard = document.createElement('div');
      characterCard.classList.add('character-card-small');
      characterCard.innerHTML = `
        <img src="${data.imagemLink || 'https://via.placeholder.com/100/2f4f4f/ffffff?text=No+Image'}" alt="${data.nome}">
        <p>${data.nome}</p>
      `;
      characterCard.addEventListener('click', () => displayCharacterDetails(doc.id, data));
      characterGrid.appendChild(characterCard);
    });
  } catch (error) {
    console.error("Erro ao carregar personagens: ", error);
    characterGrid.innerHTML = '<p class="error-message">Erro ao carregar personagens.</p>';
  }
}

function displayCharacterDetails(id, data) {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Detalhes do Personagem</h1>
    <div class="character-details-card">
      <img src="${data.imagemLink || 'https://via.placeholder.com/200/2f4f4f/ffffff?text=No+Image'}" alt="${data.nome}">
      <h2>Nome: ${data.nome}</h2>
      <p><strong>Descrição:</strong> ${data.descricao || 'N/A'}</p>
      <p><strong>Outras Informações:</strong> ${data.outrasInformacoes || 'N/A'}</p>
      <p><strong>ID:</strong> ${id}</p>
    </div>
    <button class="botao small-button" id="back-to-characters">Voltar aos Personagens</button>
  `;
  document.getElementById('back-to-characters').addEventListener('click', displayCharacters);
}

async function displayItems() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Itens Cadastrados</h1>
    <div class="item-inventory"></div>
    <button class="botao small-button" id="back-to-registrations">Voltar aos Cadastros</button>
  `;

  document.getElementById('back-to-registrations').addEventListener('click', accessRegistrations);

  const itemInventory = document.querySelector('.item-inventory');
  try {
    const snapshot = await db.collection('Item').get();
    if (snapshot.empty) {
      itemInventory.innerHTML = '<p class="no-data">Nenhum item cadastrado ainda.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const itemIcon = document.createElement('div');
      itemIcon.classList.add('item-icon');
      itemIcon.innerHTML = `
        <img src="${data.imagemLink || 'https://via.placeholder.com/70/2f4f4f/ffffff?text=Item'}" alt="${data.nome}">
        <p>${data.nome}</p>
      `;
      itemIcon.addEventListener('click', () => displayItemDetails(doc.id, data));
      itemInventory.appendChild(itemIcon);
    });
  } catch (error) {
    console.error("Erro ao carregar itens: ", error);
    itemInventory.innerHTML = '<p class="error-message">Erro ao carregar itens.</p>';
  }
}

function displayItemDetails(id, data) {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Detalhes do Item</h1>
    <div class="item-details-panel">
      <img src="${data.imagemLink || 'https://via.placeholder.com/150/2f4f4f/ffffff?text=No+Image'}" alt="${data.nome}">
      <h2>Nome: ${data.nome}</h2>
      <p><strong>Descrição:</strong> ${data.descricao || 'N/A'}</p>
      <p><strong>Tipo:</strong> ${data.tipo || 'N/A'}</p>
      <p><strong>Raridade:</strong> ${data.raridade || 'N/A'}</p>
      <p><strong>ID:</strong> ${id}</p>
    </div>
    <button class="botao small-button" id="back-to-items">Voltar aos Itens</button>
  `;
  document.getElementById('back-to-items').addEventListener('click', displayItems);
}

async function displayConcepts() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Conceitos Cadastrados</h1>
    <div class="concept-list"></div>
    <button class="botao small-button" id="back-to-registrations">Voltar aos Cadastros</button>
  `;

  document.getElementById('back-to-registrations').addEventListener('click', accessRegistrations);

  const conceptList = document.querySelector('.concept-list');
  try {
    const snapshot = await db.collection('Conceito').get();
    if (snapshot.empty) {
      conceptList.innerHTML = '<p class="no-data">Nenhum conceito cadastrado ainda.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const conceptEntry = document.createElement('div');
      conceptEntry.classList.add('concept-entry');
      conceptEntry.innerHTML = `
        <h3>${data.nome}</h3>
        <p>${data.descricao.substring(0, 100)}...</p>
      `;
      conceptEntry.addEventListener('click', () => displayConceptDetails(doc.id, data));
      conceptList.appendChild(conceptEntry);
    });
  } catch (error) {
    console.error("Erro ao carregar conceitos: ", error);
    conceptList.innerHTML = '<p class="error-message">Erro ao carregar conceitos.</p>';
  }
}

function displayConceptDetails(id, data) {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Detalhes do Conceito</h1>
    <div class="concept-details-panel">
      ${data.imagemLink ? `<img src="${data.imagemLink}" alt="${data.nome}">` : ''}
      <h2>Nome: ${data.nome}</h2>
      <p><strong>Descrição:</strong> ${data.descricao || 'N/A'}</p>
      <p><strong>ID:</strong> ${id}</p>
    </div>
    <button class="botao small-button" id="back-to-concepts">Voltar aos Conceitos</button>
  `;
  document.getElementById('back-to-concepts').addEventListener('click', displayConcepts);
}

// --- Drafts (Rascunhos) Section ---

async function displayDrafts() {
  clearChalkboard();
  chalkboardContainer.innerHTML = `
    <h1>Rascunhos</h1>
    <div class="draft-actions">
      <button class="botao small-button" id="add-draft">Adicionar Rascunho</button>
      <button class="botao small-button" id="back-to-home-from-drafts">Voltar</button>
    </div>
    <div class="draft-list"></div>
  `;

  document.getElementById('add-draft').addEventListener('click', addDraft);
  document.getElementById('back-to-home-from-drafts').addEventListener('click', renderHomePage);

  const draftList = document.querySelector('.draft-list');
  try {
    const snapshot = await db.collection('Rascunho').get();
    if (snapshot.empty) {
      draftList.innerHTML = '<p class="no-data">Nenhum rascunho salvo ainda.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const draftEntry = document.createElement('div');
      draftEntry.classList.add('draft-entry');
      draftEntry.innerHTML = `
        <h3>${data.nome}</h3>
        ${data.imagemLink ? `<img src="${data.imagemLink}" alt="${data.nome}">` : ''}
        <p>${data.anotacao.substring(0, 150)}...</p>
        <button class="botao x-small-button view-draft-btn" data-id="${doc.id}">Ver Rascunho</button>
        <button class="botao x-small-button delete-draft-btn" data-id="${doc.id}">Excluir</button>
      `;
      draftList.appendChild(draftEntry);
    });

    // Attach event listeners to view and delete buttons
    document.querySelectorAll('.view-draft-btn').forEach(button => {
      button.addEventListener('click', (event) => viewDraftDetails(event.target.dataset.id));
    });
    document.querySelectorAll('.delete-draft-btn').forEach(button => {
      button.addEventListener('click', (event) => deleteDraft(event.target.dataset.id));
    });

  } catch (error) {
    console.error("Erro ao carregar rascunhos: ", error);
    draftList.innerHTML = '<p class="error-message">Erro ao carregar rascunhos.</p>';
  }
}

async function addDraft() {
  const nome = prompt("Nome da anotação:");
  if (!nome) return;

  const anotacao = prompt("Anotação:");
  if (!anotacao) return;

  const imagemLink = prompt("Link da imagem (opcional):");

  try {
    const docRef = await db.collection('Rascunho').add({
      nome,
      anotacao,
      imagemLink
    });
    alert(`Rascunho "${nome}" salvo com sucesso!`);
    displayDrafts(); // Refresh the list
  } catch (error) {
    console.error("Erro ao salvar rascunho: ", error);
    alert("Erro ao salvar rascunho. Verifique o console.");
  }
}

async function viewDraftDetails(id) {
  try {
    const doc = await db.collection('Rascunho').doc(id).get();
    if (!doc.exists) {
      alert("Rascunho não encontrado.");
      return;
    }
    const data = doc.data();
    clearChalkboard();
    chalkboardContainer.innerHTML = `
      <h1>Rascunho: ${data.nome}</h1>
      <div class="draft-details-panel">
        ${data.imagemLink ? `<img src="${data.imagemLink}" alt="${data.nome}">` : ''}
        <p>${data.anotacao}</p>
      </div>
      <button class="botao small-button" id="back-to-drafts">Voltar aos Rascunhos</button>
    `;
    document.getElementById('back-to-drafts').addEventListener('click', displayDrafts);
  } catch (error) {
    console.error("Erro ao carregar rascunho: ", error);
    alert("Erro ao carregar rascunho.");
  }
}

async function deleteDraft(id) {
  if (confirm("Tem certeza que deseja excluir este rascunho?")) {
    try {
      await db.collection('Rascunho').doc(id).delete();
      alert("Rascunho excluído com sucesso!");
      displayDrafts(); // Refresh the list
    } catch (error) {
      console.error("Erro ao excluir rascunho: ", error);
      alert("Erro ao excluir rascunho.");
    }
  }
}

// --- Attach Event Listeners to Initial Buttons ---
function attachButtonListeners() {
  document.querySelector('.botao:nth-child(1)').addEventListener('click', () =>
    registerData('Item', ['nome', 'imagemLink', 'descricao', 'tipo', 'raridade'])
  );
  document.querySelector('.botao:nth-child(2)').addEventListener('click', () =>
    registerData('Personagem', ['nome', 'imagemLink', 'descricao', 'outrasInformacoes'])
  );
  document.querySelector('.botao:nth-child(3)').addEventListener('click', () =>
    registerData('Conceito', ['nome', 'imagemLink', 'descricao'])
  );
  document.querySelector('.botao:nth-child(4)').addEventListener('click', accessRegistrations);
  document.querySelector('.botao:nth-child(5)').addEventListener('click', displayDrafts);
}

// Initial attachment of listeners when the page loads
document.addEventListener('DOMContentLoaded', attachButtonListeners);