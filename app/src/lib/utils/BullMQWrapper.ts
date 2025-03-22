import { Queue, Worker, Job, JobScheduler } from "bullmq";
import type Redis from "ioredis";

export class BullMQWrapper {
  private queue: Queue;
  private worker: Worker;
  private scheduler: JobScheduler;

  constructor(queueName: string, connection: Redis) {
    this.queue = new Queue(queueName, { connection });
    this.scheduler = new JobScheduler(queueName, { connection });
    this.worker = new Worker(
      queueName,
      async (job: Job) => {
        return this.processJob(job);
      },
      { connection },
    );

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${(job as Job).id} failed: ${err.message}`);
    });
  }

  private async processJob(job: Job): Promise<any> {
    console.log(`Processing job ${job.id} with data:`, job.data);
    return { success: true };
  }

  public async addScheduledJob(
    jobName: string,
    data: any,
    cron: string,
  ): Promise<Job> {
    // await this.queue.upsertJobScheduler(jobName, { pattern: cron }, data);
    return await this.queue.add(jobName, data, { repeat: { pattern: cron } });
  }

  public async addJob(jobName: string, data: any): Promise<Job> {
    return await this.queue.add(jobName, data);
  }

  public async getJob(jobId: string): Promise<Job | null> {
    return await this.queue.getJob(jobId);
  }

  public async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  public async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
    await this.scheduler.close();
  }
}
