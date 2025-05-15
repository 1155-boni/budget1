let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editingTransactionId = null;


function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  const list = document.getElementById("transactions");
  const filterType = document.getElementById("filter-type").value;
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    const isIncome = t.amount > 0;
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "income" && isIncome) ||
      (filterType === "expense" && !isIncome);

    if (!matchesFilter) return;

    li = document.createElement("li");
    li.classList.add(isIncome ? "income" : "expense");
   li.innerHTML = `
  <strong>${t.description}</strong> (${t.category})<br/>
  <small>${new Date(t.date).toLocaleDateString()}</small>
  <span>Ksh ${t.amount.toFixed(2)}</span>
  <span class="edit-btn" onclick="editTransaction(${t.id})">✏️</span>
  <span class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️</span>
`;

    list.appendChild(li);

    if (isIncome) income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = `Ksh ${income.toFixed(2)}`;
  document.getElementById("expense").innerText = `Ksh ${Math.abs(expense).toFixed(2)}`;
  document.getElementById("balance").innerText = `Ksh ${(income + expense).toFixed(2)}`;
}

function addTransaction() {
  const descInput = document.getElementById("description");
  const amtInput = document.getElementById("amount");
  const typeSelect = document.getElementById("type");
  const catSelect = document.getElementById("category");
  const dateInput = document.getElementById("date");

  const description = descInput.value.trim();
  let amount = parseFloat(amtInput.value);
  const type = typeSelect.value;
  const category = catSelect.value;
  const date = dateInput.value;

  if (!description || isNaN(amount) || amount <= 0 || !category || !date) {
    alert("Please fill in all fields correctly.");
    return;
  }

  if (type === "expense") amount = -amount;

  if (editingTransactionId) {
    // Update existing transaction
    const transaction = transactions.find(t => t.id === editingTransactionId);
    transaction.description = description;
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.date = date;

    editingTransactionId = null;
    document.querySelector(".form button").textContent = "Add";
  } else {
    // Add new transaction
    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date
    };
    transactions.push(transaction);
  }

  updateLocalStorage();
  renderTransactions();

  // Reset form
  descInput.value = "";
  amtInput.value = "";
  catSelect.value = "";
  typeSelect.value = "income";
  dateInput.value = "";
}

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();

  descInput.value = "";
  amtInput.value = "";
  catSelect.value = "";
  typeSelect.value = "income";
   dateInput.value = "";


function deleteTransaction(id) {
  // Remove transaction with matching id from the array
  transactions = transactions.filter(t => t.id !== id);

  // Update localStorage so data stays in sync
  updateLocalStorage();

  // Re-render the updated transactions list and totals
  renderTransactions();
}

function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  // Fill the form with existing data
  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = Math.abs(transaction.amount);
  document.getElementById("type").value = transaction.amount >= 0 ? "income" : "expense";
  document.getElementById("category").value = transaction.category;
  document.getElementById("date").value = transaction.date;

  // Mark this transaction as being edited
  editingTransactionId = id;

  // Optional: change button text to indicate editing
  document.querySelector(".form button").textContent = "Update";
}
