import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const url = `http://localhost:5000/${req.file.filename}`;
  res.json({ url });
});

app.post("/analyze", (req, res) => {
  // 模擬分析
  const fakeResult = "🍎 這是一個蘋果，約 95 卡路里，含有 0.3g 脂肪、25g 碳水化合物、0.5g 蛋白質。";
  res.json({ analysis: fakeResult });
});

app.post("/chat", (req, res) => {
  const userMsg = req.body.message;
  const reply = `你問的「${userMsg}」，這部分的營養建議是每天攝取不超過 10% 的熱量來自糖分。`;
  res.json({ reply });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
