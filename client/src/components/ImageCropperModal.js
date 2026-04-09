import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

export default function ImageCropperModal({ isOpen, onClose, imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass fade-in" style={{
        width: '90%', maxWidth: '600px', height: '80vh',
        backgroundColor: '#1a1a1a', borderRadius: '12px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem' }}>Crop Image</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
        </div>
        
        <div style={{ position: 'relative', flex: 1, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3} // Default aspect, can be made dynamic
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
            />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              No image selected
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem', padding: '0 1rem' }}>
           <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(e.target.value)}
            style={{ width: '100%' }}
           />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={onClose}
            style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: 'white', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading || !imageSrc}
            style={{ padding: '0.5rem 1rem', background: 'var(--primary, #e53e3e)', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : 'Save & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
