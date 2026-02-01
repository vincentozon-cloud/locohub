/**
 * EMVEOZ HUB - Forensic Image Utility
 * Hard-codes GPS and Timestamp data into evidence photos.
 */
export async function watermarkImage(
  file: File, 
  lat: number, 
  lng: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error("Failed to initialize canvas context"));
          return;
        }

        // 1. Draw original image
        ctx.drawImage(img, 0, 0);

        // 2. Watermark Settings (Scalable)
        const fontSize = Math.floor(canvas.width * 0.025); 
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 0, 0.9)"; // Safety Yellow
        
        const timestamp = new Date().toLocaleString();
        const geoText = `LAT: ${lat.toFixed(6)} | LNG: ${lng.toFixed(6)}`;
        const brandText = "EMVEOZ HUB - INTEGRITY VERIFIED";

        // 3. Shadow for readability
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        
        // 4. Position text (Bottom Left)
        const padding = 20;
        ctx.fillText(brandText, padding, canvas.height - (fontSize * 3));
        ctx.fillText(geoText, padding, canvas.height - (fontSize * 2));
        ctx.fillText(timestamp, padding, canvas.height - fontSize);

        // 5. Output as Blob for Supabase
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob conversion failed"));
        }, 'image/jpeg', 0.85);
      };
    };
    reader.onerror = (err) => reject(err);
  });
}