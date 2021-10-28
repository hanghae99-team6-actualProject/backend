const { User, Sequelize } = require("../models");
const Op = Sequelize.Op;

const userTimer = async (req, res) => {
  console.log("userTimer router 진입");

  try {
    const sql = req.body.sql;
    connection.query(sql, function (err, result) {
      if (err) {
        res.json({
          success: false,
          err: err
        });
      } else {
        res.json({
          success: true,
          msg: 'Delete Success'
        })
      }
    });

  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "유저 스케줄 삭제 중 에러 발생" });
  }
};

module.exports = {
  userTimer,
};
