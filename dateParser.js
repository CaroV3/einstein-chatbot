function extractDateFromText(text) {
    const regex = /\b(\d{1,2})\s*(?:-|\/|\s)?\s*(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)\s*(\d{4})?/i;
    const match = text.match(regex);
    if (!match) return null;

    const [ , day, monthStr, year ] = match;
    const monthMap = {
        januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5,
        juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11
    };

    const month = monthMap[monthStr.toLowerCase()];
    const fullYear = year ? parseInt(year) : new Date().getFullYear();

    return new Date(fullYear, month, parseInt(day));
}

export {extractDateFromText}