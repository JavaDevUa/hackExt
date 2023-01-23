#!/usr/bin/python

import sys
import struct
import json

basePath = '/home/pros/.1_Programming/JavaProjectTemplate/' # this is project generated with gradle init command

print('------------------------------------XXXXXXXXXXXXXXXXXXXXXXXXXXX---------------------------------------', file=sys.stderr)
#read msg
rawLength = sys.stdin.buffer.read(4)
messageLength = struct.unpack("@I", rawLength)[0]
message = sys.stdin.buffer.read(messageLength).decode("utf-8")
print('message: ' + message, file=sys.stderr)
# example how it looks like: {"snippet":"[{\"fileName\":\"bla.java\",\"code\":\"abc();\\ndef()\\n\"},{\"fileName\":\"def.java\",\"code\":\"second\\ncode\\n\"}]"}

messageJson = json.loads(message)
snippetValue = messageJson["snippet"] #this will get part starting from [{"fileName"}]
codeBlocksJson = json.loads(snippetValue) #this is to parse the value, to parse the array, its json itself

for item in codeBlocksJson:
    fn = item['fileName']
    cd = item['code']
    cd = cd.replace('\u00a0', '')
    cd = cd.replace('\u200b', '\n')
    fullPath = basePath + fn
    writer = open(fullPath, "w")
    writer.write(cd)
    writer.close()

print('END_OF_FILE', file=sys.stderr)
