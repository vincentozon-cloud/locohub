// src/types/audit.ts

/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Proprietary and Confidential.
 */

export interface DualCameraStamp {
  timestamp: string;
  driverFaceUrl: string; // Captured from Front Camera
  receiptOdoUrl: string; // Captured from Back Camera (Receipt + ODO)
  lat: number;
  long: number;
  gasAmountLiters: number;
  totalCost: number;
}