const today = new Date();
const date = {
  year : today.getFullYear(), // 년도
  month : today.getMonth(), // 월
  day : today.getDate(),  // 날짜
}

module.exports = date;