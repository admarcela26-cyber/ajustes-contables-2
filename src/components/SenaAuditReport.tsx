import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X,
  FileCheck,
  Scale
} from 'lucide-react';
import { SenaAuditResult } from '../types/accounting';

interface SenaAuditReportProps {
  isOpen: boolean;
  onClose: () => void;
  audit: SenaAuditResult;
}

export const SenaAuditReport: React.FC<SenaAuditReportProps> = ({
  isOpen,
  onClose,
  audit,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Auditoría Pedagógica del Instructor SENA
              </h3>
              <p className="text-xs text-slate-300">
                Juicio de Evaluación y Verificación de Competencia Contable (TGSIF)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Summary Banner */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center font-extrabold ${getScoreColor(audit.score)}`}>
              <span className="text-2xl leading-none">{audit.score}</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold">de 100</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Juicio Evaluativo SENA:
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                {audit.qualification}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                {audit.summary}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Blocks Checklist */}
        <div className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-emerald-600" />
            Matriz de Verificación de los 5 Bloques de la Hoja de Trabajo:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {/* 1. Bal Comprobacion */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              audit.balancedBlocks.initial ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <p className="font-semibold text-slate-900">1. Balance Comprobación</p>
                <p className="text-[11px] text-slate-500">Sumas Débitos = Créditos</p>
              </div>
              {audit.balancedBlocks.initial ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
            </div>

            {/* 2. Ajustes */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              audit.balancedBlocks.adjustments ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <p className="font-semibold text-slate-900">2. Asientos de Ajuste</p>
                <p className="text-[11px] text-slate-500">Partida doble en ajustes</p>
              </div>
              {audit.balancedBlocks.adjustments ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
            </div>

            {/* 3. Bal Ajustado */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              audit.balancedBlocks.adjusted ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <p className="font-semibold text-slate-900">3. Balance Ajustado</p>
                <p className="text-[11px] text-slate-500">Saldos según naturaleza</p>
              </div>
              {audit.balancedBlocks.adjusted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
            </div>

            {/* 4. Est Resultados */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              audit.balancedBlocks.results ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div>
                <p className="font-semibold text-slate-900">4. Estado de Resultados</p>
                <p className="text-[11px] text-slate-500">Clases 4, 5, 6 + Utilidad</p>
              </div>
              {audit.balancedBlocks.results ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
            </div>

            {/* 5. Sit Financiera */}
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              audit.balancedBlocks.balanceSheet ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div>
                <p className="font-semibold text-slate-900">5. Situación Financiera</p>
                <p className="text-[11px] text-slate-500">Clases 1, 2, 3 + Patrimonio</p>
              </div>
              {audit.balancedBlocks.balanceSheet ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
            </div>
          </div>

          {/* Observations and issues list */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Dictamen y Recomendaciones Formativas:
            </h4>

            <div className="space-y-2">
              {audit.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs ${
                    issue.type === 'SUCCESS'
                      ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                      : issue.type === 'WARNING'
                      ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {issue.type === 'SUCCESS' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : issue.type === 'WARNING' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{issue.title}</span>
                  </div>
                  <p className="mt-1 text-slate-700">{issue.description}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    <strong>Recomendación del Instructor:</strong> {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Entendido, volver a la Hoja de Trabajo
          </button>
        </div>
      </div>
    </div>
  );
};
