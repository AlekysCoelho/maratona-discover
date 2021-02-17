function sortTableByColumn(table, column, asc=true) {
  const dirModifier = asc ? 1 : -1
  const tBody = table.tBodies[0]
  const rows = Array.from(tBody.querySectorAll('tr'))

  // Classificando cada linha

  const sortedRows = rows.sort((x,y) => {
    const xColText = x.querySector(`td:nth-child(${ column + 1 })`).textContent.trim()
    const yColText = y.querySector(`td:nth-child(${ column + 1 })`).textContent.trim()

    return xColText > yColText ? (1 * dirModifier) : (-1 * dirModifier)
  })

  // Remove todas as trs da tabela
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild)
  }

  // Adiciona as trs recém classificadas
  tBody.append(...sortedRows)

  //Mostra como a coluna está atualmente classificada
  table.querySectorAll('th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'));
  table.querySector(`th:nth-child(${ column + 1 })`).classList.toggle('th-sort-asc', asc)
  table.querySector(`th:nth-child(${ column + 1 })`).classList.toggle('th-sort-desc', !asc)
}

