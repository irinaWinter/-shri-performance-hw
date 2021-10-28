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

// Посчитать количество хитов для платформы
function getHitsForPlatform(data, platform) {
  let sampleData = data
    .filter((item) => item.additional.platform == platform)
    .map((item) => item.value);

  let result = {};

  result.hits = sampleData.length;

  return result;
}

// Добавить метрику по выбранному критерию
function addMetric(
  data,
  page,
  name,
  metrics,
  metricsValue,
  showMetricName = false,
  isAdditional = false
) {
  let sampleData = !isAdditional
    ? data
        .filter(
          (item) =>
            item.page == page &&
            item.name == name &&
            item[metrics] == metricsValue
        )
        .map((item) => item.value)
    : data
        .filter(
          (item) =>
            item.page == page &&
            item.name == name &&
            item.additional[metrics] == metricsValue
        )
        .map((item) => item.value);

  let result = {};

  if (showMetricName) {
    result.metrics = name;
  }

  result.hits = sampleData.length;
  result.p25 = quantile(sampleData, 0.25);
  result.p50 = quantile(sampleData, 0.5);
  result.p75 = quantile(sampleData, 0.75);
  result.p95 = quantile(sampleData, 0.95);

  return result;
}

// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
  const caption = `All metrics for ${date}`;
  console.log(caption);

  let table = {};
  table.connect = addMetric(data, page, 'connect', 'date', date);
  table.ttfb = addMetric(data, page, 'ttfb', 'date', date);
  table.pageLoad = addMetric(data, page, 'pageLoad', 'date', date);
  table.productListLoadTime = addMetric(
    data,
    page,
    'productListLoadTime',
    'date',
    date
  );
  table.lsp = addMetric(data, page, 'lsp', 'date', date);

  console.table(table);
  createTable(table, caption);
}

// показывает значение метрики за несколько дней
function showMetricByPeriod(data, page, name, period) {
  const caption = `All metrics for period ${period[0]} — ${
    period[period.length - 1]
  }`;
  console.log(caption);

  let table = {};

  period.forEach((date) => {
    table[date] = addMetric(data, page, name, 'date', date, true);
  });

  console.table(table);
  createTable(table, caption);
}

// показать сессию пользователя
function showSession(data, requestId) {
  const caption = `All metrics for requestId ${requestId}`;
  console.log(caption);

  let table = {};
  let sampleData = {};
  data
    .filter((item) => item.requestId == requestId)
    .forEach((item) => (sampleData[item.name] = item.value));

  table.connect = sampleData.connect;
  table.ttfb = sampleData.ttfb;
  table.pageLoad = sampleData.pageLoad;
  table.productListLoadTime = sampleData.productListLoadTime;
  table.lsp = sampleData.lsp;

  console.table(table);
  createTwoCollsTable(table, caption);
}

// считает посещения на разных платформах
function getVisitsFromDifferentPlatforms(data) {
  const caption = `Number of visits from different platforms`;
  console.log(caption);
  const platforms = ['desktop', 'touch'];

  let table = {};

  platforms.forEach((platform) => {
    table[platform] = getHitsForPlatform(data, platform);
  });

  console.table(table);
  createTable(table, caption);
}

// сравнить метрику на разных платформах
function showMetricByPlatforms(data, page, name) {
  const caption = `Сomparison of ${name} on different platforms`;
  console.log(caption);

  const platforms = ['desktop', 'touch'];

  let table = {};

  platforms.forEach((platform) => {
    table[platform] = addMetric(
      data,
      page,
      name,
      'platform',
      platform,
      true,
      true
    );
  });

  console.table(table);
  createTable(table, caption);
}

fetch(
  'https://shri.yandex/hw/stat/data?counterId=00a7307d-de23-42c9-a8d5-b93199dcdb3e'
)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result);

    calcMetricsByDate(data, 'Store', '2021-10-28');

    showMetricByPeriod(data, 'Store', 'lsp', [
      '2021-10-27',
      '2021-10-28',
      '2021-10-29',
    ]);

    showSession(data, '421242041184');

    showMetricByPlatforms(data, 'Store', 'productListLoadTime');

    getVisitsFromDifferentPlatforms(data);
  });
