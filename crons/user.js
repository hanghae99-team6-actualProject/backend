const cron = require('node-cron');
const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

const destroyUser = () => {
  cron.schedule('* * * * *', function () {
    User.destroy({
      where: {
        deletedAt: {
          [Op.not]: null
        }
      },
      force: true
    });
    console.log('매 분 마다 작업 실행 :', new Date().toString());
  });
}

module.exports = {
  destroyUser,
};