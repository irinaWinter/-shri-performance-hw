const createTwoCollsTable = (data, caption) => {
  const table = document.createElement('table');
  table.classList.add('table');

  if (caption) {
    let tableCaption = table.createCaption();
    tableCaption.textContent = caption;
  }

  const headerText = ['metrics', 'value'];
  const headerRow = table.insertRow(0);

  headerText.forEach((item, i) => {
    var newCell = headerRow.insertCell(i);

    var newText = document.createTextNode(item);
    newCell.appendChild(newText);
  });

  Object.keys(data).forEach((key) => {
    let row = table.insertRow();

    var newCell = row.insertCell(0);

    var newText = document.createTextNode(key);
    newCell.appendChild(newText);

    var newCellValue = row.insertCell(1);

    var newTextValue = document.createTextNode(data[key]);
    newCellValue.appendChild(newTextValue);
  });

  document.querySelector('.container').appendChild(table);
};

const createTable = (data, caption) => {
  const table = document.createElement('table');
  table.classList.add('table');

  if (caption) {
    let tableCaption = table.createCaption();
    tableCaption.textContent = caption;
  }

  const headerRow = table.insertRow(0);
  let firstCell;

  Object.keys(data[Object.keys(data)[0]]).forEach((item, i) => {
    if (!firstCell) {
      firstCell = headerRow.insertCell();
    }
    var newCell = headerRow.insertCell(i + 1);

    var newText = document.createTextNode(item);
    newCell.appendChild(newText);
  });

  Object.keys(data).forEach((key) => {
    let row = table.insertRow();

    var newCell = row.insertCell(row);

    var newText = document.createTextNode(key);
    newCell.appendChild(newText);

    Object.keys(data[key]).forEach((item, i) => {
      var newCell = row.insertCell(i + 1);

      var newText = document.createTextNode(data[key][item]);
      newCell.appendChild(newText);
    });
  });

  document.querySelector('.container').appendChild(table);
};
