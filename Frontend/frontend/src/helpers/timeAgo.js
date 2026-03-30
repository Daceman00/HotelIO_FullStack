export const formatTimeAgo = (timestamp) => {
    if (!timestamp) return null;

    const now = new Date();
    const then = new Date(timestamp);
    const secondsAgo = Math.floor((now - then) / 1000);

    if (secondsAgo < 60) {
        return 'Just now';
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) {
        return `${weeksAgo} week${weeksAgo !== 1 ? 's' : ''} ago`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    }

    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
};

// Optional: Format as exact date/time
export const formatLastSeenExact = (timestamp) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};