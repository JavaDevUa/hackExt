try {

chrome.runtime.onInstalled.addListener(() => {
    console.log("onInstalled")
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("MSG received at background")
    console.log(request)

    //here I need to send nativeMessage of above request

    console.log("BEFORE_SENDING_NETIVE")
    let port = chrome.runtime.connectNative("ping");
    // port.postMessage("ping_bla_bla");
    port.postMessage(request);
    console.log("AFTER_SENT_NATIVE")


    sendResponse({ title: 'MY ARGUMENT' });
});




chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log("onUpdated")
    if(changeInfo.status == 'complete'){
        //if (changeInfo.url) {
        chrome.scripting.executeScript({
            files: ['contentScript.js'],
            target: {tabId: tab.id}
        });
        //}
    }
});

} catch (e) {
	console.log("EXCPETION CAUGHT")
	console.log(e)
}
