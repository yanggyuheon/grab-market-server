const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const fs = require("fs");

module.exports = function detectProduct(url, callback) {
  const image = fs.readFileSync(url); // 동기
  const input = tf.node.decodeImage(image, 3); // 이미지라 tensor3d 형태로

  // 모델 load
  mobilenet.load().then((model) => {
    // classify 함수 통해서 무슨 사물인지 분석
    model.classify(input).then((result) => {
      //   console.log(result);
      callback(result[0].className);
    });
  });
};
