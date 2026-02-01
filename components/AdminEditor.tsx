import React, { useState, useRef, useMemo } from 'react';
import { SiteContent } from '../types';
import { X, Save, Upload, Trash2, Plus, Copy, Check, Info, Database, Settings } from 'lucide-react';

interface AdminEditorProps {
  content: SiteContent;
  onSave: (newContent: SiteContent) => void;
  onClose: () => void;
}

export const AdminEditor: React.FC<AdminEditorProps> = ({ content, onSave, onClose }) => {
  const [formData, setFormData] = useState<SiteContent>(content);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate approximate size of the JSON payload
  const dataSizeInfo = useMemo(() => {
    const jsonString = JSON.stringify(formData);
    const bytes = new TextEncoder().encode(jsonString).length;
    const kb = (bytes / 1024).toFixed(1);
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    
    // Thresholds: Warning at 1.5MB, Danger at 3MB
    let status: 'good' | 'warning' | 'danger' = 'good';
    if (bytes > 3 * 1024 * 1024) status = 'danger';
    else if (bytes > 1.5 * 1024 * 1024) status = 'warning';

    return { size: bytes > 1024 * 1024 ? `${mb} MB` : `${kb} KB`, status };
  }, [formData]);

  const handleChange = (section: keyof SiteContent, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: keyof SiteContent, index: number, value: string) => {
    setFormData(prev => {
        const sectionData = prev[section] as any;
        const newItems = [...sectionData.items];
        newItems[index] = value;
        return {
            ...prev,
            [section]: {
                ...sectionData,
                items: newItems
            }
        }
    });
  };

  const handleAddItem = (section: keyof SiteContent) => {
     setFormData(prev => {
        const sectionData = prev[section] as any;
        return {
            ...prev,
            [section]: {
                ...sectionData,
                items: [...sectionData.items, "New Item"]
            }
        }
    });
  };
  
  const handleRemoveItem = (section: keyof SiteContent, index: number) => {
     setFormData(prev => {
        const sectionData = prev[section] as any;
        const newItems = sectionData.items.filter((_: any, i: number) => i !== index);
        return {
            ...prev,
            [section]: {
                ...sectionData,
                items: newItems
            }
        }
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic check for file size before processing
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large (over 2MB). Please compress it before uploading to keep the site fast.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            images: [...prev.hero.images, base64String]
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: prev.hero.images.filter((_, i) => i !== index)
      }
    }));
  };

  const handleCopyJSON = async () => {
    // Clean formatting for copy-paste into code
    const jsonString = JSON.stringify(formData, null, 2);
    // Wrap in the constant export format for easier pasting
    const exportString = `/* Paste this into constants.ts replacing DEFAULT_CONTENT */\n\nexport const DEFAULT_CONTENT: SiteContent = ${jsonString};`;

    try {
      await navigator.clipboard.writeText(exportString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = exportString;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-neutral-950 text-white overflow-y-auto p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* HEADER TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-neutral-950/95 p-4 border-b border-neutral-800 backdrop-blur-md z-50 gap-4">
          <div>
              <h2 className="text-sm tracking-widest font-mono text-[#C5A265] flex items-center gap-2">
                  <Settings size={14} /> CMS EDITOR
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] text-neutral-500">Changes are saved locally.</p>
                
                {/* Data Size Indicator */}
                <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${
                    dataSizeInfo.status === 'danger' ? 'border-red-900 bg-red-900/20 text-red-400' :
                    dataSizeInfo.status === 'warning' ? 'border-yellow-900 bg-yellow-900/20 text-yellow-400' :
                    'border-green-900 bg-green-900/20 text-green-400'
                }`}>
                    <Database size={10} />
                    <span className="font-mono">{dataSizeInfo.size}</span>
                </div>
              </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button onClick={handleCopyJSON} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border ${copied ? 'border-green-500 text-green-500' : 'border-neutral-700 hover:border-[#C5A265] hover:text-[#C5A265]'} text-xs tracking-wider transition-all`}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'COPIED!' : 'COPY JSON'}
            </button>
            <button onClick={() => onSave(formData)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#C5A265] text-black hover:bg-white text-xs tracking-wider font-bold transition-colors">
              <Save size={14} /> SAVE LOCAL
            </button>
            <button onClick={onClose} className="flex-none flex items-center justify-center gap-2 px-4 py-2 border border-neutral-800 hover:bg-neutral-800 text-xs tracking-wider transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* GUIDE MESSAGE */}
        <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded flex gap-4 items-start">
            <Info className="shrink-0 text-[#C5A265] mt-1" size={16} />
            <div className="text-xs text-neutral-400 leading-relaxed">
                <strong className="text-white block mb-1">How to update the live site:</strong>
                1. Edit content and upload images here.<br/>
                2. Check the data size indicator above. (Keep it green/yellow for speed)<br/>
                3. Click <strong>"COPY JSON"</strong> to copy the configuration code.<br/>
                4. Open <code>constants.ts</code> in your source code.<br/>
                5. Replace the existing <code>DEFAULT_CONTENT</code> with your clipboard content.<br/>
                6. Deploy your site updates.
            </div>
        </div>

        {/* HERO SECTION */}
        <section className="space-y-4 border border-neutral-800 p-6 md:p-8 bg-neutral-900/20">
          <h3 className="text-xs font-mono text-neutral-500 mb-6 border-b border-neutral-800 pb-2">HERO / IMAGERY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Name (JP)</label>
              <input type="text" value={formData.hero.nameJa} onChange={e => handleChange('hero', 'nameJa', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm focus:border-[#C5A265] outline-none transition-colors text-white" />
            </div>
             <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Name (EN)</label>
              <input type="text" value={formData.hero.nameEn} onChange={e => handleChange('hero', 'nameEn', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm focus:border-[#C5A265] outline-none transition-colors text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Title</label>
              <input type="text" value={formData.hero.title} onChange={e => handleChange('hero', 'title', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm focus:border-[#C5A265] outline-none transition-colors text-white" />
            </div>
             <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Subtitle</label>
              <input type="text" value={formData.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 text-sm focus:border-[#C5A265] outline-none transition-colors text-white" />
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-800">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-4">Gallery / Background Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {formData.hero.images.map((img, i) => (
                    <div key={i} className="relative aspect-square group overflow-hidden rounded-sm bg-neutral-950 border border-neutral-800 cursor-pointer">
                        <img 
                            src={img} 
                            alt="" 
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-out" 
                        />
                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-900/80 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700 rounded-sm">
                            <X size={10} />
                        </button>
                        <div className="absolute bottom-1 left-1 text-[8px] bg-black/50 px-1 text-neutral-400">{i+1}</div>
                    </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="aspect-square border border-dashed border-neutral-700 bg-neutral-900/30 flex flex-col items-center justify-center text-neutral-600 hover:text-[#C5A265] hover:border-[#C5A265] hover:bg-neutral-900 transition-all">
                    <Upload size={16} className="mb-2" />
                    <span className="text-[9px]">UPLOAD</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <p className="text-[10px] text-neutral-600 mt-2">* Images are converted to Base64 code. Please compress images (use JPG/WebP, &lt; 500KB) to avoid large file sizes.</p>
          </div>
        </section>

        {/* INTRO */}
        <section className="space-y-4 border border-neutral-800 p-6 md:p-8 bg-neutral-900/20">
             <h3 className="text-xs font-mono text-neutral-500 mb-6 border-b border-neutral-800 pb-2">INTRODUCTION</h3>
             <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Main Body</label>
                <textarea value={formData.intro.body} onChange={e => handleChange('intro', 'body', e.target.value)} className="w-full h-40 bg-neutral-950 border border-neutral-800 p-4 text-sm font-sans focus:border-[#C5A265] outline-none text-white" placeholder="Body text..." />
             </div>
             <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Highlight Quote</label>
                <textarea value={formData.intro.highlight} onChange={e => handleChange('intro', 'highlight', e.target.value)} className="w-full h-24 bg-neutral-950 border border-neutral-800 p-4 text-sm font-serif italic focus:border-[#C5A265] outline-none text-[#C5A265]" placeholder="Highlight quote..." />
             </div>
        </section>

        {/* GENERIC LIST SECTIONS */}
        {['whatIDo', 'stance', 'skills', 'values', 'personality'].map((key) => {
            const sectionKey = key as keyof SiteContent;
            const sectionData = formData[sectionKey] as any;
            
            return (
                <section key={key} className="space-y-4 border border-neutral-800 p-6 md:p-8 bg-neutral-900/20">
                    <h3 className="text-xs font-mono text-neutral-500 mb-4 uppercase border-b border-neutral-800 pb-2">{key}</h3>
                    <input type="text" value={sectionData.title} onChange={e => handleChange(sectionKey, 'title', e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 mb-4 text-sm focus:border-[#C5A265] outline-none text-white font-serif" />
                    
                    <div className="space-y-2 pl-4 border-l border-neutral-800">
                        {sectionData.items?.map((item: string, i: number) => (
                            <div key={i} className="flex gap-2 group">
                                <span className="text-neutral-600 font-mono text-xs pt-3">{i+1}.</span>
                                <input type="text" value={item} onChange={e => handleArrayChange(sectionKey, i, e.target.value)} className="flex-1 bg-transparent border-b border-neutral-800 p-2 text-sm focus:border-[#C5A265] outline-none transition-colors text-white/80 focus:text-white" />
                                <button onClick={() => handleRemoveItem(sectionKey, i)} className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 px-2"><Trash2 size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => handleAddItem(sectionKey)} className="mt-4 flex items-center gap-2 text-neutral-500 text-xs hover:text-[#C5A265] transition-colors"><Plus size={12} /> ADD ITEM</button>
                    </div>

                    {sectionKey === 'whatIDo' && (
                        <div className="mt-6">
                            <label className="text-[10px] uppercase text-neutral-500">Note</label>
                            <textarea value={formData.whatIDo.note} onChange={e => handleChange('whatIDo', 'note', e.target.value)} className="w-full h-20 bg-neutral-950 border border-neutral-800 p-3 mt-2 text-sm focus:border-[#C5A265] outline-none text-white" />
                        </div>
                    )}
                    {sectionKey === 'stance' && (
                        <div className="mt-6">
                            <label className="text-[10px] uppercase text-neutral-500">Conclusion</label>
                            <textarea value={formData.stance.conclusion} onChange={e => handleChange('stance', 'conclusion', e.target.value)} className="w-full h-20 bg-neutral-950 border border-neutral-800 p-3 mt-2 text-sm focus:border-[#C5A265] outline-none text-white" />
                        </div>
                    )}
                </section>
            );
        })}

        {/* FOOTER & COPY */}
        <section className="space-y-4 border border-neutral-800 p-6 md:p-8 bg-neutral-900/20">
            <h3 className="text-xs font-mono text-neutral-500 mb-6 border-b border-neutral-800 pb-2">CLOSING</h3>
            <div>
                <label className="text-[10px] uppercase text-neutral-500">Main Copy</label>
                <textarea value={formData.copy.main} onChange={e => handleChange('copy', 'main', e.target.value)} className="w-full h-24 bg-neutral-950 border border-neutral-800 p-3 mt-2 text-lg font-serif focus:border-[#C5A265] outline-none text-white" />
            </div>
            <div className="mt-6">
                <label className="text-[10px] uppercase text-neutral-500">Footer Message</label>
                <textarea value={formData.footer.message} onChange={e => handleChange('footer', 'message', e.target.value)} className="w-full h-24 bg-neutral-950 border border-neutral-800 p-3 mt-2 text-sm focus:border-[#C5A265] outline-none text-white" />
            </div>
        </section>

      </div>
    </div>
  );
};