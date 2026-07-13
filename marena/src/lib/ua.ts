// Rozbor User-Agent na serveru — zařízení, OS, prohlížeč a hlavně jestli je to
// bot / AI crawler. Používá se u příjmu analytiky (odlišit lidi od robotů).

export interface UAInfo {
  device: "mobil" | "tablet" | "desktop";
  os: string;
  browser: string;
  bot: boolean;
  botName?: string;
}

// Známí boti a AI crawleři (pořadí = od nejkonkrétnějšího). Poslední řádek chytá
// cokoli s „bot/crawler/spider/headless" v UA.
const BOTS: [RegExp, string][] = [
  [/GPTBot/i, "GPTBot (OpenAI)"],
  [/OAI-SearchBot/i, "OpenAI Search"],
  [/ChatGPT-User/i, "ChatGPT"],
  [/ClaudeBot|Claude-Web|anthropic-ai|anthropic/i, "ClaudeBot (Anthropic)"],
  [/CCBot/i, "CCBot (Common Crawl)"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Google-Extended/i, "Google-Extended (AI)"],
  [/Googlebot|Google-InspectionTool|Storebot-Google/i, "Googlebot"],
  [/bingbot|BingPreview/i, "Bingbot"],
  [/Applebot/i, "Applebot"],
  [/YandexBot/i, "YandexBot"],
  [/facebookexternalhit|facebookcatalog|facebot/i, "Facebook"],
  [/Twitterbot/i, "Twitterbot"],
  [/Slackbot/i, "Slackbot"],
  [/WhatsApp/i, "WhatsApp náhled"],
  [/TelegramBot/i, "Telegram"],
  [/Discordbot/i, "Discord"],
  [/DuckDuckBot/i, "DuckDuckGo"],
  [/SemrushBot|AhrefsBot|DotBot|MJ12bot|PetalBot|DataForSeoBot|Bytespider/i, "SEO/scrape crawler"],
  [/bot\b|crawler|spider|crawling|headless|python-requests|curl\/|wget\//i, "Ostatní bot"],
];

export function parseUA(uaRaw: string | null | undefined): UAInfo {
  const ua = uaRaw || "";
  let bot = false;
  let botName: string | undefined;
  for (const [re, name] of BOTS) {
    if (re.test(ua)) {
      bot = true;
      botName = name;
      break;
    }
  }

  const isTablet = /iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = /iPhone|iPod|Android.*Mobile|Windows Phone|Mobile Safari/i.test(ua);
  const device = isTablet ? "tablet" : isMobile ? "mobil" : "desktop";

  let os = "ostatní";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "ostatní";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/CriOS/i.test(ua)) browser = "Chrome (iOS)";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
  else if (/FxiOS/i.test(ua) || /Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  return { device, os, browser, bot, botName };
}
