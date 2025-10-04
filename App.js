import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [page, setPage] = useState("home"); // home, analyze, chat
  const [imageUrl, setImageUrl] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:5000/upload", formData);
    setImageUrl(res.data.url);
    setPage("analyze");
  };

  const handleAnalyze = async () => {
    const res = await axios.post("http://localhost:5000/analyze", { url: imageUrl });
    setChat([{ role: "system", content: res.data.analysis }]);
    setPage("chat");
  };

  const handleChat = async () => {
    const res = await axios.post("http://localhost:5000/chat", { message: input });
    setChat([...chat, { role: "user", content: input }, { role: "system", content: res.data.reply }]);
    setInput("");
  };

  return (
    <div className="p-4">
      {page === "home" && (
        <div>
          <h1>食物營養分析</h1>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>上傳檔案</button>
        </div>
      )}

      {page === "analyze" && (
        <div>
          <h2>分析這張照片？</h2>
          <img src={imageUrl} alt="preview" style={{ maxWidth: "300px" }} />
          <button onClick={handleAnalyze}>確定</button>
        </div>
      )}

      {page === "chat" && (
        <div>
          <h2>營養分析結果</h2>
          <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto", padding: "8px" }}>
            {chat.map((c, i) => (
              <p key={i}><b>{c.role}:</b> {c.content}</p>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="繼續詢問..."
          />
          <button onClick={handleChat}>送出</button>
        </div>
      )}
    </div>
  );
}
