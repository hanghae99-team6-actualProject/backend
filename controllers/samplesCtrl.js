exports.sampleFn = async(req, res) => {
  
  console.log("sample router 진입");

  res.send({ msg: 'sample router에서 보낸 msg' });
};