import { NotificationRepository } from '@momera/database';
import { NotificationProvider, NotificationPayload } from './provider.js';

export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private provider: NotificationProvider
  ) {}

  async dispatch(outboxId: number, payload: NotificationPayload): Promise<void> {
    try {
      const result = await this.provider.send(payload);
      if (result.success) {
        await this.notificationRepo.updateStatus(outboxId, 'SENT');
      } else {
        await this.notificationRepo.updateStatus(outboxId, 'FAILED', result.error);
      }
    } catch (err: any) {
      console.error(`[NotificationService] Unexpected dispatch error for outbox ID ${outboxId}:`, err);
      await this.notificationRepo.updateStatus(
        outboxId,
        'FAILED',
        err.message || 'Unknown notification error'
      );
    }
  }

  async retry(outboxId: number): Promise<boolean> {
    const items = await this.notificationRepo.getAll(100);
    const item = items.find((i) => i.id === outboxId);
    if (!item) return false;

    try {
      const payload = JSON.parse(item.payload_json) as NotificationPayload;
      const result = await this.provider.send(payload);
      if (result.success) {
        await this.notificationRepo.updateStatus(outboxId, 'SENT');
        return true;
      } else {
        await this.notificationRepo.updateStatus(outboxId, 'FAILED', result.error);
        return false;
      }
    } catch (err: any) {
      await this.notificationRepo.updateStatus(outboxId, 'FAILED', err.message);
      return false;
    }
  }
}
