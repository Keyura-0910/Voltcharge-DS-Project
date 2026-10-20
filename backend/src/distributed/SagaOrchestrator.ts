import { SagaTransaction } from '../types';
import { DistributedLockManager } from './DistributedLockManager';
import { LogicalClockManager } from './LogicalClock';

export class SagaOrchestrator {
  private static instance: SagaOrchestrator;
  private sagas: Map<string, SagaTransaction> = new Map();

  private constructor() {}

  public static getInstance(): SagaOrchestrator {
    if (!SagaOrchestrator.instance) {
      SagaOrchestrator.instance = new SagaOrchestrator();
    }
    return SagaOrchestrator.instance;
  }

  public async executeBookingSaga(
    bookingId: string,
    userId: string,
    chargerId: string,
    simulatePaymentFailure: boolean = false
  ): Promise<{ success: boolean; saga: SagaTransaction; userMessage: string }> {
    const sagaId = `saga_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const clock = LogicalClockManager.getInstance();

    const saga: SagaTransaction = {
      sagaId,
      bookingId,
      userId,
      chargerId,
      currentStep: 'INIT',
      stepsCompleted: [],
      compensationLog: [],
      status: 'IN_PROGRESS',
    };
    this.sagas.set(sagaId, saga);

    clock.tickLamport('Node-Booking');
    const lockMgr = DistributedLockManager.getInstance();
    const lockResult = await lockMgr.acquireLock(chargerId, `saga_${bookingId}`);

    if (!lockResult.success) {
      saga.currentStep = 'FAILED';
      saga.status = 'ROLLED_BACK';
      saga.compensationLog.push('Charger lock acquisition failed due to concurrent reservation.');
      return {
        success: false,
        saga,
        userMessage: 'This charger is no longer available.',
      };
    }

    saga.currentStep = 'HOLD_CHARGER';
    saga.stepsCompleted.push('Hold Charger Lock (Reserved)');

    clock.tickLamport('Node-Payment');
    saga.currentStep = 'PROCESS_PAYMENT';

    if (simulatePaymentFailure) {
      saga.currentStep = 'COMPENSATING';
      saga.compensationLog.push('Payment authorization rejected by banking gateway.');

      lockMgr.releaseLock(chargerId, `saga_${bookingId}`);
      saga.compensationLog.push(`COMPENSATION APPLIED: Released lock on charger ${chargerId}.`);
      saga.compensationLog.push(`COMPENSATION APPLIED: Cancelled pending booking ${bookingId}.`);

      saga.currentStep = 'FAILED';
      saga.status = 'ROLLED_BACK';

      return {
        success: false,
        saga,
        userMessage: 'Payment could not be completed. Your charger reservation has been released.',
      };
    }

    saga.stepsCompleted.push('Payment Processed & Authorized (₹420)');

    clock.tickLamport('Node-Booking');
    saga.currentStep = 'CONFIRM_RESERVATION';
    saga.stepsCompleted.push('Booking Confirmed & QR Ticket Issued');
    saga.status = 'COMPLETED';

    return {
      success: true,
      saga,
      userMessage: 'Charger reserved successfully.',
    };
  }

  public getSaga(sagaId: string): SagaTransaction | undefined {
    return this.sagas.get(sagaId);
  }

  public getAllSagas(): SagaTransaction[] {
    return Array.from(this.sagas.values());
  }
}
