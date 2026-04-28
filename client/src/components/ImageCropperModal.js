import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, Scissors } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';
import Button from './ui/Button';

export default function ImageCropperModal({ isOpen, onClose, imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop) => setCrop(crop);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl h-[85vh] sm:h-[75vh] rounded-[2rem] flex flex-col overflow-hidden shadow-2xl animate-scale-in">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Scissors size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Crop Intelligence</h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Optimize Visual Node</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="relative flex-1 bg-slate-900 overflow-hidden">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="size-16 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                <Scissors size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Source Material</span>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-white space-y-6">
           <div className="flex items-center gap-6">
             <ZoomIn size={18} className="text-gray-400 shrink-0" />
             <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
             />
             <span className="text-[10px] font-black text-gray-400 w-8">{Math.round(zoom * 100)}%</span>
           </div>

          <div className="flex gap-4 pt-2">
            <Button 
              variant="ghost"
              className="flex-1 rounded-2xl py-4"
              onClick={onClose}
            >
              Discard
            </Button>
            <Button 
              variant="primary"
              className="flex-2 rounded-2xl py-4 shadow-xl shadow-indigo-600/20"
              onClick={handleSave} 
              disabled={loading || !imageSrc}
              loading={loading}
            >
              Apply & Initialize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
