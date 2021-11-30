const cron = require('node-cron');
const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

function timeSet() {
  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth(); // 월
  const date = today.getDate(); // 날짜
  const fromMonthAgo = new Date(year, month - 1, date, 0, 0, 0);

  return { today, fromMonthAgo };
}

const destroyUser = () => {
  cron.schedule('0 0 * * *', function () {
    try {
      const { fromMonthAgo, today } = timeSet();
      User.destroy({
        where: {
          deletedAt: {
            [Op.not]: null,
            [Op.notBetween]: [fromMonthAgo, today],
          }
        },
        force: true
      });
      logger.info('매일 자정마다 실행 :', new Date().toString());
    } catch (error) {
      logger.info(error);
    }
  });
}

module.exports = {
  destroyUser,
};