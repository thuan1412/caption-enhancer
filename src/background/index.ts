import { sendToContentScript } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

// TODO: pub-sub communication between background and content script
// to tell the background that the content-script is rendered
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes("timedtext") && !details.url.includes("isBot")) {
      setTimeout(() => {
        // query element in the content script
        sendToContentScript({
          name: "timedtextUrl",
          tabId: details.tabId,
          body: {
            url: details.url,
          },
        });
        // wait for the content script to be ready
      }, 2000);
    }
  },
  { urls: ["<all_urls>"] },
);
