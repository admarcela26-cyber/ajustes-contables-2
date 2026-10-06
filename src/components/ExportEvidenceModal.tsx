import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Building2, 
  User, 
  Award,
  Calendar
} from 'lucide-react';
import { SenaExerciseCase, WorksheetRow, WorksheetTotals, AdjustmentEntry } from '../types/accounting';
import { formatCurrency } from '../utils/worksheetCalculator';

interface ExportEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: SenaExerciseCase;
  rows: WorksheetRow[];
  totals: WorksheetTotals;
  adjustments: AdjustmentEntry[];
}

export const ExportEvidenceModal: React.FC<ExportEvidenceModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  rows,
  totals,
  adjustments,
}) => {
  const [apprenticeName, setApprenticeName] = useState('Aprendiz SENA TGSIF');
  const [documentId, setDocumentId] = useState('1.020.345.678');
  const [fichaNumber, setFichaNumber] = useState('2874102');
  const [centerName, setCenterName] = useState('Centro de Servicios Financieros');
  const [regional, setRegional] = useState('Regional Distrito Capital');

  if (!isOpen) return null;

  // CSV Generator
  const handleDownloadCsv = () => {
    const headers = [
      'Codigo PUC',
      'Cuenta Contable',
      'Bal Comprobacion Debito',
      'Bal Comprobacion Credito',
      'Ajustes Debito',
      'Ajustes Credito',
      'Bal Ajustado Debito',
      'Bal Ajustado Credito',
      'Est Resultados Debito',
      'Est Resultados Credito',
      'Sit Financiera Debito',
      'Sit Financiera Credito',
    ];

    const dataLines = rows.map((r) => [
      `"${r.code}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      r.initialDebit,
      r.initialCredit,
      r.adjustmentDebit,
      r.adjustmentCredit,
      r.adjustedDebit,
      r.adjustedCredit,
      r.incomeDebit,
      r.incomeCredit,
      r.balanceSheetDebit,
      r.balanceSheetCredit,
    ]);

    // Subtotals line
    dataLines.push([
      '"SUBTOTALES"',
      '"Sumas preliminares"',
      totals.initialDebit,
      totals.initialCredit,
      totals.adjustmentDebit,
      totals.adjustmentCredit,
      totals.adjustedDebit,
      totals.adjustedCredit,
      totals.incomeDebit,
      totals.incomeCredit,
      totals.balanceSheetDebit,
      totals.balanceSheetCredit,
    ]);

    // Net income line
    dataLines.push([
      '"RESULTADO"',
      `"Resultado del Ejercicio (${totals.netIncome >= 0 ? 'Utilidad' : 'Pérdida'})"`,
      0,
      0,
      0,
      0,
      0,
      0,
      totals.netIncome >= 0 ? totals.netIncome : 0,
      totals.netIncome < 0 ? Math.abs(totals.netIncome) : 0,
      totals.netIncome < 0 ? Math.abs(totals.netIncome) : 0,
      totals.netIncome >= 0 ? totals.netIncome : 0,
    ]);

    // Sumas iguales
    dataLines.push([
      '"SUMAS IGUALES"',
      '"Sumas iguales definitivas"',
      totals.initialDebit,
      totals.initialCredit,
      totals.adjustmentDebit,
      totals.adjustmentCredit,
      totals.adjustedDebit,
      totals.adjustedCredit,
      totals.netIncome >= 0 ? totals.incomeDebit + totals.netIncome : totals.incomeDebit,
      totals.netIncome < 0 ? totals.incomeCredit + Math.abs(totals.netIncome) : totals.incomeCredit,
      totals.netIncome < 0 ? totals.balanceSheetDebit + Math.abs(totals.netIncome) : totals.balanceSheetDebit,
      totals.netIncome >= 0 ? totals.balanceSheetCredit + totals.netIncome : totals.balanceSheetCredit,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...dataLines.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Hoja_de_Trabajo_SENA_${currentCase.companyName.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header no-print */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Generador de Evidencia de Aprendizaje SENA</h3>
              <p className="text-xs text-slate-300">
                Formato institucional de entrega para evaluación del Resultado de Aprendizaje
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apprentice Identification Form no-print */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 no-print space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            Datos de Identificación del Aprendiz:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Nombre y Apellidos:</label>
              <input
                type="text"
                value={apprenticeName}
                onChange={(e) => setApprenticeName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Cédula / Documento:</label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Ficha de Caracterización:</label>
              <input
                type="text"
                value={fichaNumber}
                onChange={(e) => setFichaNumber(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Centro de Formación:</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Regional SENA:</label>
              <input
                type="text"
                value={regional}
                onChange={(e) => setRegional(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="p-6 flex-1 space-y-6 print:p-0">
          {/* Official SENA Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-emerald-800 tracking-tight">SENA</span>
                <span className="text-slate-400">|</span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Servicio Nacional de Aprendizaje
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mt-1">
                TECNÓLOGO EN GESTIÓN CONTABLE Y DE INFORMACIÓN FINANCIERA (TGSIF)
              </p>
              <p className="text-[11px] text-slate-500">
                Evidencia de Desempeño y Producto: Hoja de Trabajo y Asientos de Ajuste Contable
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900">Fecha de Emisión:</span>
              <p className="font-mono text-slate-700">{new Date().toLocaleDateString('es-CO')}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 bg-slate-50 border border-slate-200 rounded">
            <div>
              <span className="text-slate-500 block">Aprendiz:</span>
              <span className="font-bold text-slate-900">{apprenticeName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Identificación:</span>
              <span className="font-bold text-slate-900">{documentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ficha SENA:</span>
              <span className="font-bold text-slate-900">{fichaNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Empresa Taller:</span>
              <span className="font-bold text-slate-900">{currentCase.companyName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">NIT Empresa:</span>
              <span className="font-bold text-slate-900">{currentCase.nit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Período Contable:</span>
              <span className="font-bold text-slate-900">{currentCase.period}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Centro / Regional:</span>
              <span className="font-bold text-slate-900">{centerName} / {regional}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Estado del Cuadre:</span>
              <span className={`font-bold ${totals.isOverallWorksheetBalanced ? 'text-emerald-700' : 'text-amber-700'}`}>
                {totals.isOverallWorksheetBalanced ? 'Cuadrado 100%' : 'Pendiente / Descuadrado'}
              </span>
            </div>
          </div>

          {/* Adjustments Summary */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Relación de Asientos de Ajuste Contabilizados ({adjustments.length})
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border border-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-800">
                  <tr>
                    <th className="p-1.5 border w-16">Código</th>
                    <th className="p-1.5 border">Descripción del Ajuste</th>
                    <th className="p-1.5 border w-32">Norma Aplicable</th>
                    <th className="p-1.5 border text-right w-24">Débitos</th>
                    <th className="p-1.5 border text-right w-24">Créditos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                  {adjustments.map((a) => {
                    const d = a.lines.reduce((acc, l) => acc + (l.debit || 0), 0);
                    const c = a.lines.reduce((acc, l) => acc + (l.credit || 0), 0);
                    return (
                      <tr key={a.id}>
                        <td className="p-1.5 font-bold">{a.codeNumber}</td>
                        <td className="p-1.5 font-sans font-medium">{a.title}</td>
                        <td className="p-1.5 font-sans text-slate-500 text-[9px]">{a.normativeReference}</td>
                        <td className="p-1.5 text-right">{formatCurrency(d)}</td>
                        <td className="p-1.5 text-right">{formatCurrency(c)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Executive Totals of the 10 Columns */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. Resumen Ejecutivo de la Hoja de Trabajo (10 Columnas)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-sans">1. Bal. Comprobación:</span>
                <span className="font-bold text-slate-900 block">{formatCurrency(totals.initialDebit)}</span>
                <span className="text-[9px] text-slate-400">Sumas Déb = Créd</span>
              </div>
              <div className="p-2 border rounded bg-emerald-50">
                <span className="text-[10px] text-emerald-800 block font-sans">2. Ajustes Período:</span>
                <span className="font-bold text-emerald-900 block">{formatCurrency(totals.adjustmentDebit)}</span>
                <span className="text-[9px] text-emerald-700">Partida Doble</span>
              </div>
              <div className="p-2 border rounded bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-sans">3. Bal. Ajustado:</span>
                <span className="font-bold text-slate-900 block">{formatCurrency(totals.adjustedDebit)}</span>
                <span className="text-[9px] text-slate-400">Saldos Definitivos</span>
              </div>
              <div className="p-2 border rounded bg-blue-50">
                <span className="text-[10px] text-blue-800 block font-sans">4. Resultado Ejercicio:</span>
                <span className="font-bold text-blue-900 block">{formatCurrency(Math.abs(totals.netIncome))}</span>
                <span className="text-[9px] text-blue-700">{totals.netIncome >= 0 ? 'Utilidad Neta' : 'Pérdida Neta'}</span>
              </div>
              <div className="p-2 border rounded bg-indigo-50">
                <span className="text-[10px] text-indigo-800 block font-sans">5. Situación Financiera:</span>
                <span className="font-bold text-indigo-900 block">
                  {formatCurrency(totals.netIncome < 0 ? totals.balanceSheetDebit + Math.abs(totals.netIncome) : totals.balanceSheetDebit)}
                </span>
                <span className="text-[9px] text-indigo-700">Activo = Pas + Pat</span>
              </div>
            </div>
          </div>

          {/* Signatures for SENA evaluation */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-900 w-48 mx-auto mb-1"></div>
              <p className="font-bold text-slate-900">{apprenticeName}</p>
              <p className="text-slate-500 text-[10px]">C.C. {documentId}</p>
              <p className="text-slate-500 text-[10px]">ELABORÓ: Aprendiz SENA</p>
            </div>
            <div>
              <div className="border-b border-slate-900 w-48 mx-auto mb-1"></div>
              <p className="font-bold text-slate-900">Instructor de Gestión Contable</p>
              <p className="text-slate-500 text-[10px]">Coordinación Académica TGSIF</p>
              <p className="text-slate-500 text-[10px]">EVALUÓ: Instructor SENA</p>
            </div>
          </div>
        </div>

        {/* Action bar no-print */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-white"
          >
            Cerrar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar a Excel / CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
