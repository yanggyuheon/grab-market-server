const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models"); // sequelize init해서 사용 가능, sequelize실행 위해
const multer = require("multer");
const upload = multer({
  // 파일 이름 임의로 지정되지 않고 원래 이름으로 설정되도록
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8080;

app.use(express.json()); // json 형식 데이터 처리할 수 있도록
app.use(cors()); // 모든 브라우저에서 서버로 요청 가능
app.use("/uploads", express.static("uploads")); // 서버에서 파일 보여줄 때 다른 경로 보여줘야 하는데, 같은 경로로 보이게 세팅

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(error);
    });
});

// "/products"라는 경로로 get method요청이 왔을 때 실행
app.get("/products", (req, res) => {
  // DB에 쌓여있는 데이터 조회, 비동기 처리
  models.Product.findAll({
    // 정렬 : 기존에 id순으로 정렬되는데, 생성일 기준 내림차순으로
    order: [["createdAt", "DESC"]],

    // finAll할 때, 어떤 컬럼 가져올지 정하는 것 + 필요한 정보만 보여주도록
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ], // description, update 정보 제외
  })
    .then((result) => {
      console.log("PRODUCTS: ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body; // body의 데이터 담는 부분 req.body로
  const { name, description, price, seller, imageUrl } = body;

  // 방어 코드
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 작성해주세요");
  }

  // Product 테이블에 객체 넣어주기, 비동기 처리
  models.Product.create({
    name, // name: name 과 같이 같으면 그냥 name으로 작성 가능
    price,
    seller,
    description,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 :", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;

  // findAll - 2개 이상의 복수, findOne - 1개 찾을 때
  models.Product.findOne({
    // where 조건문 사용해서 id와 일치하는 정보 불러오기
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("Product :", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다");
    });
});

// upload.single - 이미지 파일 하나만 보내는 경우 / single("") - ( ) 안에 key값 넣어준다
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file; // req.file - 저장된 이미지 정보
  console.log(file);
  res.send({
    imageUrl: file.path, // file.path : 이미지 저장된 위치
  });
});

// 구매하기
app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1, // 어느것을 뭐로 업데이트 할지
    },
    {
      where: {
        id, // 해당 id 변화주기위해
      },
    }
  )
    .then((result) => {
      res.send({
        result: 1,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다");
    });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");

  // DB 동기화 작업
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((error) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
