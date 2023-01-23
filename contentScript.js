console.log("MY SRC WOrkED")

class Line
{
    constructor(lineNumber, lineText) {
        this.lineNumber = lineNumber
        this.lineText = lineText
    }
}

class CodeBlock
{
    constructor() {
        // this.fileName = fileName
        // this.startInd = startInd
        // this.endInd = endInd
    }
}

class CodeSnippet
{
    constructor() {
        this.codeBlocks = new Array()
        //startInd -< of the snippert
        //endInd -< end of snippet line
        //id = snippetNumber (by order)
    }

}

function parseHackMdDivLineWrapperElement(highLineDivWrapper)     //returns
{
    let amountChildNodes = highLineDivWrapper.childNodes.length //active line has 4, regular 2, that's why parsing is different
    if (amountChildNodes == 4) //selected line, 1st line usually
    {
        var preEl = highLineDivWrapper.childNodes[3]
        var lineSpanEl = preEl.childNodes[0] //0 is hardcoded for hackmd structure
        var lineText = lineSpanEl.textContent

        var lineNumberWrapperDiv = highLineDivWrapper.childNodes[2]    //0 is hardcoded for hackmd strcuture
        var lineNumberDiv = lineNumberWrapperDiv.childNodes[0];    //0 is hardcoded for hackmd structure
        var lineNumber = lineNumberDiv.textContent
    }
    else if (amountChildNodes == 2)
    {
        var preEl = highLineDivWrapper.childNodes[1]   //1 is hardcoded for hackmd structure
        var lineSpanEl = preEl.childNodes[0] //0 is hardcoded for hackmd structure
        var lineText = lineSpanEl.textContent

        var lineNumberWrapperDiv = highLineDivWrapper.childNodes[0]    //0 is hardcoded for hackmd strcuture
        var lineNumberDiv = lineNumberWrapperDiv.childNodes[0];    //0 is hardcoded for hackmd structure
        var lineNumber = lineNumberDiv.textContent
    }
    else { console.log("Strange error happened") }
    return new Line(lineNumber, lineText)
}

function getAllLines() {
    var arrayWrapperForTextArea = document.getElementsByClassName('CodeMirror-code');   //hackmd strucuture, that's class
    var textAreaDiv = arrayWrapperForTextArea[0]    //I initially search for only one element with class name
    var textLines = textAreaDiv.childNodes

    var linesList = new Array()
    for (let i = 0; i < textLines.length - 2; i++)  //I DOESN'T GET ALL LENGTH, tha is WHY '-3'???
    {
        var highLineDivWrapper = textLines[i]   //this is <div> which fully contain line at hackmd
        var myLine = parseHackMdDivLineWrapperElement(highLineDivWrapper)
        linesList.push(myLine)
    }
    return linesList
}

//this gets slice of linesList, and for result to be usable in absolute terms, in needs know offset from 1st line, it's - absoluteStartLineNum
function getCodeBlocksFromLines(linesList, absoluteStartLineNum)
{
    var wasPreviousLineRegularText = true;
    var codeBlocks = new Array()

    for (let i = 0; i < linesList.length; i++)
    {
        var line = linesList[i].lineText;

        if (line.startsWith('```'))
        {
            if (wasPreviousLineRegularText == true)
            {
                wasPreviousLineRegularText = false;
                var start = new CodeBlock()
                start.startInd = i + 1;
                codeBlocks.push(start)
            }
            else
            {
                wasPreviousLineRegularText = true
                var lastCodeBlockEntry = codeBlocks[codeBlocks.length - 1]
                // lastCodeBlockEntry.endInd = i + 1 + absoluteStartLineNum;
                lastCodeBlockEntry.endInd = i + absoluteStartLineNum;

                var codeBlockStartInd = lastCodeBlockEntry.startInd - 2
                var lineTextFileName = linesList[codeBlockStartInd].lineText
                var ind1 = lineTextFileName.indexOf('`');
                var ind2 = lineTextFileName.lastIndexOf('`')
                var fileName = lineTextFileName.substring(ind1+1, ind2)
                lastCodeBlockEntry.fileName = fileName

                lastCodeBlockEntry.startInd = lastCodeBlockEntry.startInd + absoluteStartLineNum;

            }
        }
    }
    return codeBlocks
}

