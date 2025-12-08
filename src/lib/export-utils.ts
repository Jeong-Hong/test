import type { RoastingSession } from '../types/domain';

export function exportToJSON(session: RoastingSession) {
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `roasting_log_${session.date.replace(/:/g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

export function exportToCSV(session: RoastingSession) {
    // Simple CSV export: Headers + Rows
    // We'll export the Logs table

    const headers = ['Minute', 'Temperature', 'RoR', 'Heat', 'Events'];
    const rows = session.logs.map(log => {
        // Find events in this minute (approx)
        const evts = session.events
            .filter(e => Math.floor(e.timestamp / 60) === log.time)
            .map(e => e.type)
            .join('; ');

        return [
            log.time,
            log.temperature,
            log.ror,
            log.heatLevel,
            evts
        ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,"
        + [headers.join(','), ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `roasting_log_${session.date.replace(/:/g, '-')}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
