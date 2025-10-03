### 所有頁面

* 主畫面: ai_test.html
* 設定頁: ai_test_settings.html
* css: test.css

---
### 參考
> 多人協作 →
> * https://hackmd.io/@Heidi-Liu/git-workflow
> * https://ithelp.ithome.com.tw/m/articles/10260293
> * https://ithelp.ithome.com.tw/m/articles/10277278

**常見分支策略所需的分支數量**
1. GitHub Flow (最簡潔且推薦給小團隊)
這是一種非常簡單且高效的策略，特別適合小團隊進行快速迭代。
* 長期分支：1 個
  * main (或 master): 作為主要且隨時可部署的程式碼分支。
* 短期分支：根據需求創建
  * Feature Branches (功能分支): 每開發一個新功能、修復一個 Bug，或者做一個獨立的改動，就從 main 分支出去建立一個新的功能分支 (例如：feature/login-page, fix/bug-404)。
  * 數量： 在任何給定的時間點，每個開發者可能會有 1-3 個 活躍的功能分支。所以 3 人團隊可能同時會有 3 到 9 個 短期分支。一旦功能完成並審核通過，這些分支就會被合併回 main 並刪除。
總結來說： 至少 1 個長期分支 (main)，加上多個（通常是 3 到 9 個）活躍的短期功能/修復分支。
2. Git Flow (更嚴謹，適用於有固定發佈週期的產品)
如果你們的產品有比較嚴格的版本發佈週期，可能會考慮使用更複雜的 Git Flow：
* 長期分支：2 個
  * master (或 main): 永遠存放已發佈的穩定版本。
  * develop: 存放最新的開發中程式碼。
* 輔助分支：根據需求創建
  * Feature Branches (功能分支): 從 develop 分支出去開發新功能。
  * Release Branches (發佈分支): 從 develop 分支出去準備發佈新版本。
  * Hotfix Branches (熱修復分支): 從 master 分支出去緊急修復已發佈版本中的 Bug。
總結來說： 至少 2 個長期分支 (master 和 develop)，加上多個短期輔助分支。

---
### 分支建立與合併流程

一、我們的核心原則
1. main 分支永遠是聖經
* main 分支 永遠存放著最穩定、隨時可以上線的程式碼。
* 嚴禁直接在 main 上進行任何開發或提交 (Commit)。

2. 萬事皆分支 (Branch Everything)
* 無論是要開發新功能、修復 Bug、或是優化程式碼，都必須從 main 分支出去建立一個新的功能分支 (Feature Branch)。

二、當你需要開始工作時 (建立分支)
1. 何時需要建立一個新的分支？
當你開始執行以下任何一項任務時，請立即建立一個新分支：
* 開發一個新功能。
* 修復一個 Bug。
* 進行一個獨立的優化或重構。

2. 如何命名你的分支？
請使用有意義的名稱，讓人一看就知道這個分支是做什麼的。

>任務類型	命名格式	範例
新功能	feature/你的功能名稱	feature/user-profile-page
Bug 修復	fix/問題簡述	fix/login-401-error
優化/重構	refactor/簡述內容	refactor/css-cleanup

3. 如何建立分支？
請確保你的本地 main 分支是最新的，然後再切換並建立新的分支。
```
# 步驟 1: 切換回 main 分支
git checkout main

# 步驟 2: 同步最新的程式碼（從 GitHub 拉取）
git pull origin main

# 步驟 3: 建立並切換到新的功能分支 (以新功能為例)
git checkout -b feature/your-new-feature

# 接著，你就可以在這個分支上開始編寫程式碼了
```

三、當你的工作完成時 (合併回歸)
當你在功能分支上的工作完成，並經過本地測試確認沒有問題後，你需要透過 Pull Request (PR) 來請求將你的程式碼合併回 main。

1. 提交程式碼到 GitHub
將你所有的更改推送到 GitHub 上的遠端分支：
```
# 提交你的變更
git add .
git commit -m "feat: 完成使用者註冊邏輯" 

# 將本地分支推送到 GitHub
git push origin feature/your-new-feature
```

2. 建立 Pull Request (PR)
  1. 在 GitHub 頁面上，你會看到提示你建立 Pull Request (PR) 的選項。
  2. 目標 (Target) 必須設定為： main
  3. 標題和描述： 清楚說明你做了什麼、解決了什麼問題，以及你需要審查的重點。
  4. 指派審查者 (Reviewer)： 請指派小組內的其他兩位成員作為你的程式碼審查者。

3. 程式碼審查與合併
這是最關鍵的一步，確保 main 穩定性。
  1. 審查者會仔細檢查你的程式碼，可能會留下問題或建議。
  2. 你需要在你的功能分支上做出修改，並再次推送到 GitHub。
  3. 當且僅當 所有審查者都核准 (Approve) 你的 PR 後，你才能執行 Merge (合併)。
  4. 合併完成後： 務必在 GitHub 上刪除這個短期功能分支，保持倉庫整潔。

四、常見問題與最佳實踐
* 衝突 (Conflict) 怎麼辦？
  * 在合併前，請確保你的功能分支已同步過 main 的最新程式碼。如果發生衝突，請在你的功能分支上解決衝突，然後再重新提交 PR 審查。
* 小步快跑：
  * 盡量將大功能拆分成小分支，每天都進行小的提交，並頻繁地建立 PR。這樣可以減少審查難度，降低合併衝突的機率。
