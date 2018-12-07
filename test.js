var zlib = require('zlib');
var kvm = require('./'),
    compress = kvm.compress,
    decompress = kvm.decompress

data = [{
    class: "motogp",
    rider: [{
        name: "Valentino Rossi",
        age: 39,
        bike_number: 46,
        world_champion: 7
    }, {
        name: "Marc Márquez",
        age: 25,
        bike_number: 93,
        world_champion: 5
    }, {
        name: "Jorge Lorenzo",
        age: 31,
        bike_number: 99,
        world_champion: 3
    }]
}, {
    class: "moto2",
    rider: [{
        name: "Francesco Bagnaia",
        age: 21,
        bike_number: 63,
        world_champion: 1
    }, {
        name: "Franco Morbidelli",
        age: 24,
        bike_number: 21,
        world_champion: 1
    }, {
        name: "Pol Espargaró",
        age: 27,
        bike_number: 44,
        world_champion: 1
    }]
}]


printJSON(data, false, true)
compressed = compress(data)
printJSON(compressed, false, true)
// printJSON(compressed, true, true)
printJSON(decompress(compressed), false, true)

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
    try {
        return string.length
    } catch {
        return 0
    }

}

function jsonSize(data) {
    return sizeOf(JSON.stringify(data))
}