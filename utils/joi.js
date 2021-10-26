const joi = require('joi');

const emailFilter = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; // 이메일 정규식
const pwFilter = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/; //8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.

const userValidation = joi.object({
  email: joi.string().min(5).max(20).pattern(new RegExp(emailFilter)).required()
    .error(new Error('아이디는 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.')),
  pw: joi.string().min(8).max(16).pattern(new RegExp(pwFilter)).required()
    .error(new Error('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.')),
  pwCheck: joi.equal(joi.ref('pw'))
    .error(new Error('비밀번호가 일치하지 않습니다.')),
  nickname: joi.string().min(1).required(),
});

module.exports = userValidation;