const FILTER_SOURCES = [
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/ads.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
  'https://easylist.to/easylist/easylist.txt'
];

// --- YouTube広告ルール（手動） ---
const baseRules = [
  { id: 9001, priority: 2, action: { type: "block" },
    condition: { urlFilter: "*youtube.com/api/stats/ads*", resourceTypes: ["xmlhttprequest"] }},
  { id: 9002, priority: 2, action: { type: "block" },
    condition: { urlFilter: "*googlevideo.com/videoplayback*", resourceTypes: ["xmlhttprequest"] }},
  { id: 9003, priority: 2, action: { type: "block" },
    condition: { urlFilter: "*doubleclick.net/*", resourceTypes: ["xmlhttprequest", "script"] }},
  { id: 9004, priority: 2, action: { type: "block" },
    condition: { urlFilter: "*pagead2.googlesyndication.com/*", resourceTypes: ["script", "xmlhttprequest"] }},
  { id: 9005, priority: 2, action: { type: "block" },
    condition: { urlFilter: "*youtube.com/get_midroll_ad*", resourceTypes: ["xmlhttprequest"] }}
];

function abpToRule(line, id) {
  // ||example.com^ or ||example.com/path^
  const match = line.match(/^\|\|([^\^]+)\^/);
  if (!match) return null;
  const pattern = match[1];
  return {
    id,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `*://${pattern}*`,
      resourceTypes: ['script', 'xmlhttprequest', 'image']
    }
  };
}

async function fetchFilterRules(startId = 10000) {
  let rules = [];
  let ruleId = startId;

  for (const url of FILTER_SOURCES) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split('\n');

      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('!') || line.startsWith('@@')) continue;
        const rule = abpToRule(line, ruleId);
        if (rule) {
          rules.push(rule);
          ruleId++;
          if (rules.length >= 4000) break; // 上限対策
        }
      }
    } catch (e) {
      console.warn(`⚠️ Fetch failed for ${url}`, e);
    }
    if (rules.length >= 4000) break;
  }

  return rules;
}

async function updateRules() {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = existing.map(r => r.id);
    if (removeIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds
      });
    }

    const fetched = await fetchFilterRules();
    const all = [...baseRules, ...fetched];

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: all
    });

    console.log(`✅ Rules applied: base=${baseRules.length}, fetched=${fetched.length}`);
  } catch (e) {
    console.error("❌ Failed to apply rules:", e);
  }
}

chrome.runtime.onInstalled.addListener(updateRules);
chrome.runtime.onStartup.addListener(updateRules);
