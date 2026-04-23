'use client';

import { Files, Plus, Download, FileText } from 'lucide-react';
import Card from '../../../../../components/ui/Card';

export default function FilesTab({ files, onFileUpload }) {
  return (
    <div className="fade-in space-y-6">
      <header className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight">Project Assets</h2>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">Documents, Blueprints & Media</p>
        </div>
        <label className="btn btn-primary px-6 shadow-lg shadow-indigo-500/20 cursor-pointer">
          <Plus size={18} />
          <span>UPLOAD ASSET</span>
          <input type="file" hidden onChange={onFileUpload} />
        </label>
      </header>

      <Card className="p-0 overflow-hidden">
        <div className="table-container border-none rounded-none">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-dark/50 border-b border-border">
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">File Name</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Category</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Size</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Uploaded On</th>
                <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? files.map((file) => (
                <tr key={file._id} className="table-row group">
                  <td className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-black text-main truncate max-w-[300px]" title={file.originalName}>
                        {file.originalName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-primary text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                      {file.tag}
                    </span>
                  </td>
                  <td className="p-4 border-b border-border text-xs font-bold text-secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </td>
                  <td className="p-4 border-b border-border text-xs font-bold text-secondary">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b border-border text-right">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_SERVICE_URL || 'https://sangabriel-portal.onrender.com'}${file.url}`} 
                      download 
                      target="_blank" 
                      className="inline-flex size-9 rounded-lg items-center justify-center text-muted hover:bg-primary hover:text-white transition-all"
                    >
                      <Download size={18} />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center opacity-40">
                    <div className="flex flex-col items-center justify-center gap-4">
                       <Files size={64} className="text-muted" />
                       <p className="text-xs font-black uppercase tracking-widest">No project assets found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
