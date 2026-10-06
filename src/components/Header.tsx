import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  FileSpreadsheet, 
  RotateCcw,
  Building2,
  HelpCircle
} from 'lucide-react';
import { SenaExerciseCase, WorksheetTotals } from '../types/accounting';

interface HeaderProps {
  currentCase: SenaExerciseCase;
  cases: SenaExerciseCase[];
  onSelectCase: (caseId: string) => void;
  totals: WorksheetTotals;
  onOpenCalculator: () => void;
  onOpenAudit: () => void;
  onOpenGuide: () => void;
  onOpenExport: () => void;
  onResetCase: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  cases,
  onSelectCase,
  totals,
  onOpenCalculator,
  onOpenAudit,
  onOpenGuide,
  onOpenExport,
  onResetCase,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top institutional strip */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="font-semibold text-emerald-400">SENA</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200 font-medium">Tecnólogo en Gestión Contable y de Información Financiera</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Competencia: Elaborar Estados Financieros y Cierre Contable</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span>Ambiente de Aprendizaje Virtual</span>
          <span className="text-slate-500">·</span>
          <span>NIIF para Pymes / Dcto. 2420</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Active Case Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            HT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Simulador de Hoja de Trabajo y Ajustes
              </h1>
              <span className="text-xs text-slate-500 hidden sm:inline">· Versión Didáctica SENA</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">{currentCase.companyName}</span>
              <span className="text-slate-300">|</span>
              <span>NIT: {currentCase.nit}</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-medium">{currentCase.period}</span>
            </div>
          </div>
        </div>

        {/* Case selector & Quick status indicator */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Case Dropdown */}
          <div className="relative">
            <select
              value={currentCase.id}
              onChange={(e) => onSelectCase(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Balance status indicator */}
          <div 
            onClick={onOpenAudit}
            className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              totals.isOverallWorksheetBalanced
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
            title="Click para ver auditoría del instructor"
          >
            {totals.isOverallWorksheetBalanced ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hoja Cuadrada (100%)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pendiente Ajustes / Descuadre</span>
              </>
            )}
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={onOpenCalculator}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Calculadora pedagógica de depreciación, diferidos e intereses"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Calculadora</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Auditoría formativa y rúbrica SENA"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Auditoría SENA</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Guía conceptual de ajustes contables"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Guía NIIF</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Generar evidencia de aprendizaje SENA / Exportar reporte"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-100" />
            <span>Evidencia SENA</span>
          </button>

          <button
            onClick={onResetCase}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Restablecer caso al estado inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
