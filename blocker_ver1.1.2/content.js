// content.js

// ページ上のwindow.openを無効化（新規ウィンドウやタブを開けなくする）
Object.defineProperty(window, 'open', {
  writable: false,
  configurable: false,
  value: function() {
    console.log("window.open blocked by extension");
    return null;
  }
});

// 既存のコードも入れる場合は続けて
chrome.runtime.sendMessage({ type: "pageVisit", url: location.href });

