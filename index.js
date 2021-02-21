// Sorting the table
function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll('tr'));

  // Classificando cada linha

  const sortedRows = rows.sort((x, y) => {
    const xColText = x
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const yColText = y
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return xColText > yColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove todas as trs da tabela
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Adiciona as trs recém classificadas
  tBody.append(...sortedRows);

  //Mostra como a coluna está atualmente classificada
  table
    .querySelectorAll('th')
    .forEach((th) => th.classList.remove('th-sort-asc', 'th-sort-desc'));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle('th-sort-asc', asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle('th-sort-desc', !asc);
}

function tableOrganized() {
  document.querySelectorAll('.data-table th').forEach((headerCell) => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      //const headerIn = headerCell.parentElement.children
      const headerIndex = Array.prototype.indexOf.call(
        headerCell.parentElement.children,
        headerCell
      );
      const currentIsAscending = headerCell.classList.contains('th-sort-asc');

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });
}

// Open and Close Modal
const OpenAndCloseModal = {
  open() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const mainBlur = document.getElementById('blur');
    const btnOpenModal = document.getElementById('btn-modal');
    btnOpenModal.onclick = function () {
      modalOverlay.classList.add('active');
      mainBlur.classList.add('active');
    };
  },

  close() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const mainBlur = document.getElementById('blur');
    const btnCloseModal = document.getElementById('closeModal');
    btnCloseModal.onclick = function () {
      modalOverlay.classList.remove('active');
      mainBlur.classList.remove('active');
    };
  },

  closeKeydown() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const mainBlur = document.getElementById('blur');
    document.addEventListener('keydown', function (event) {
      const isEscKey = event.key === 'Escape';
      if (isEscKey) {
        modalOverlay.classList.remove('active');
        mainBlur.classList.remove('active');
      }
    });
  },
};



// Local Storage
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },

  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector('.data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
          <i onclick="Transaction.remove(${index})" class="material-icons trash">delete</i>
      </td>
      `;

    return html;
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = '';
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, '')) * 100;

    return value;
  },

  formatDate(date) {
    const splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');

    value = Number(value) / 100;

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos');
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      //Modal.close()
      OpenAndCloseModal.close()
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

tableOrganized();

OpenAndCloseModal.open();

OpenAndCloseModal.closeKeydown();