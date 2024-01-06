export const generatePassword = () => {
    return Math.random().toString(36).slice(-8)
}

export const capitalizeString = (inputString) => {
    if (typeof inputString !== 'string' || inputString.length === 0) {
        return inputString
    }

    const words = inputString.split(' ')
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return capitalizedWords.join(' ')
}

export function numberWithDots(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
