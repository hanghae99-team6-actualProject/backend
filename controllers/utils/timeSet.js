function timeSet() {
  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth(); // 월
  const date = today.getDate(); // 날짜
  const fromToday = new Date(year, month, date, 0, 0, 0);
  const fromThisMonth = new Date(year, month, day, 1, 0, 0, 0);
  const fromYearAgo = new Date(year - 1, month, day, 0, 0, 0);
  return { fromToday, fromThisMonth, fromYearAgo }
}

module.exports = { timeSet };