// File: server/utils/monitoring.js
// Cron: 0 * * * * node server/utils/monitoring.js

import { prisma } from '../utils/prisma.js';
import { format } from 'date-fns';

async function monitorFacts() {
    const meta = await prisma.analyticsMeta.findFirst({ where: { id: 1 } });
    const now = new Date();
    const cutoff = new Date(now.getTime() - 864e5); // 24h

    const stale = [];
    if (meta.lastProcessedChild < cutoff) stale.push('child');
    if (meta.lastProcessedMother < cutoff) stale.push('mother');
    if (meta.lastProcessedGrowth < cutoff) stale.push('growth');

    if (stale.length) {
        console.warn(`Stale facts: ${stale.join(', ')} as of ${format(now, 'yyyy-MM-dd HH:mm')}`);
        // Trigger worker or alert
    } else {
        console.log('Facts current.');
    }
}

monitorFacts();