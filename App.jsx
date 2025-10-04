import React, { useState } from "react";
import axios from "axios";
// 引入 Font Awesome CDN 提供的圖示 (假設專案環境已設定)
// 為了美觀，這裡加入 Tailwind CSS 類別，使 UI 更加現代化和響應式。

export default function App() {
  // 將 file 狀態移除，改為直接在 handleUpload 處理檔案
  const [page, setPage] = useState("home"); // home, analyze, chat
  const [imageUrl, setImageUrl] = useState("");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 新增載入狀態

  /**
   * 處理檔案上傳（適用於拍照或選擇檔案）
   * @param {File} fileToUpload - 要上傳的檔案物件
   */
  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      // 確保您的 Node.js/Express 伺服器正在 http://localhost:5000 運行
      const res = await axios.post("http://localhost:5000/upload", formData);
      
      // 上傳成功，設定圖片 URL 並切換到分析頁面
      setImageUrl(res.data.url);
      setPage("analyze");
    } catch (error) {
      console.error("上傳失敗:", error);
      alert("上傳失敗，請檢查後端伺服器是否運行於 http://localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/analyze", { url: imageUrl });
      setChat([{ 
        role: "system", 
        content: res.data.analysis || "系統未能提供分析結果，請重試或聯繫管理員。" 
      }]);
      setPage("chat");
    } catch (error) {
      console.error("分析失敗:", error);
      alert("分析失敗，請檢查伺服器或 API 連線。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setChat(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", { message: userMessage });
      setChat(prev => [...prev, { role: "system", content: res.data.reply }]);
    } catch (error) {
      console.error("聊天請求失敗:", error);
      setChat(prev => [...prev, { role: "system", content: "對話服務目前無法連線，請稍後再試。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // UI 樣式：使用 Tailwind CSS 模擬 ai_test.html 的設計風格
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-start pt-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 relative">
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
            <div className="text-xl font-semibold text-gray-700">載入中...</div>
          </div>
        )}

        {/* Home Page: 拍照與上傳按鈕 */}
        {page === "home" && (
          <div className="text-center space-y-8 py-10">
            <h1 className="text-3xl font-extrabold text-gray-800">食物追蹤儀表板</h1>
            <p className="text-gray-500">請拍照或選擇圖片，開始分析食物營養素。</p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
              
              {/* 拍照按鈕 (使用相機) */}
              <label htmlFor="camera-input" className="cursor-pointer flex-1">
                <div className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-xl shadow-lg transition duration-200 transform hover:scale-105">
                  <i className="fas fa-camera text-4xl mb-2"></i>
                  <div className="font-semibold text-lg">拍照</div>
                </div>
              </label>
              <input 
                type="file" 
                id="camera-input"
                accept="image/*" 
                // capture="environment" 呼叫後置鏡頭，更適合食物照片
                capture="environment" 
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
                className="hidden" 
              />

              {/* 上傳檔案按鈕 (選擇圖庫) */}
              <label htmlFor="file-input" className="cursor-pointer flex-1">
                <div className="bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-xl shadow-lg transition duration-200 transform hover:scale-105">
                  <i className="fas fa-upload text-4xl mb-2"></i>
                  <div className="font-semibold text-lg">上傳檔案</div>
                </div>
              </label>
              <input 
                type="file" 
                id="file-input"
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
                className="hidden" 
              />
              {/* 移除原本不使用的 setFile 狀態和舊的 handleUpload 呼叫 */}
            </div>
          </div>
        )}

        {/* Analyze Page: 確認分析 */}
        {page === "analyze" && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">分析這張照片？</h2>
            <img 
              src={imageUrl} 
              alt="待分析預覽圖" 
              className="mx-auto w-full max-w-sm rounded-lg shadow-md border-4 border-gray-200"
            />
            <div className="flex justify-center gap-4 pt-4">
                <button 
                    onClick={() => setPage("home")} 
                    className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-150 shadow-md"
                >
                    <i className="fas fa-arrow-left mr-2"></i>重選/重拍
                </button>
                <button 
                    onClick={handleAnalyze} 
                    className="py-2 px-6 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-150 shadow-md"
                >
                    確定分析<i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
          </div>
        )}

        {/* Chat Page: 營養分析結果與對話 */}
        {page === "chat" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">營養分析結果</h2>
            
            {/* 對話框 */}
            <div className="border border-gray-300 bg-gray-50 h-80 overflow-y-auto p-4 rounded-lg space-y-3">
              {chat.length === 0 ? (
                <p className="text-gray-500 italic">開始分析以查看結果...</p>
              ) : (
                chat.map((c, i) => (
                  <div key={i} className={`p-3 rounded-lg max-w-xs sm:max-w-md ${c.role === 'user' ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-200 mr-auto text-left'}`}>
                    <b className="capitalize text-xs text-gray-600">{c.role === 'system' ? 'AI 助手' : '你'}</b>
                    <p className="text-gray-800 mt-1 break-words">{c.content}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* 輸入框與按鈕 */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleChat(); }}
                placeholder="繼續詢問營養問題..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleChat}
                className="bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-150"
                disabled={isLoading}
              >
                送出
              </button>
            </div>
            
            <button 
                onClick={() => setPage("home")} 
                className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
            >
                <i className="fas fa-redo mr-2"></i>開始新的分析
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
