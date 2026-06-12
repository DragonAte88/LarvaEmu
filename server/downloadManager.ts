import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import { dbAPI } from './database.js';

export interface DownloadJob {
  id: string;
  title: string;
  url: string;
  quality: string;
  status: 'queued' | 'downloading' | 'completed' | 'error';
  progress: number;
}

const userHomeDir = process.env.USERPROFILE || process.env.HOME || '';
const downloadsDir = path.join(userHomeDir, 'Videos', 'MediaUniverse');

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

export class DownloadManager {
  private queue: DownloadJob[] = [];
  private activeJobs: number = 0;
  private maxConcurrent: number = 2;

  constructor() {
    console.log('[DownloadManager] Initialized. Save dir:', downloadsDir);
  }

  addJob(title: string, url: string, quality: string) {
    const job: DownloadJob = {
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

  private async processQueue() {
    if (this.activeJobs >= this.maxConcurrent) return;

    const nextJob = this.queue.find(j => j.status === 'queued');
    if (!nextJob) return;

    this.activeJobs++;
    nextJob.status = 'downloading';
    this.broadcastQueue();

    try {
      if (!ffmpegStatic) {
        throw new Error('FFmpeg static binary not found.');
      }

      const outputPath = path.join(downloadsDir, `${nextJob.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`);

      await new Promise<void>((resolve, reject) => {
        // Native FFmpeg download and conversion from m3u8
        const ffmpegCmd = ffmpegStatic as string;
        const ffmpeg = spawn(ffmpegCmd, [
          '-i', nextJob.url,
          '-c', 'copy',
          '-bsf:a', 'aac_adtstoasc',
          '-y',
          outputPath
        ]);

        let totalDurationSec = 0;

        ffmpeg.stderr.on('data', (data: Buffer) => {
          const output = data.toString();
          
          // Parse total duration from FFmpeg output
          // Duration: 00:24:15.12
          if (!totalDurationSec) {
            const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.\d{2}/);
            if (durationMatch) {
              totalDurationSec = 
                parseInt(durationMatch[1]) * 3600 +
                parseInt(durationMatch[2]) * 60 +
                parseInt(durationMatch[3]);
            }
          }

          // Parse current time to calculate progress
          // time=00:05:12.45
          const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.\d{2}/);
          if (timeMatch && totalDurationSec > 0) {
            const currentSec = 
              parseInt(timeMatch[1]) * 3600 +
              parseInt(timeMatch[2]) * 60 +
              parseInt(timeMatch[3]);
            
            const progress = Math.min(100, Math.round((currentSec / totalDurationSec) * 100));
            if (progress > nextJob.progress) {
              nextJob.progress = progress;
              this.broadcastQueue();
            }
          }
        });

        ffmpeg.on('close', (code: number | null) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });
        
        ffmpeg.on('error', (err: Error) => {
          reject(err);
        });
      });

      nextJob.status = 'completed';
      nextJob.progress = 100;
    } catch (err) {
      console.error('[DownloadManager] Failed to download:', err);
      nextJob.status = 'error';
    } finally {
      this.activeJobs--;
      this.broadcastQueue();
      this.processQueue();
    }
  }

  private broadcastQueue() {
    // Polled by React frontend
  }

  getQueue() {
    return this.queue;
  }
}

export const downloadManager = new DownloadManager();
