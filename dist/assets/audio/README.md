# 音效資料夾

`applause/` 內目前有三個由教師提供的 MP3 檔案：

- `applause-01.mp3` ← `freesound_community-applause-75314.mp3`
- `applause-02.mp3` ← `pwlpl-applause-sound-effect-521104.mp3`
- `applause-03.mp3` ← `driken5482-applause-cheer-236786.mp3`

網站會隨機選擇其中一個。熱烈歡呼使用不同播放速度和勝利提示音形成三種變化；語音鼓勵由瀏覽器的繁體中文語音合成功能產生。

## 增加鼓掌聲

1. 把 MP3 或 WAV 放進 `assets/audio/applause/`。
2. 使用不含空格的英文檔名，例如 `applause-04.mp3`。
3. 在 `sound-manager.js` 最上方的 `applauseFiles` 陣列加入路徑。
4. 重新整理網站並在「音效台」試播。

公開發布前，請教師確認每個外部音效檔的授權與標示條件。本專案只保留使用者提供的檔案，不推定其授權。
