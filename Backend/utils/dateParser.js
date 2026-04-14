const parseDate = (dateString) => {
    if (!dateString) return null;

    // Handle "Present" or "Current"
    if (dateString.toLowerCase().includes('present') || dateString.toLowerCase().includes('current')) {
        return new Date();
    }

    try {
        // Normalize separators: replace " to " with "-"
        let normalizedDate = dateString.replace(/\s+to\s+/i, '-');

        // Extract the first date part if it's a range (e.g., "June '23 - Aug '23")
        const firstPart = normalizedDate.split('-')[0].trim();

        // Handle "Month 'Year" format (e.g., "June '23")
        // Replace ' with space to make it "June 23" which might be ambiguous ("June 2023" is better)
        // Regex to find 'YY and convert to 20YY
        let cleanDate = firstPart.replace(/'(\d{2})/, '20$1');

        // If it's just a year "2024", default to Jan 1
        if (/^\d{4}$/.test(cleanDate)) {
            return new Date(`${cleanDate}-01-01`);
        }

        const parsed = new Date(cleanDate);
        if (!isNaN(parsed)) {
            return parsed;
        }
        return null;
    } catch (e) {
        console.error("Date parsing error:", e);
        return null; // Fail gracefully
    }
};

module.exports = parseDate;
