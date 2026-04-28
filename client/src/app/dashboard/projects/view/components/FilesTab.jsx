'use client';

import { Files, Plus, Download, FileText, ChevronRight } from 'lucide-react';
import Card from '../../../../../components/ui/Card';

export default function FilesTab({ files, onFileUpload }) {
  return (
    <div className="fade-in space-y-6 sm:space-y-8 px-2 sm:px-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">Project Assets</h2>
          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
            <span className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Repository Oversight</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-[8px] sm:text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Documents & Media</span>
          </div>
        </div>
        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/20 cursor-pointer transition-all active:scale-95 group">
          <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:rotate-90 transition-transform duration-300" />
          <span>Upload Asset</span>
          <input type="file" hidden onChange={onFileUpload} />
        </label>
      </header>

      <Card variant="glass" padding="p-0 overflow-hidden" className="border-gray-100 shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">File Intelligence</th>
                <th className="px-6 py-5 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Classification</th>
                <th className="px-6 py-5 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Capacity</th>
                <th className="px-6 py-5 text-left text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Initialized</th>
                <th className="px-6 py-5 text-right text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Controls</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? files.map((file) => (
                <tr key={file._id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-5 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <FileText size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-gray-900 truncate max-w-[200px] sm:max-w-[300px]" title={file.originalName}>
                          {file.originalName}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Asset-ID: {file._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-50">
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                      {file.tag || 'GENERAL'}
                    </span>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-50 text-[11px] font-bold text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </td>
                  <td className="px-6 py-5 border-b border-gray-50 text-[11px] font-bold text-gray-500">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 border-b border-gray-50 text-right">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_SERVICE_URL || 'https://sangabriel-portal.onrender.com'}${file.url}`} 
                      download 
                      target="_blank" 
                      className="inline-flex size-10 rounded-xl items-center justify-center text-gray-400 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100"
                    >
                      <Download size={18} strokeWidth={2.5} />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-6 opacity-20">
                       <Files size={64} strokeWidth={1} />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">No repository assets detected.</p>
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
