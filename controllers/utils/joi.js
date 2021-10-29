const joi = require('joi');

const emailFilter = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; // 이메일 정규식
const pwFilter = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/; //8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.

const userValidation = joi.object({
  userEmail: joi.string().min(3).pattern(new RegExp(emailFilter)).required()
    .error(new Error('아이디는 이메일 형식입니다.')),
  userPw: joi.string().min(8).max(16).pattern(new RegExp(pwFilter)).required()
    .error(new Error('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.')),
  userPwChk: joi.equal(joi.ref('userPw'))
    .error(new Error('비밀번호가 일치하지 않습니다.')),
  nickName: joi.string().min(1).required()
    .error(new Error('닉네임을 입력해주세요')),
});

module.exports = userValidation;