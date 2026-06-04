import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import IndiaMap from './IndiaMap';

const API_URL = 'http://localhost:5000/api';

export default function ReportGenerator() {
  const [images, setImages] = useState([]);
  const [context, setContext] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const loadingMessages = [
    "INITIALIZING INFRA-SCAN...",
    "ANALYSING IMAGE DATA...",
    "CALCULATING SEVERITY INDEX...",
    "CROSS-REFERENCING SCHEMES...",
    "COMPILING OFFICIAL REPORT..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    images.forEach(img => formData.append('images', img));
    formData.append('context', context);
    formData.append('city', city);
    formData.append('lat', '28.6139');
    formData.append('lng', '77.2090');

    try {
      const res = await axios.post(`${API_URL}/analyze`, formData);
      setReport(res.data.report);
      
      if (res.data.report && city) {
        await axios.post(`${API_URL}/pins`, {
          city,
          lat: 28.6139 + (Math.random() - 0.5) * 5,
          lng: 77.2090 + (Math.random() - 0.5) * 5,
          problem_type: res.data.report.location_type || 'infrastructure',
          description: res.data.report.pitch_line || 'Reported via UrbanIQ'
        }).catch(err => console.error("Pin creation failed", err));
      }
    } catch (err) {
      setError('Analysis failed. Check if backend is running and Groq API key is valid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("URBAN INFRASTRUCTURE REDEVELOPMENT REPORT", 20, 20);
    doc.setFontSize(14);
    doc.text(`Location Type: ${report.location_type || 'N/A'}`, 20, 35);
    doc.text(`Severity: ${report.severity_label || 'N/A'} (${report.severity_score || '?'}/10)`, 20, 45);
    doc.text(`Contractor Type: ${report.contractor_type || 'N/A'}`, 20, 55);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text("ROOT CAUSE:", 20, 70);
    const splitRoot = doc.splitTextToSize(report.root_cause || 'N/A', 170);
    doc.text(splitRoot, 20, 77);
    
    doc.text("IMMEDIATE ACTIONS:", 20, 77 + (splitRoot.length * 7) + 10);
    const actions = report.immediate_actions || [];
    actions.forEach((act, idx) => {
      doc.text(`• ${act}`, 25, 77 + (splitRoot.length * 7) + 17 + (idx * 7));
    });

    let currentY = 77 + (splitRoot.length * 7) + 17 + (actions.length * 7) + 10;
    doc.text("GOVERNMENT SCHEMES:", 20, currentY);
    const schemes = report.applicable_schemes || [];
    schemes.forEach((sch, idx) => {
      doc.text(`• ${sch}`, 25, currentY + 7 + (idx * 7));
    });
    
    doc.save("UrbanIQ_Report.pdf");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      <section className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-surface-container-lowest order-2 lg:order-1">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Report Generator Panel */}
          <div className="bg-tactical border-technical p-4 md:p-6">
            <header className="flex items-center justify-between mb-6">
              <h3 className="font-label-caps text-label-caps text-primary">REPORT GENERATOR // SYSTEM.INFRA_CORE</h3>
              <span className="text-data-mono font-data-mono text-[10px] text-on-surface-variant hidden sm:block">v2.4.0_STABLE</span>
            </header>
            
            {error && <div className="mb-4 text-error font-data-mono text-[12px] p-2 bg-error-container text-on-error-container rounded">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Upload Zone */}
              <div className="border-2 border-dashed border-surface-variant flex flex-col items-center justify-center p-8 bg-surface-dim hover:bg-surface-container transition-colors relative group min-h-[200px]">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                
                {images.length === 0 ? (
                  <>
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary mb-2 transition-colors">add_a_photo</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-center transition-colors group-hover:text-primary">UPLOAD SOURCE IMAGES (1-5)</span>
                    <span className="text-data-mono font-data-mono text-[10px] text-on-tertiary-container mt-1">
                      .RAW .TIFF .JPG SUPPORTED
                    </span>
                  </>
                ) : (
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 z-10 pointer-events-none">
                    {images.map((file, idx) => (
                      <div key={idx} className="aspect-video bg-black border border-surface-variant relative overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full opacity-80" />
                      </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-surface-container/80 transition-opacity">
                      <span className="font-label-caps text-label-caps text-primary bg-tactical px-4 py-2 border border-primary">CLICK TO CHANGE IMAGES</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Context Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">LOCATION CONTEXT</label>
                  <input 
                    className="w-full bg-surface-dim border-b border-surface-variant focus:border-primary outline-none py-2 px-2 font-data-mono text-data-mono text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
                    placeholder="ENTER GPS OR NEIGHBORHOOD NAME..." 
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">CITY SELECTION</label>
                  <input 
                    className="w-full bg-surface-dim border-b border-surface-variant focus:border-primary outline-none py-2 px-2 font-data-mono text-data-mono text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
                    placeholder="e.g. MUMBAI_REGIONAL" 
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest hover:bg-surface-tint active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50 relative overflow-hidden"
                >
                  <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'analytics'}</span>
                  {loading ? (
                    <span className="animate-pulse">{loadingMessages[loadingStep]}</span>
                  ) : (
                    'ANALYSE INFRASTRUCTURE'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Official Report Card */}
          {report && (
            <div className="bg-tactical border-technical overflow-hidden mt-8">
              <div className={`h-2 ${report.severity_score >= 7 ? 'bg-error' : (report.severity_score >= 4 ? 'bg-error-container' : 'bg-primary')}`}></div>
              <div className="p-4 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-surface-variant pb-4 mb-6 gap-4">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase font-bold">Official Intelligence Report</h2>
                    <p className="font-data-mono text-data-mono text-on-surface-variant">REF_ID: UIQ-{Math.floor(Math.random()*1000)}-ALPHA-X</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-label-caps text-label-caps text-on-surface-variant">DATE GENERATED</p>
                    <p className="font-data-mono text-data-mono text-on-surface">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
                  <div className="col-span-1 md:col-span-4 space-y-4">
                    <div>
                      <label className="font-label-caps text-label-caps text-on-tertiary-container block">SEVERITY INDEX</label>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className={`w-full h-2 ${i < report.severity_score ? (report.severity_score >= 7 ? 'bg-error' : 'bg-primary') : 'bg-surface-variant'}`}></div>
                        ))}
                        <span className={`font-data-mono text-data-mono ml-2 ${report.severity_score >= 7 ? 'text-error' : 'text-primary'}`}>
                          {String(report.severity_score).padStart(2, '0')}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-tertiary-container block">LOCATION TYPE</label>
                      <span className="font-data-mono text-data-mono text-on-surface uppercase">{report.location_type || 'UNKNOWN'}</span>
                    </div>
                    <div>
                      <label className="font-label-caps text-label-caps text-on-tertiary-container block">CONTRACTOR REQ.</label>
                      <span className="font-data-mono text-data-mono text-on-surface uppercase">{report.contractor_type || 'UNKNOWN'}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-8 space-y-6">
                    <div className={`bg-surface-dim border-l-4 ${report.severity_score >= 7 ? 'border-error' : 'border-primary'} p-4`}>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                        {report.pitch_line || 'CRITICAL SYSTEM FAILURE DETECTED: IMMEDIATE INTERVENTION REQUIRED'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-label-caps text-label-caps text-on-tertiary-container block border-b border-surface-variant pb-1 mb-2">ROOT CAUSE ANALYSIS</label>
                        <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">{report.root_cause}</p>
                      </div>
                      <div>
                        <label className="font-label-caps text-label-caps text-on-tertiary-container block border-b border-surface-variant pb-1 mb-2">PROJECT PHASES</label>
                        <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                          {(report.phases || []).map(p => `${String(p.phase).padStart(2, '0')}: ${p.title}`).join(' | ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-6 border-t border-surface-variant">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">CORRECTIVE ACTIONS</label>
                    <ul className="font-data-mono text-data-mono text-on-surface space-y-1.5">
                      {(report.immediate_actions || []).map((act, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 mt-1.5 bg-error shrink-0"></span>
                          <span className="break-all">{act.toUpperCase().replace(/\s+/g, '_')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-tertiary-container block mb-2">GOVERNMENT SCHEMES</label>
                    <p className="text-body-sm font-body-sm text-on-surface mb-4">
                      {(report.applicable_schemes || []).join(' | ')}
                    </p>
                    <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                      DOWNLOAD PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Right Column: Community Pins (Map) */}
      <IndiaMap />
    </div>
  );
}
