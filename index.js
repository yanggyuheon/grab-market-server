var http = require("http"); // 모듈불러올 때 require
var hostname = "127.0.0.1"; // 127. ~ : 내 컴퓨터 주소
var port = 8080;

const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;

  if (path === "/products") {
    if (method === "GET") {
      // 객체 배열 보내줘야 할 때, writeHead
      res.writeHead(200, { "Content-Type": "application/json" });

      // end : string 형태여야 해서, 배열 > string 바꿔주는 JSON.stringify 사용
      const products = res.end(
        JSON.stringify([
          {
            name: "농구공",
            price: 5000,
          },
        ])
      );
      res.end(products);
    } // post는 보통 상품 생성할 때
    else if (method === "POST") {
      res.end("생성되었습니다.");
    }
  }

  res.end("Good Bye");
});

server.listen(port, hostname); // listen : 기다리고 있는 것

console.log("grab market server on!");
