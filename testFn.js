// //let characterFool = ['1', '2', '3'];
// let crtFool = ['1', '2', '3'];

// //let result = characterFool[Math.floor(Math.random()*characterFool.length)];
// let newcrtInfo1 = [Math.floor(Math.random()*crtFool.length)]; // = 인덱스 출력
// let newcrtInfo = crtFool[Math.floor(Math.random()*crtFool.length)]; // 인덱스를 fool에 적용시켜서 값을 출력

// //console.log(result);
// console.log(newcrtInfo1);
// console.log(newcrtInfo);


crtPreSetList = ['1', '2', '3'];
collcetionMaxCrt = ['3'];

// collcetionMaxCrt.sort();
// crtPreSetList.sort();
// let notCollection = []
// for(let i=0; i<crtPreSetList.length; i++){
//   if( collcetionMaxCrt[i] !== crtPreSetList[i]){
//     console.log(crtPreSetList[i], "비교1");
//     console.log(collcetionMaxCrt[i], "비교2");

//     notCollection.push(crtPreSetList[i]);
//     console.log(notCollection);
//   }
// };

let result = crtPreSetList.filter(x => !collcetionMaxCrt.includes(x));
console.log(result);