function getCodeSnippetsFromLines(linesList)
{
    var wasPreviousLineAverageText = true;
    var codeSnippets = new Array()

    for (let i = 0; i < linesList.length; i++)
    {
        var line = linesList[i].lineText;

        if (line.startsWith('## Snippet'))
        {
            if (wasPreviousLineAverageText == true)
            {
                wasPreviousLineAverageText = false;
                var start = new CodeSnippet()
                start.startInd = i + 1;

                var ind1 = line.indexOf('t')
                var snippetNumber = line.substring(ind1 + 1, ind1 + 3)
                start.id = snippetNumber

                codeSnippets.push(start)
            }
        }
        else if (line.startsWith('- [End Snippet'))
        {
            wasPreviousLineAverageText = true
            var lastSnippetEntry = codeSnippets[codeSnippets.length - 1]
            lastSnippetEntry.endInd = i + 1;
        }
    }
    initializeCodeSnippetsWithCodeBlocks(linesList, codeSnippets)
    return codeSnippets
}

//it's private function
function initializeCodeSnippetsWithCodeBlocks(linesList, codeSnippets)
{
    for (let i = 0; i < codeSnippets.length; i++)
    {
        var startSnipInd = codeSnippets[i].startInd
        var endSnipInd = codeSnippets[i].endInd
        var partOfLinesList = linesList.slice(startSnipInd, endSnipInd)
        var codeBlocks = getCodeBlocksFromLines(partOfLinesList, startSnipInd)
        codeSnippets[i].codeBlocks = codeBlocks
    }
}

//-------------------------------------------------------------------------------------------------
// ABOVE IS THE PROGRAM, BELOW IS THE EXAMPLE, JUST TO LOG FOR SHOWCASE
var linesList = getAllLines()
var codeSnippets = getCodeSnippetsFromLines(linesList);
var firstCodeSnippet = codeSnippets[0]
var codeSnippetId = firstCodeSnippet.id
var fileNameOfFirstCodeBlock = firstCodeSnippet.codeBlocks[0].fileName
var firstCodeLineOfFirstCodeBlock = linesList[firstCodeSnippet.codeBlocks[0].startInd].lineText

console.log(codeSnippetId) //for sample = 1
console.log(fileNameOfFirstCodeBlock)   //for sample = bla.java
console.log(firstCodeLineOfFirstCodeBlock) // for sample = abc();

var json = JSON.stringify(codeSnippets)
console.log(json)

try
{
    chrome.storage.local.set({"prosmsg": json})
}
catch (e) { console.log(e) }

//Example how to read value
// var read = chrome.storage.local.get("prosmsg")
// read.then((res) => {
//     console.log('HHH');
//     console.log(res) //this is to implement some code when value from storage is received
// })

//now we can go to popup, open in browser, click button and see console that it's read from local storage


//following code writes 'snip_amount' and snippets as json to localstorage. This can be read at popup, this is currently implemented
//go to hackmd page -> instepct popup -> in console will be data read which is written exactly below
try {
    let snippetsAmount = codeSnippets.length
    chrome.storage.local.set({"snip_amount": snippetsAmount})

    var codeSnippetsArray = new Array()
    for (let i = 0; i < codeSnippets.length; i++) {
        var codeSnip = codeSnippets[i];
        var codeBlocks = codeSnip.codeBlocks;
        var allCodeBlocksArray = new Array()
        for (let j = 0; j < codeBlocks.length; j++) {
            var codeBlock = codeBlocks[j]
            var codeBlockStartInd = codeBlock.startInd
            var codeBlockEndInd = codeBlock.endInd
            var codeBlockLines = linesList.slice(codeBlockStartInd, codeBlockEndInd)
            var codeBlockCodeStr = "";
            for (let i = 0; i < codeBlockLines.length; i++) {
                codeBlockCodeStr += codeBlockLines[i].lineText + "\n";
            }
            var codeBlockObj = {fileName: codeBlock.fileName, code: codeBlockCodeStr}
            allCodeBlocksArray.push(codeBlockObj)
        }
        var allCodeBlocksJson = JSON.stringify(allCodeBlocksArray)
        codeSnippetsArray.push(allCodeBlocksJson)
    }

    //at localStorage, for first snippet will be with key 'snip1'.
    for (let i = 0; i < codeSnippetsArray.length; i++) {
        var inc = i+1
        chrome.storage.local.set({["snip" + inc]: codeSnippetsArray[i]})
    }
}
catch (e) { console.log(e) }