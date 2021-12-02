// //let characterFool = ['1', '2', '3'];
// let crtFool = ['1', '2', '3'];

const { compareSync } = require('bcrypt');
const { calendarFormat } = require('moment');

// //let result = characterFool[Math.floor(Math.random()*characterFool.length)];
// let newcrtInfo1 = [Math.floor(Math.random()*crtFool.length)]; // = 인덱스 출력
// let newcrtInfo = crtFool[Math.floor(Math.random()*crtFool.length)]; // 인덱스를 fool에 적용시켜서 값을 출력

// //console.log(result);
// console.log(newcrtInfo1);
// console.log(newcrtInfo);

// crtPreSetList = ['asd', '라이언', '어피치'];
// collcetionMaxCrt = ['라이언'];

// // collcetionMaxCrt.sort();
// // crtPreSetList.sort();
// // let notCollection = []
// // for(let i=0; i<crtPreSetList.length; i++){
// //   if( collcetionMaxCrt[i] !== crtPreSetList[i]){
// //     console.log(crtPreSetList[i], "비교1");
// //     console.log(collcetionMaxCrt[i], "비교2");

// //     notCollection.push(crtPreSetList[i]);
// //     console.log(notCollection);
// //   }
// // };

// let result = crtPreSetList.filter(x => !collcetionMaxCrt.includes(x));
// console.log(result);

// //인덱스뽑아오기
// const asdqwe = '어피치';
// const targetIndex = crtPreSetList.indexOf(asdqwe, 1);
// console.log(targetIndex);

// let a = 1;
// let b = 4;
// let result;

// cal(a, b, result);

// console.log(result);

// function cal(val1, val2, r) {
//   r = val1 + val2;
//   console.log(r);
//   result = r
//   return;
// };


// const moment = require('moment');
// require('moment-timezone');

// moment.tz.setDefault("Asia/Seoul");
// console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

var a = {
  chatNum: '3',
  '닉네임1_www.img.com_2021-12-01 21:04:58_1': '테스트 1',
  '닉네임1_www.img.com_2021-12-01 21:05:21_2': '테스트 2',
  '닉네임1_www.img.com_2021-12-01 21:05:21_3': '테스트 3',
  '닉네임1_www.img.com_2021-12-01 21:05:21_4': '테스트 4',
  '닉네임1_www.img.com_2021-12-01 21:05:21_5': '테스트 5',
  '닉네임1_www.img.com_2021-12-01 21:05:21_6': '테스트 6',
  '닉네임1_www.img.com_2021-12-01 21:05:21_7': '테스트 7',
  '닉네임1_www.img.com_2021-12-01 21:05:21_8': '테스트 8',
  '닉네임1_www.img.com_2021-12-01 21:05:21_9': '테스트 9',
  '닉네임1_www.img.com_2021-12-01 21:05:24_10': '테스트 10'
}

let resultss = Object.entries(a).map((element )=> {
  const key = element[0].split('_');
  const value = element[1];
  return { id: key[3], nickName: key[0], url: key[1], createAt: key[2], contents: value}
});

console.log(resultss);
