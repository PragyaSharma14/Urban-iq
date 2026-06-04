import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ReportHistory() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/reports`);
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="mb-6">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">SYSTEM.ARCHIVE</h3>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mt-1">Intelligence Report Archive</h4>
        </header>

        <div className="bg-tactical border-technical overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-variant text-on-tertiary-container font-label-caps text-label-caps bg-surface-container-low">
                <th className="p-4 whitespace-nowrap">REF_ID</th>
                <th className="p-4">CITY</th>
                <th className="p-4">LOCATION_TYPE</th>
                <th className="p-4">SEVERITY</th>
                <th className="p-4">DATE</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono">
              {reports.map((report, idx) => (
                <tr key={report._id} className="border-b border-surface-variant hover:bg-surface-container transition-colors text-on-surface">
                  <td className="p-4 text-on-surface-variant text-[11px]">UIQ-{String(idx + 100).padStart(3, '0')}</td>
                  <td className="p-4 uppercase text-[12px]">{report.city || 'UNKNOWN'}</td>
                  <td className="p-4 uppercase text-[12px] text-on-surface-variant">{report.analysis?.location_type || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className={`w-2 h-2 shrink-0 ${report.analysis?.severity_score >= 7 ? 'bg-error' : 'bg-primary'}`}></span>
                      <span>{report.analysis?.severity_label || 'UNKNOWN'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant text-[11px]">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-on-surface-variant text-[12px]">
                    [ NO_ARCHIVES_FOUND ]
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
