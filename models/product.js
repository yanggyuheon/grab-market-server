// 여기 만든 파일을 sequelize가 읽어서 DB에게 명령
module.exports = function (sequelize, DataTypes) {
  // Product 테이블 없으면 생성
  const product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(20), // 글자 길이 20까지 제한
      allowNull: false, // Null 허용x
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    soldout: {
      type: DataTypes.INTEGER(1), // sqlite : boolean 지원 X
      allowNull: false,
      defaultValue: 0, // 기본값 설정
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  });
  return product;
};
