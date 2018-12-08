# kvm-json

A JSON compression technique by splitting JSON object into Key, Value and Model.

`npm i kvm-json`

## Features

- Compress JSON into KVM model structure
- Decompress KVM structure into origin JSON object
- Extra compression using GZIP (can be disabled)
- Debug mode (turn off compression)

## Usage

Import kvm-json into your project

```js
var kvm = require("kvm-json"),
  compress = kvm.compress,
  decompress = kvm.decompress;
```

Debug mode:

```js
kvm.debugMode(); // or kvm.debugMode(true)
```

Disable GZIP, will return KVM JSON object:

```js
kvm.disableGzip(); // or kvm.disableGzip(true)
```

Compression usage:

```js
data = [
  {
    class: "motogp",
    rider: [
      {
        name: "Valentino Rossi",
        age: 39,
        bike_number: 46,
        world_champion: 7
      },
      {
        name: "Marc Márquez",
        age: 25,
        bike_number: 93,
        world_champion: 5
      },
      {
        name: "Jorge Lorenzo",
        age: 31,
        bike_number: 99,
        world_champion: 3
      }
    ]
  },
  {
    class: "moto2",
    rider: [
      {
        name: "Francesco Bagnaia",
        age: 21,
        bike_number: 63,
        world_champion: 1
      },
      {
        name: "Franco Morbidelli",
        age: 24,
        bike_number: 21,
        world_champion: 1
      },
      {
        name: "Pol Espargaró",
        age: 27,
        bike_number: 44,
        world_champion: 1
      }
    ]
  }
];

compressed = compress(data);
console.log(compressed);

/**
 * KVM structure result : 
{
  "k": [ "class", "rider", "name", "age", "bike_number", "world_champion" ],
  "v": [ "motogp", "Valentino Rossi", 39, 46, 7, "Marc Márquez", 25, 93, 5, 
         "Jorge Lorenzo", 31, 99, 3, "moto2", "Francesco Bagnaia", 21, 63, 1, 
         "Franco Morbidelli", 24, "Pol Espargaró", 27, 44 ],
  "m": [
    {
      "0": 0,
      "1": [
        {
          "2": 1,
          "3": 2,
          "4": 3,
          "5": 4
        },
        {
          "2": 5,
          "3": 6,
          "4": 7,
          "5": 8
        },
        {
          "2": 9,
          "3": 10,
          "4": 11,
          "5": 12
        }
      ]
    },
    {
      "0": 13,
      "1": [
        {
          "2": 14,
          "3": 15,
          "4": 16,
          "5": 17
        },
        {
          "2": 18,
          "3": 19,
          "4": 15,
          "5": 17
        },
        {
          "2": 20,
          "3": 21,
          "4": 22,
          "5": 17
        }
      ]
    }
  ]
}
 
Extra compression using gzip result:

"H4sIAAAAAAAAE1XOwWqEMBAG4FeROc/BxKirx0J7KBVKD70UWaIb3LCasXG3hV32YfoMfYR9sY7
RQksgCfkm/8wFDlC+QdvraQIEb3fG8+n0YPjQ3bw39mC27jQ0gT7J97ttu9fDaMlBjfAxJwx0pG5
kf9W9cUfrKHqhabKASYEqwxyh0r6NqtuXfz+ZM6BMsUgwRXgk35noibxxZ+J6gUWBCYZIyYkPXrv
WTC1Fd7pz2mr+KzBLUKxGUUW+4dH7nvtJhfBMfXQ/jdp32t+++S1HpXjUgUe9QAxljCDCXULJMQm
UEkFByW1TKNUVg6RBsiB5kM0qRRARBxIimJDXemaOF8nffLUUp0txthTna5LYLFosmv5XGS/DiaB
S/mrN6wf+PL6XvAEAAA=="
*
*/
```
