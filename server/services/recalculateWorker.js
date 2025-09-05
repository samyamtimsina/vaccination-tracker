import { parentPort, workerData } from 'node:worker_threads';
import { recalculateChildVaccines } from './recalculateChildVaccines.js';

const { newVersionId, oldVersionId } = workerData;

(async () => {
    try {
        await recalculateChildVaccines(newVersionId, oldVersionId, (progress) => {
            // send progress to main thread
            parentPort.postMessage(progress);
        });
        parentPort.postMessage({ done: true });
    } catch (err) {
        parentPort.postMessage({ error: err.message });
    }
})();
