'use client';

import { Files, Plus, Download } from 'lucide-react';

export default function FilesTab({ files, onFileUpload }) {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Project Assets</h2>
        <label className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.75rem', cursor: 'pointer' }}>
          <Plus size={16} />
          <span>Upload File</span>
          <input type="file" hidden onChange={onFileUpload} />
        </label>
      </div>

      <div className="scroll-container">
        <div className="glass" style={{ padding: 0, minWidth: '800px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg-dark)' }}>
                <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.625rem' }}>File Name</th>
                <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.625rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.625rem' }}>Size</th>
                <th style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.625rem' }}>Uploaded On</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? files.map((file) => (
                <tr key={file._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="list-item-hover">
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Files size={14} style={{ color: 'var(--primary)' }} />
                      {file.originalName}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(67, 56, 202, 0.08)', color: 'var(--primary)', fontWeight: '800' }}>{file.tag}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <a href={`https://sangabriel-portal.onrender.com${file.url}`} download target="_blank" style={{ color: 'var(--primary)' }}>
                      <Download size={16} />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                       <Files size={32} style={{ opacity: 0.1 }} />
                       <p style={{ fontSize: '0.8125rem' }}>No files found for this project.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
