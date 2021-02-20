// Sorting the table
function sortTableByColumn(table, column, asc=true) {
  const dirModifier = asc ? 1 : -1
  const tBody = table.tBodies[0]
  const rows = Array.from(tBody.querySelectorAll('tr'))

  // Classificando cada linha

  const sortedRows = rows.sort((x,y) => {
    const xColText = x.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim()
    const yColText = y.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim()

    return xColText > yColText ? (1 * dirModifier) : (-1 * dirModifier)
  })

  // Remove todas as trs da tabela
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild)
  }

  // Adiciona as trs recém classificadas
  tBody.append(...sortedRows)

  //Mostra como a coluna está atualmente classificada
  table.querySelectorAll('th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'));
  table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle('th-sort-asc', asc)
  table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle('th-sort-desc', !asc)
}

function tableOrganized() {
  document.querySelectorAll('.data-table th').forEach(headerCell => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement
      //const headerIn = headerCell.parentElement.children
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell)
      const currentIsAscending = headerCell.classList.contains('th-sort-asc')

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending)
    })
  })
}

// Open and Close Modal
function openAndCloseModal() {
  const modalOverlay = document.querySelector('.modal-overlay')
  const mainBlur = document.getElementById('blur')
  
  const btnOpenModal = document.getElementById('btn-modal')
  btnOpenModal.onclick = function() {
    modalOverlay.classList.add('active')
    mainBlur.classList.add('active')
  }

  const btnCloseModal = document.getElementById('closeModal')
  btnCloseModal.onclick = function() {
    modalOverlay.classList.remove('active')
    mainBlur.classList.remove('active')
  }

  document.addEventListener('keydown', function(event) {
    const isEscKey = event.key === 'Escape'
    if(isEscKey) {
      modalOverlay.classList.remove('active')
      mainBlur.classList.remove('active')
    }
  })
}

tableOrganized()
openAndCloseModal()
