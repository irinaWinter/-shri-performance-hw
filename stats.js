function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  } else {
    return Math.floor(sorted[base]);
  }
}

function prepareData(result) {
  return result.data.map((item) => {
    item.date = item.timestamp.split('T')[0];

    return item;
  });
}

// TODO: реализовать
// показать значение метрики за несколько дней
function showMetricByPeriod() {}

// показать сессию пользователя
function showSession() {}

// сравнить метрику в разных срезах
function compareMetric() {}

// любые другие сценарии, которые считаете полезными

// Пример
// добавить метрику за выбранный день
function addMetricByDate(data, page, name, date) {
  let sampleData = data
    .filter(
      (item) => item.page == page && item.name == name && item.date == date
    )
    .map((item) => item.value);

  let result = {};

  result.hits = sampleData.length;
  result.p25 = quantile(sampleData, 0.25);
  result.p50 = quantile(sampleData, 0.5);
  result.p75 = quantile(sampleData, 0.75);
  result.p95 = quantile(sampleData, 0.95);

  return result;
}
// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
  console.log(`All metrics for ${date}:`);

  let table = {};
  // table.connect_ = addMetricByDate(data, page, 'connect_', date);
  table.ttfb = addMetricByDate(data, page, 'ttfb', date);
  // table.load = addMetricByDate(data, page, 'load', date);
  table.productList = addMetricByDate(data, page, 'productList', date);
  table.pageLoadTime_ = addMetricByDate(data, page, 'pageLoadTime_', date);
  // table.load = addMetricByDate(data, page, 'load', date);
  // table.generate = addMetricByDate(data, page, 'generate', date);
  // table.draw = addMetricByDate(data, page, 'draw', date);
  // table.domComplete3 = addMetricByDate(data, page, 'domComplete3', date);
  // table.domComplete_ = addMetricByDate(data, page, 'domComplete_', date);
  // table.domLoading_ = addMetricByDate(data, page, 'domLoading_', date);

  console.table(table);
}

fetch(
  'https://shri.yandex/hw/stat/data?counterId=00a7307d-de23-42c9-a8d5-b93199dcdb3e'
)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result);

    calcMetricsByDate(data, 'Store', '2021-10-27');

    // добавить свои сценарии, реализовать функции выше
  });
