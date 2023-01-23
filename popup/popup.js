console.log("This is a popup!")

const dropDown = document.getElementById("dropDown");
var snipAmount = chrome.storage.local.get("snip_amount")
snipAmount.then((res) => {
    snipAmt = res["snip_amount"]
    for (let i = 1; i <= snipAmt; i++) {
        let option = document.createElement("option");
        option.setAttribute('value', i);
        let optionText = document.createTextNode(i);
        option.appendChild(optionText);
        dropDown.appendChild(option);
    }
});

var testSnip = chrome.storage.local.get("snip1")
testSnip.then((res) => {
    var snip = res["snip1"]
    console.log("POPUP: " + snip)
    var obj = JSON.parse(snip);
    var fn = obj[0].fileName;
    console.log("FN: " + fn)
});


document.getElementById("signInButton").onclick = function() {
    var snippetNumber = dropDown.value
    var name = "snip" + snippetNumber
    var testSnip = chrome.storage.local.get(name)
    testSnip.then((res) => {
        var snip = res["snip" + snippetNumber]

        let vv = chrome.runtime.sendMessage({ "snippet": snip}, (response) => {
            console.log("This is from response at popup!" + response.title)
        });
    });


    // let vv = chrome.runtime.sendMessage({ codeSnippet: 'bar'}, (response) => {
    //     console.log("This is from response at popup!" + response.title)
    // });

}


// var testSnip = chrome.storage.local.get("test")
// testSnip.then((res) => {
//     var snip = res["test"]
//     console.log("POPUP_SOUTH_PARTH: " + snip)
    // var obj = JSON.parse(snip);
    // var fn = obj[0].fileName;
    // console.log("FN: " + fn)
// });









// document.getElementById("signInButton").onclick = function() {
//
// var x = chrome.storage.local.get("prosmsg")
//
// x.then((res) => {
//     console.log('HHH');
// 	console.log(res) //this is to implement some code when value from storage is received
//
// });



//    console.log('Sending');
	//
	//
	//

    // let vv = chrome.runtime.sendMessage({ foo: 'bar'})
//    let vv = chrome.runtime.sendMessage({ foo: 'bar'}, (response) => {
//        console.log("This is from response at popup!" + response.title)
//    });




    // chrome.runtime.sendMessage({
    //     // console.log("SENTTTT")
    //     contentScriptQuery: "userLogin",
    //     url: 'https://jsonplaceholder.typicode.com/todos/1'
    // }, function(response) {
    //     console.log(response);
    // });
// }


