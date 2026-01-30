// Logic to check if the salesman is at a 'Lodge' or 'Market'
export const verifyLocationIntegrity = (lat: number, long: number, authorizedZones: any[]) => {
  // If current GPS is NOT in authorizedZones, mark as suspicious
  const isAuthorized = authorizedZones.some(zone => {
    // This checks if the coordinates are very close to a known store
    return Math.abs(lat - zone.lat) < 0.001 && Math.abs(long - zone.long) < 0.001;
  });

  return {
    integrityFlag: !isAuthorized,
    message: isAuthorized ? "Safe Zone" : "Unauthorized Stop Detected (Grey Zone)"
  };
};