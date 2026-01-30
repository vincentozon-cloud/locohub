// src/lib/auditService.ts

/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Proprietary and Confidential.
 */

import { DualCameraStamp } from "../types/audit";

/**
 * Validates if the gas transaction occurred within an authorized geofence.
 * @param stamp The captured data from the dual camera and GPS.
 * @param authorizedGasStations Array of known gas station coordinates.
 */
export const verifyGasStationLock = (
  stamp: DualCameraStamp, 
  authorizedGasStations: { lat: number; long: number; name: string }[]
) => {
  
  // 1. Geofence Check: Is the driver actually at a valid pump?
  const isAtAuthorizedStation = authorizedGasStations.some(station => {
    // 0.0015 threshold is roughly 150 meters to account for station size
    const latDiff = Math.abs(stamp.lat - station.lat);
    const longDiff = Math.abs(stamp.long - station.long);
    return latDiff < 0.0015 && longDiff < 0.0015;
  });

  // 2. Freshness Check: Was the photo taken in the last 5 minutes?
  const currentTime = new Date().getTime();
  const stampTime = new Date(stamp.timestamp).getTime();
  const isFresh = (currentTime - stampTime) < 300000; 

  return {
    isLocked: isAtAuthorizedStation && isFresh,
    integrityScore: isAtAuthorizedStation && isFresh ? 100 : 0,
    logs: {
      locationStatus: isAtAuthorizedStation ? "VERIFIED" : "OUT_OF_BOUNDS",
      timeStatus: isFresh ? "VALID" : "STALE_DATA",
    }
  };
};