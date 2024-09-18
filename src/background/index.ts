import { sendToContentScript } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes("timedtext") && !details.url.includes("isBot")) {
      sendToContentScript({
        name: "timedtextUrl",
        tabId: details.tabId,
        body: {
          url: details.url
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);
