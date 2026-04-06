function parsePrice(value) {
    return parseFloat(value.replace(/[$,]/g, '')) || 0
}

function parseDate(value) {
    const [month, day, year] = value.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function parsePoshmarkCsv(rows) {
    return rows.map(row => ({
        order_id:      row['Order Id'],
        order_date:    parseDate(row['Order Date']),
        listing_title: row['Listing Title'],
        order_price:   parsePrice(row['Order Price']),
        net_earnings:  parsePrice(row['Your Earnings']),
    }))
}
