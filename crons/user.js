const cron = require('node-cron');
const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

const destroyUser = () => {
  cron.schedule('0 */1 * * *', function () {
    User.destroy({
      where: {
        deletedAt: {
          [Op.not]: null
        }
      },
      force: true
    });
    console.log('한 시간 마다 작업 실행 :', new Date().toString());
  });
}

module.exports = {
  destroyUser,
};