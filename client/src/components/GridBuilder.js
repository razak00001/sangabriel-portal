'use client';

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
import ImageCropperModal from './ImageCropperModal';
import { sectionService } from '../services/sectionService';

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
    if (window.confirm('Are you sure you want to delete this block?')) {
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
      alert('Layout saved successfully!');
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save layout.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-darker)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-main)', textTransform: 'capitalize', fontWeight: '700' }}>
          {sectionName.replace('-', ' ')} Grid
        </h3>
        <div>
          <button 
            onClick={addItem}
            className="btn-secondary"
            style={{ marginRight: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.8125rem' }}
          >
            + Add Box
          </button>
          <button 
            onClick={saveLayout}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.8125rem' }}
          >
            {isSaving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      <div style={{ minHeight: '400px', backgroundColor: 'var(--bg-dark)', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '10px' }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: items }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
        >
          {items.map(item => (
            <div 
              key={item.i} 
              data-grid={item}
              className="grid-item-container"
              style={{
                backgroundColor: item.imageUrl ? 'transparent' : 'var(--bg-darker)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              
              <div 
                className="grid-item-overlay"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(4px)',
                  opacity: 0, transition: 'all 0.3s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem',
                  zIndex: 10
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <button 
                  onClick={() => triggerImageSelect(item)}
                  style={{ padding: '0.625rem 1.25rem', background: 'white', color: 'var(--text-main)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: '700' }}
                >
                  {item.imageUrl ? 'Change Image' : 'Select Photo'}
                </button>
                <button 
                  onClick={() => deleteItem(item.i)}
                  style={{ padding: '0.625rem 1.25rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: '700' }}
                >
                  Delete Box
                </button>
              </div>
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
