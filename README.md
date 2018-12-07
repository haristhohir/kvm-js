# kvm-js

A JSON compression technique by splitting JSON object into Key, Value and Model

`npm i kvm-json`

## Features

- Compress JSON into KVM model structure
- Decompress KVM structute into origin JSON object

## Usage

Import kvm-json into your project

```js
var kvm = require("kvm-json"),
  compress = kvm.compress,
  decompress = kvm.decompress;
```

This is safe for JSON with comments:

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
 * result : 
{
  "k": [
    "class",
    "rider",
    "name",
    "age",
    "bike_number",
    "world_champion"
  ],
  "v": [
    "motogp",
    "Valentino Rossi",
    39,
    46,
    7,
    "Marc Márquez",
    25,
    93,
    5,
    "Jorge Lorenzo",
    31,
    99,
    3,
    "moto2",
    "Francesco Bagnaia",
    21,
    63,
    1,
    "Franco Morbidelli",
    24,
    "Pol Espargaró",
    27,
    44
  ],
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
 */
```
