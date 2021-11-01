jest.mock('../models/user');
jest.mock('../models/action');
const Action = require('../models/action');
const User = require('../models/user');
const { doneAction } = require('../controllers/actions');

// const { upExpFinOneAction, setActionFinDate } = require('../controllers/actions')

describe('이 파일이 잘 작동하는 지 보기 위한 JS', () => {
  test('Dumi Test', () => {
    expect(1+1).toBe(2);
  });
});

describe('doneAction test', () => {
  const req = {
    body: {
      actionId: 1,
      routineId: 1,
    },
  };
  const res = {
    locals: {
      user: {
        id: 1,
      },
    },
    status: jest.fn(() => res),
    send: jest.fn(),
  };

  // 루틴완료 x 액션완료 일때 경험치 획득 + actionExpGrowth
  const upExpFinOneAction = async (userId) => {
    await Character.update.mockReturnValue(true);
  }

  // 루틴완료 o 액션완료 일때 경험치 획득 + actionExpGrowth + routineExpGrowth
  const upExpAllAction = async (userId) => {
    await Character.update.mockReturnValue(true);
  }

  //액션 완료시 액션에 finDate 업데이트
  const setActionFinDate = async (actionId, finDate) => {
    await Action.update.mockReturnValue(ture);
  }

  //===================================
  
  test('doneAction 액션이 완료되면 경험치를 부여해야 한다.', async () => {
    await Action.findOne.mockReturnValue(true)
    await donAction.setActionFinDate.mockReturnValue(true)
    await Action.findAndCountAll.mockReturnValue(true)
    await donAction.upExpFinOneAction.mockReturnValue(true)
    await doneAction(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith({
      result: "true1",
      msg: 'Action 완료 날짜 표시, 경험치 지급 완료',
    });
  });

  test('액션이 완료되고 그 액션이 마지막 액션이라면, 루틴도 완료시키고 루틴경험치와 액션경험치를 줘여한다.', () => {

  });

  test('유저정보와 맞지 않은 액션이 들어온 경우',() =>{

  })

});
