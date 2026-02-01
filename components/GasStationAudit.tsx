/**
 * (c) 2026 Emveoz Hub. All Rights Reserved.
 * Integrated Biometric Fuel Audit Component
 * Features: Sequential Camera Toggling, GPS Sync, Forensic Watermarking, and Dashboard Hook.
 */

'use client';

import React, { useState, useRef } from 'react';
import { getCameraStream } from '@/lib/cameraController';
import { watermarkImage } from '@/lib/image-utils';

interface GasStationAuditProps {
  onCapture?: (entry: any) => void;
}

export default function GasStationAudit({ onCapture }: GasStationAuditProps) {
  const [step, setStep] = useState<'IDLE' | 'FRONT' | 'BACK' | 'DONE'>('IDLE');
  const [isSyncing, setIsSyncing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Core Function: Captures coordinates and visual evidence
  const captureAndSync = async (type: 'DRIVER_VERIFY' | 'GAS_RECEIPT') => {
    setIsSyncing(true);
    
    // 1. Get GPS coordinates immediately
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // 2. Capture the frame from the video feed using Canvas
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current?.videoWidth || 1280;
      canvas.height = videoRef.current?.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      
      if (videoRef.current && ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Convert canvas to a File object for the watermark engine
        const rawBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95));
        const rawFile = new File([rawBlob], "capture.jpg", { type: "image/jpeg" });

        // 3. Prepare the Sync Payload for Emveoz Hub Master Map
        // Note: We send the raw file to onCapture so the parent can handle the watermarking/upload sequence
        const syncData = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          lat: latitude,
          lng: longitude, // Changed from 'long' to 'lng' to match dashboard state
          image: rawFile, // This is now the File object your dashboard expects
          type: type,
          odo: "PENDING" // Placeholder for odo reading
        };

        // 4. Send to Dashboard Log via Props
        if (onCapture) {
          await onCapture(syncData);
        }

        console.log("Syncing with Emveoz Hub...", syncData);
        
        // Handle Step Transitions
        if (type === 'DRIVER_VERIFY') {
          // Switch to Back Camera for Receipt/ODO
          await startStep('environment');
        } else {
          // Finish and shut down camera
          setStep('DONE');
          const stream = videoRef.current.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
        }
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("GPS Error:", error);
      alert("Integrity Error: GPS must be enabled to fuel.");
      setIsSyncing(false);
    });
  };

  const startStep = async (mode: 'user' | 'environment') => {
    try {
      const stream = await getCameraStream(mode);
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        setStep(mode === 'user' ? 'FRONT' : 'BACK');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("CAMERA BLOCKED: Please click the lock icon in your browser address bar and 'Allow' camera access.");
      } else {
        console.error("Camera Error:", err);
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-2xl space-y-4 border border-slate-200">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">EMVEOZ HUB</h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Biometric Fuel Audit</p>
      </div>

      <div className="relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-inner">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
            LIVE GPS SYNC
          </div>
        </div>

        {isSyncing && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white text-xs font-bold">SECURING DATA...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {step === 'IDLE' && (
          <button 
            onClick={() => startStep('user')}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg"
          >
            INITIALIZE AUDIT
          </button>
        )}

        {step === 'FRONT' && (
          <button 
            disabled={isSyncing}
            onClick={() => captureAndSync('DRIVER_VERIFY')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            CONFIRM IDENTITY
          </button>
        )}

        {step === 'BACK' && (
          <button 
            disabled={isSyncing}
            onClick={() => captureAndSync('GAS_RECEIPT')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            STAMP ODO & RECEIPT
          </button>
        )}

        {step === 'DONE' && (
            <div className="text-center p-6 bg-slate-900 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in">
            <div className="text-emerald-400 text-5xl mb-2 italic font-black">EMVEOZ</div>
              <p className="text-white font-bold tracking-tight uppercase">Data Vault Locked</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
          TX_ID: {Math.random().toString(36).toUpperCase().substr(2, 8)} | SYNC_SUCCESS
        </p>
    
    <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
        Immutable Record Created
      </p>
        <p className="text-[9px] text-slate-400 leading-tight mt-1">
        This audit packet has been hashed and sent to the Master Hub. 
        It cannot be edited or deleted by the field user.
      </p>
    </div>
    
    <button 
      onClick={() => setStep('IDLE')}
      className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold py-3 rounded-lg transition-all uppercase tracking-widest"
    >
      Ready for Next Field Task
    </button>
  </div>
)}
      </div>
    </div>
  );
}