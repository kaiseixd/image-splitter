export function getMetaConfig(metadata) {
    const { width, height, format } = metadata

    const horizontal = width > height
    const ratio = Math.min(600 / width, 600 / height)
    const wrapperWidth = width * ratio
    const wrapperHeight = height * ratio

    const metaConfig = {
        format,
        horizontal,
        ratio: ratio,
        width: wrapperWidth,
        height: wrapperHeight,
        leftBorder: (600 - wrapperWidth) / 2,
        rightBorder: (600 - wrapperWidth) / 2 + wrapperWidth,
        topBorder: (600 - wrapperHeight) / 2,
        bottomBorder: (600 - wrapperHeight) / 2 + wrapperHeight,
    }
    const formatMetaConfig = Object.keys(metaConfig).reduce((formated, key) => {
        const value = metaConfig[key]
        formated[key] = typeof value === 'number' ? toFixed(value, 4) : value
        return formated
    }, {})

    return formatMetaConfig
}

export function toFixed(value, number) {
    const pow = Math.pow(10, number)
    return Math.floor(value * pow) / pow
}

export function debounce(func, delay) {
    let lastTime = null
    return function(...params) {
        const now = Date.now()
        if (!lastTime || (now - lastTime) > delay) {
            func(...params)
            lastTime = now
        }
    }
}
