'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';
import { sectionService } from '../services/sectionService';
import Button from './ui/Button';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * GridBuilder Component
 * Standardizes the display and management of image-based grid layouts.
 */
export default function GridBuilder({ sectionName, initialLayout = [] }) {
  const [items, setItems] = useState(initialLayout);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(initialLayout);
  }, [initialLayout]);

  const handleLayoutChange = (layout) => {
    const newItems = items.map(item => {
      const match = layout.find(l => l.i === item.i);
      if (match) {
        return { ...item, x: match.x, y: match.y, w: match.w, h: match.h };
      }
      return item;
    });
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = {
      i: uuidv4(),
      x: (items.length * 2) % 12,
      y: Infinity,
      w: 4,
      h: 4,
      imageUrl: ''
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this visual node?')) {
      setItems(items.filter(item => item.i !== id));
    }
  };

  const triggerImageSelect = (item) => {
    setSelectedItem(item);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => setImageToCrop(reader.result));
        reader.readAsDataURL(file);
        setIsModalOpen(true);
      }
    };
    input.click();
  };

  const handleCropComplete = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('image', blob, 'cropped.jpg');
      
      const res = await sectionService.uploadImage(formData);
      const { imageUrl, s3Key } = res;

      setItems(items.map(item => 
        item.i === selectedItem.i 
          ? { ...item, imageUrl, s3Key } 
          : item
      ));

      setIsModalOpen(false);
      setImageToCrop(null);
      setSelectedItem(null);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const saveLayout = async () => {
    setIsSaving(true);
    try {
      await sectionService.saveLayout(sectionName, items);
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save layout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-slide-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white shadow-sm gap-6 sm:gap-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.25em] text-gray-900 leading-none">
              {sectionName.replace('-', ' ')}
            </h3>
            <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Visual Node Management</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={addItem}
            className="flex-1 sm:flex-none py-3.5 sm:py-2.5"
          >
            Provision
          </Button>
          <Button 
            variant="primary"
            size="sm"
            icon={Save}
            onClick={saveLayout}
            loading={isSaving}
            className="flex-1 sm:flex-none py-3.5 sm:py-2.5 shadow-xl shadow-indigo-600/20"
          >
            Finalize
          </Button>
        </div>
      </header>

      <div className="min-h-[400px] sm:min-h-[600px] bg-slate-950/5 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed border-gray-200 p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: items }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[24, 24]}
        >
          {items.map(item => (
            <div 
              key={item.i} 
              data-grid={item}
              className="group relative rounded-3xl overflow-hidden border border-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
              style={{
                backgroundColor: item.imageUrl ? 'transparent' : 'rgba(255,255,255,0.8)',
              }}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-300">
                   <ImageIcon size={32} strokeWidth={1} />
                   <span className="text-[8px] font-black uppercase tracking-[0.3em]">Empty Node</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 z-20">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => triggerImageSelect(item)}
                  className="w-32 py-3"
                >
                  {item.imageUrl ? 'Replace' : 'Initialize'}
                </Button>
                <button 
                  onClick={() => deleteItem(item.i)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                  Terminate Node
                </button>
              </div>

              {/* Resize Handle Decoration */}
              <div className="absolute bottom-2 right-2 size-2 border-r-2 border-b-2 border-white/20 group-hover:border-white transition-colors" />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      <ImageCropperModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setImageToCrop(null); }} 
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
