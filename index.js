var zlib = require("zlib")

/**
 * @author Muhammad Harisuddin Thohir <me@harisuddin.com>
 *
 * KVM { key, value, model }
 * JSON Compression
 *
 * result example
 * {
 *    k: [key1, key2, key3],
 *    v: [v1, v2, v3, v4, v5],
 *    m: {
 *        0: 1,
 *        1: {
 *            2: [0, 3, 4]
 *        }
 *    }
 * }
 *
 *
 * @param {any} data - JSON object to be compressed
 * @param {Boolean} force - if true will force compression even the result have bigger size
 * @returns {any} - Compression result
 *
 */

var isDebugMode = false
var isGzipDisabled = false

function compress(data, force = false) {
  compressed = forceCompress(data)
  if (isDebugMode) {
    return data
  }
  /**
   * if compressed size smaller than origin size
   * or force to compress then will return compressed JSON object
   * if not will return origin JSON object
   * and adition compression using GZIP
   */
  if (jsonSize(compressed) < jsonSize(data) || force) {
    if (isGzipDisabled) {
      return compressed
    } else {
      return gzip(compressed)
    }

  } else {
    if (isGzipDisabled) {
      return data
    } else {
      return gzip(data)
    }

  }
}

/**
 * do compression by collect all key into key list,
 * collect all value into value list
 * generate JSON model from minified origin JSON object
 *
 * @param {any} data - origin JSON object
 * @returns {any} result - compressed to KVM
 */

function forceCompress(data) {
  var key = [],
    value = [],
    model = {}

  key = getKeys(data)
  value = getValues(data)
  model = buildModel(data, key, value)

  return {
    k: key,
    v: value,
    m: model
  }
}

/**
 * if data object is compressed then return decompressed JSON object
 * if not will return origin JSON object
 *
 * @param {any} data - assumed as compressed JSON object
 * @returns {any} build - decompressed JSON object
 */

function decompress(data) {
  if (isDebugMode) {
    return data
  }
  if (!isGzipDisabled) {
    data = ungzip(data)
  }
  let map = Object.keys(data)
  if (map[0] === "k" && map[1] === "v" && map[2] === "m") {
    return build(data["m"], data["k"], data["v"])
  } else {
    return data
  }
}

/**
 * a recursive function to get all key from every object
 *
 * @param {any} data - original JSON object
 * @returns [String] keyList - list of key from every object
 */

function getKeys(data) {
  if (Array.isArray(data)) {
    let keys = []
    data.forEach(function (item, index, arr) {
      if (isObject(item)) {
        keys.push(...getKeys(item))
      }
    })
    return [...new Set(keys)]
  } else if (isObject(data)) {
    let keys = Object.keys(data)
    var result = []
    keys.forEach(function (item, index, arr) {
      if (isObject(data[item]) && data[item] != null) {
        result.push(item)
        result.push(...getKeys(data[item]))
      } else {
        result.push(item)
      }
    })
    return [...new Set(result)]
  }
}

/**
 * a recursive function to get all value from every object
 *
 * @param {any} data - original JSON object
 * @returns [String] valueList - list of value from every object
 */

function getValues(data) {
  if (Array.isArray(data)) {
    let values = []
    data.forEach(function (item, index, arr) {
      if (isObject(item)) {
        values.push(...getValues(item))
      } else {
        values.push(item)
      }
    })
    return [...new Set(values)]
  } else if (isObject(data)) {
    let keys = Object.keys(data)
    var result = []
    keys.forEach(function (item, index, arr) {
      if (isObject(data[item]) && data[item] != null) {
        result.push(...getValues(data[item]))
      } else {
        result.push(data[item])
      }
    })
    return [...new Set(result)]
  }
}

/**
 * build a new Model based on original JSON object
 * then change key and value with index from key list and value list
 *
 * @param {any} data - original JSON object
 * @param [String] key - list of key from every object
 * @param [String] value - list of value from every object
 */

function buildModel(data, key, value) {
  var model = {}
  if (Array.isArray(data)) {
    var modelArr = []
    data.forEach(function (item, index, arr) {
      if (isObject(item)) {
        modelArr.push(buildModel(item, key, value))
      } else {
        let indexValue = value.indexOf(item)
        modelArr.push(indexValue)
      }
    })
    model = modelArr
  } else if (isObject(data)) {
    let keys = Object.keys(data)
    keys.forEach(function (item, index, arr) {
      let indexKey = key.indexOf(item)
      if (isObject(data[item]) && data[item] != null) {
        model[indexKey] = buildModel(data[item], key, value)
      } else {
        let indexValue = value.indexOf(data[item])
        model[indexKey] = indexValue
      }
    })
  }

  return model
}

/**
 * rebuild object from compressed model
 * put key and value to their origin place
 *
 * @param {any} data - compressed JSON object
 * @param [String] key - list of key
 * @param [String] value - list of value
 * @returns {any} model - decompressed JSON
 */

function build(data, key, value) {
  var model = {}
  if (Array.isArray(data)) {
    var modelArr = []
    data.forEach(function (item, index, arr) {
      if (isObject(item)) {
        modelArr.push(build(item, key, value))
      } else {
        let indexValue = value[item]
        modelArr.push(indexValue)
      }
    })
    model = modelArr
  } else if (isObject(data)) {
    let keys = Object.keys(data)
    keys.forEach(function (item, index, arr) {
      let indexKey = key[item]
      if (isObject(data[item])) {
        model[indexKey] = build(data[item], key, value)
      } else {
        let indexValue = value[data[item]]
        model[indexKey] = indexValue
      }
    })
  }

  return model
}

/**
 * GZIP compression
 * @param {any} json
 * @returns {string} encoded - Base64
 */

function gzip(json) {
  jsonString = JSON.stringify(json)
  try {
    return encode(zlib.gzipSync(jsonString))
  } catch (e) {
    return json
  }
}

/**
 * UNGZIP decompression
 * @param {string} encoded - Base64
 * @returns {any} json - decompressed JSON object
 */

function ungzip(encoded) {
  decoded = decode(encoded)
  try {
    return JSON.parse(zlib.unzipSync(decoded).toString())
  } catch (e) {
    return encoded
  }
}

function debugMode(dMode = true) {
  isDebugMode = dMode
}

function disableGzip(dGzip = true) {
  isGzipDisabled = dGzip
}

/**
 * @param {string} string
 * @returns {string} base64
 */

function encode(string) {
  return Buffer.from(string).toString("base64")
}

/**
 * @param {string} encoded - Base64
 * @returns {buffer} buffer
 */

function decode(encoded) {
  return Buffer.from(encoded, "base64")
}

function isObject(obj) {
  return typeof obj == "object"
}

function sizeOf(string) {
  return string.length
}

function jsonSize(data) {
  return sizeOf(JSON.stringify(data))
}

exports.compress = compress
exports.decompress = decompress
exports.debugMode = debugMode
exports.disableGzip = disableGzip