export function timestampToString(ts) {
    return Math.floor(ts / 3600).toString() + ":" + Math.floor(ts % 3600 / 60).toString().padStart(2, "0")
}

export function isWeekEven(startTS, curTS) {
    return Math.ceil(Math.ceil(Math.floor((curTS - startTS) / 1000) / 3600 / 24) / 7) % 2 == 0
}
