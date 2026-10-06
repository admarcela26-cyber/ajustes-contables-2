/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SENA_CASES } from './data/senaCases';
import { 
  AdjustmentEntry, 
  SenaExerciseCase, 
  WorksheetRow, 
  WorksheetTotals 
} from './types/accounting';
import { calculateWorksheet, formatCurrency } from './utils/worksheetCalculator';
import { Header } from './components/Header';
import { WorksheetTable } from './components/WorksheetTable';
import { AdjustmentJournal } from './components/AdjustmentJournal';
import { AdjustmentCalculatorModal } from './components/AdjustmentCalculatorModal';
import { SenaAuditReport } from './components/SenaAuditReport';
import { PedagogicalGuide } from './components/PedagogicalGuide';
import { ExportEvidenceModal } from './components/ExportEvidenceModal';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  TableProperties, 
  BookOpen, 
  Calculator, 
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SENA_CASES[0].id);
  const [adjustments, setAdjustments] = useState<AdjustmentEntry[]>([]);
  const [activeView, setActiveView] = useState<'worksheet' | 'journal' | 'both'>('worksheet');
  const [showCaseInstructions, setShowCaseInstructions] = useState(true);

  // Modal triggers
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const currentCase = useMemo(() => {
    return SENA_CASES.find((c) => c.id === selectedCaseId) || SENA_CASES[0];
  }, [selectedCaseId]);

  // Compute live worksheet data
  const { rows, totals, audit } = useMemo(() => {
    return calculateWorksheet(currentCase.initialAccounts, adjustments);
  }, [currentCase, adjustments]);

  // Change Case handler
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setAdjustments([]); // Reset adjustments for new case
  };

  // Reset case
  const handleResetCase = () => {
    if (window.confirm('¿Desea restablecer todos los ajustes registrados para este caso?')) {
      setAdjustments([]);
    }
  };

  // Add adjustment
  const handleAddAdjustment = (entry: AdjustmentEntry) => {
    setAdjustments((prev) => [...prev, entry]);
  };

  // Remove adjustment
  const handleRemoveAdjustment = (id: string) => {
    setAdjustments((prev) => prev.filter((a) => a.id !== id));
  };

  // Load single suggested adjustment
  const handleLoadSuggestedAdjustment = (index: number) => {
    const sug = currentCase.suggestedAdjustments[index];
    if (!sug) return;
    const newEntry: AdjustmentEntry = {
      ...sug,
      id: `sug-${Date.now()}-${index}`,
    };
    setAdjustments((prev) => [...prev, newEntry]);
  };

  // Load all suggested adjustments
  const handleLoadAllSuggested = () => {
    const newEntries: AdjustmentEntry[] = currentCase.suggestedAdjustments.map((sug, idx) => ({
      ...sug,
      id: `sug-${Date.now()}-${idx}`,
    }));
    setAdjustments(newEntries);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Institutional Top Bar */}
      <Header
        currentCase={currentCase}
        cases={SENA_CASES}
        onSelectCase={handleSelectCase}
        totals={totals}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetCase={handleResetCase}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Case Context & Pedagogical Instructions Accordion */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div 
            onClick={() => setShowCaseInstructions(!showCaseInstructions)}
            className="p-4 bg-slate-50/90 cursor-pointer flex items-center justify-between border-b border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                SENA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Taller Formativo: {currentCase.title}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                    Dificultad: {currentCase.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Período: {currentCase.period} · Empresa: {currentCase.companyName} (NIT: {currentCase.nit})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {showCaseInstructions ? 'Ocultar orientaciones' : 'Ver orientaciones'}
              </span>
              {showCaseInstructions ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </div>

          {showCaseInstructions && (
            <div className="p-4 space-y-3 bg-white text-xs">
              <p className="text-slate-700 leading-relaxed">
                <strong>Contexto del Caso:</strong> {currentCase.context}
              </p>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  Instrucciones Paso a Paso para el Aprendiz:
                </span>
                <ul className="space-y-1 text-slate-600 list-disc pl-5">
                  {currentCase.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap items-center justify-between pt-1 gap-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>💡 Tip:</span>
                  <span>
                    Use la <strong>Calculadora</strong> para liquidar cuotas de depreciación o diferidos con fórmulas exactas.
                  </span>
                </div>
                {adjustments.length === 0 && (
                  <button
                    onClick={handleLoadAllSuggested}
                    className="text-xs font-semibold px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Cargar Ajustes del Caso para Estudio</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Live Financial Metrics Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Balance Inicial */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">1. Balance Comprobación</span>
            <div className="text-base font-extrabold font-mono text-slate-900 mt-0.5">
              {formatCurrency(totals.initialDebit)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Partida Doble Inicial</span>
            </div>
          </div>

          {/* Card 2: Ajustes Totales */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">2. Ajustes Aplicados</span>
            <div className="text-base font-extrabold font-mono text-emerald-800 mt-0.5">
              {formatCurrency(totals.adjustmentDebit)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              {totals.adjustmentBalanced ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">{adjustments.length} Asientos Cuadrados</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span className="text-rose-700 font-medium">Descuadre en ajustes</span>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Resultado del Ejercicio */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              3. Resultado ({totals.netIncome >= 0 ? 'Utilidad Neta' : 'Pérdida Neta'})
            </span>
            <div className={`text-base font-extrabold font-mono mt-0.5 ${
              totals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {formatCurrency(Math.abs(totals.netIncome))}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
              {totals.netIncome >= 0 ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              <span>Ingresos vs Gastos/Costos</span>
            </div>
          </div>

          {/* Card 4: Situación Financiera */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">4. Total Activos Ajustados</span>
            <div className="text-base font-extrabold font-mono text-indigo-900 mt-0.5">
              {formatCurrency(
                totals.netIncome < 0 
                  ? totals.balanceSheetDebit + Math.abs(totals.netIncome)
                  : totals.balanceSheetDebit
              )}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className={`font-semibold ${totals.balanceSheetBalancedWithResult ? 'text-emerald-700' : 'text-amber-700'}`}>
                {totals.balanceSheetBalancedWithResult ? 'Activo = Pasivo + Patrimonio' : 'Verificar ecuación'}
              </span>
            </div>
          </div>
        </section>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('worksheet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'worksheet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hoja de Trabajo (10 Columnas)</span>
            </button>

            <button
              onClick={() => setActiveView('journal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeView === 'journal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Comprobante de Ajustes ({adjustments.length})</span>
            </button>

            <button
              onClick={() => setActiveView('both')}
              className={`hidden md:flex px-3 py-1.5 text-xs font-semibold rounded-md transition-all items-center gap-1.5 ${
                activeView === 'both'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Vista Integrada (Ambos)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuditOpen(true)}
              className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ver Auditoría del Instructor ({audit.score}/100)</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Display */}
        {activeView === 'worksheet' && (
          <WorksheetTable
            rows={rows}
            totals={totals}
            companyName={currentCase.companyName}
            period={currentCase.period}
            onOpenAudit={() => setIsAuditOpen(true)}
          />
        )}

        {activeView === 'journal' && (
          <AdjustmentJournal
            adjustments={adjustments}
            currentCase={currentCase}
            onAddAdjustment={handleAddAdjustment}
            onRemoveAdjustment={handleRemoveAdjustment}
            onLoadSuggestedAdjustment={handleLoadSuggestedAdjustment}
            onLoadAllSuggested={handleLoadAllSuggested}
            onClearAdjustments={() => setAdjustments([])}
          />
        )}

        {activeView === 'both' && (
          <div className="space-y-6">
            <WorksheetTable
              rows={rows}
              totals={totals}
              companyName={currentCase.companyName}
              period={currentCase.period}
              onOpenAudit={() => setIsAuditOpen(true)}
            />
            <AdjustmentJournal
              adjustments={adjustments}
              currentCase={currentCase}
              onAddAdjustment={handleAddAdjustment}
              onRemoveAdjustment={handleRemoveAdjustment}
              onLoadSuggestedAdjustment={handleLoadSuggestedAdjustment}
              onLoadAllSuggested={handleLoadAllSuggested}
              onClearAdjustments={() => setAdjustments([])}
            />
          </div>
        )}
      </main>

      {/* Institutional SENA Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SENA</span>
            <span>·</span>
            <span>Tecnólogo en Gestión Contable y de Información Financiera</span>
            <span>·</span>
            <span>Código 123101</span>
          </div>
          <div>
            <span>Herramienta Didáctica de Cierre Contable y Hoja de Trabajo bajo NIIF</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdjustmentCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onApplyCalculatedAdjustment={handleAddAdjustment}
      />

      <SenaAuditReport
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        audit={audit}
      />

      <PedagogicalGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ExportEvidenceModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentCase={currentCase}
        rows={rows}
        totals={totals}
        adjustments={adjustments}
      />
    </div>
  );
}
