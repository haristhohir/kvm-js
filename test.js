var fs = require("fs")
var kvm = require('./'),
    compress = kvm.compress,
    decompress = kvm.decompress

fs.readFile("./data.json", "utf8", function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);

    msg = {
        type: "data",
        message: data
    };

    printJSON(msg, false, true);
    compressed = compress(msg);
    printJSON(compressed, false, true);
    printJSON(decompress(compressed), false, true);
});

function print(data) {
    console.log(data)
}

function printJSON(data, beutify = false, showSize = false) {
    if (beutify) {
        print(JSON.stringify(data, null, 2))
    } else {
        jsonString = JSON.stringify(data)
        print(jsonString)
    }

    if (showSize) {
        print("=> " + jsonSize(data) + " byte")
    }
}

function sizeOf(string) {
    return string.length
}

function jsonSize(data) {
    return sizeOf(JSON.stringify(data))
}