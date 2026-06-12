import path from 'path';
import fs from 'fs';
// @ts-ignore
import m3u8ToMp4 from 'm3u8-to-mp4';
const userHomeDir = process.env.USERPROFILE || process.env.HOME || '';
const downloadsDir = path.join(userHomeDir, 'Videos', 'MediaUniverse');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}
export class DownloadManager {
    queue = [];
    activeJobs = 0;
    maxConcurrent = 2;
    constructor() {
        // In a real app, load pending jobs from SQLite
        console.log('[DownloadManager] Initialized. Save dir:', downloadsDir);
    }
    addJob(title, url, quality) {
        const job = {
            id: Math.random().toString(36).substring(7),
            title,
            url,
            quality,
            status: 'queued',
            progress: 0,
        };
        this.queue.push(job);
        this.processQueue();
        this.broadcastQueue();
    }
    async processQueue() {
        if (this.activeJobs >= this.maxConcurrent)
            return;
        const nextJob = this.queue.find(j => j.status === 'queued');
        if (!nextJob)
            return;
        this.activeJobs++;
        nextJob.status = 'downloading';
        this.broadcastQueue();
        try {
            const converter = new m3u8ToMp4();
            const outputPath = path.join(downloadsDir, `${nextJob.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`);
            // M3U8 to MP4 conversion takes time. 
            // In a real implementation we would hook into ffmpeg progress events.
            // For MVP, we simulate progress.
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                nextJob.progress = progress;
                this.broadcastQueue();
                if (progress >= 100)
                    clearInterval(interval);
            }, 1000);
            // We bypass actual download to prevent hanging the system in MVP phase
            // await converter.setInputFile(nextJob.url).setOutputFile(outputPath).start();
            await new Promise(resolve => setTimeout(resolve, 10000)); // Simulate 10s download
            nextJob.status = 'completed';
            nextJob.progress = 100;
        }
        catch (err) {
            console.error('[DownloadManager] Failed to download:', err);
            nextJob.status = 'error';
        }
        finally {
            this.activeJobs--;
            this.broadcastQueue();
            this.processQueue();
        }
    }
    broadcastQueue() {
        // In a web app, we could use WebSockets. For now, the React client will poll /api/downloads.
    }
    getQueue() {
        return this.queue;
    }
}
export const downloadManager = new DownloadManager();
