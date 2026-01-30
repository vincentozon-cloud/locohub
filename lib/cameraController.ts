// src/lib/cameraController.ts

/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Logic to toggle between Front (User) and Back (Environment) cameras.
 */

export const getCameraStream = async (type: "user" | "environment") => {
  const constraints = {
    video: {
      facingMode: type, // 'user' is front, 'environment' is back
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false // We don't need audio for ODO stamps
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error("Camera Access Denied:", error);
    return null;
  }
};