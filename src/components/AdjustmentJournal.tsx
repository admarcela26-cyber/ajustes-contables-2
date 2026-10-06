import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { AdjustmentEntry, AdjustmentLine, SenaExerciseCase } from '../types/accounting';
import { PUC_STANDARD_LIST, getPucAccount } from '../data/pucStandard';
import { formatCurrency } from '../utils/worksheetCalculator';

interface AdjustmentJournalProps {
  adjustments: AdjustmentEntry[];
  currentCase: SenaExerciseCase;
  onAddAdjustment: (entry: AdjustmentEntry) => void;
  onRemoveAdjustment: (id: string) => void;
  onLoadSuggestedAdjustment: (index: number) => void;
  onLoadAllSuggested: () => void;
  onClearAdjustments: () => void;
}

export const AdjustmentJournal: React.FC<AdjustmentJournalProps> = ({
  adjustments,
  currentCase,
  onAddAdjustment,
  onRemoveAdjustment,
  onLoadSuggestedAdjustment,
  onLoadAllSuggested,
  onClearAdjustments,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state for new adjustment entry
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<AdjustmentEntry['category']>('DEPRECIACION');
  const [formNormative, setFormNormative] = useState('NIIF para Pymes / Marco Conceptual');
  const [formLines, setFormLines] = useState<AdjustmentLine[]>([
    { accountCode: '5160', debit: 0, credit: 0, note: '' },
    { accountCode: '1592', debit: 0, credit: 0, note: '' },
  ]);

  const handleLineChange = (index: number, field: keyof AdjustmentLine, value: any) => {
    const updated = [...formLines];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'accountCode') {
      const puc = getPucAccount(value);
      if (puc) {
        updated[index].accountName = puc.name;
      }
    }
    setFormLines(updated);
  };

  const handleAddLine = () => {
    setFormLines([...formLines, { accountCode: '1105', debit: 0, credit: 0, note: '' }]);
  };

  const handleRemoveLine = (index: number) => {
    if (formLines.length > 2) {
      setFormLines(formLines.filter((_, i) => i !== index));
    }
  };

  const totalFormDebit = formLines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalFormCredit = formLines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const isFormBalanced = Math.abs(totalFormDebit - totalFormCredit) < 0.01 && totalFormDebit > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormBalanced || !formTitle) return;

    const newEntry: AdjustmentEntry = {
      id: `adj-${Date.now()}`,
      date: '2026-12-31',
      codeNumber: `ADJ-${String(adjustments.length + 1).padStart(3, '0')}`,
      title: formTitle,
      description: formDescription,
      category: formCategory,
      normativeReference: formNormative,
      lines: formLines.map((l) => ({
        accountCode: l.accountCode,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        note: l.note || '',
        accountName: getPucAccount(l.accountCode)?.name || `Cuenta ${l.accountCode}`,
      })),
    };

    onAddAdjustment(newEntry);
    setIsModalOpen(false);
    // Reset form
    setFormTitle('');
    setFormDescription('');
    setFormLines([
      { accountCode: '5160', debit: 0, credit: 0, note: '' },
      { accountCode: '1592', debit: 0, credit: 0, note: '' },
    ]);
  };

  const categoryLabels: Record<AdjustmentEntry['category'], { label: string; color: string }> = {
    DEPRECIACION: { label: 'Depreciación PPE', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    AMORTIZACION_DIFERIDO: { label: 'Amortización Diferido', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    GASTO_ACUMULADO: { label: 'Gasto Acumulado', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    INGRESO_ACUMULADO: { label: 'Ingreso Acumulado', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    DETERIORO_CARTERA: { label: 'Deterioro Cartera', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    ARQUEO_INVENTARIO: { label: 'Arqueo / Faltante', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    CORRECCION_ERROR: { label: 'Corrección de Error', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Comprobante de Diario: Asientos de Ajuste ({adjustments.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registre los hechos económicos bajo la base de devengo para actualizar los saldos antes del cierre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentCase.suggestedAdjustments.length > 0 && (
            <button
              onClick={onLoadAllSuggested}
              className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              title="Cargar todos los ajustes sugeridos del caso formativo"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Casos SENA</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Asiento</span>
          </button>

          {adjustments.length > 0 && (
            <button
              onClick={onClearAdjustments}
              className="text-xs px-2.5 py-1.5 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 transition-colors"
              title="Limpiar todos los ajustes"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Suggested adjustments checklist for SENA apprentice */}
      {currentCase.suggestedAdjustments.length > 0 && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Ruta de Ajustes Recomendados para este Caso:
            </span>
            <span className="text-[11px] text-slate-500">
              {adjustments.length} de {currentCase.suggestedAdjustments.length} completados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {currentCase.suggestedAdjustments.map((sug, idx) => {
              const alreadyLoaded = adjustments.some(
                (a) => a.codeNumber === sug.codeNumber || a.title === sug.title
              );
              return (
                <div
                  key={sug.codeNumber}
                  className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-all ${
                    alreadyLoaded
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between font-semibold">
                      <span className="font-mono text-[11px]">{sug.codeNumber}</span>
                      {alreadyLoaded ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-slate-400">Pendiente</span>
                      )}
                    </div>
                    <p className="font-medium text-slate-900 mt-1 line-clamp-1">{sug.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{sug.description}</p>
                  </div>
                  {!alreadyLoaded && (
                    <button
                      onClick={() => onLoadSuggestedAdjustment(idx)}
                      className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1 px-2 rounded border border-emerald-200 transition-colors w-full text-center"
                    >
                      + Aplicar este ajuste
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Adjustments registered table/cards */}
      {adjustments.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-300">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No hay ajustes contables registrados</p>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
            Los saldos iniciales del balance de comprobación no han sufrido modificaciones. Utilice los botones superiores para registrar o aplicar los ajustes del período.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {adjustments.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const entryDebit = entry.lines.reduce((acc, l) => acc + (l.debit || 0), 0);
            const entryCredit = entry.lines.reduce((acc, l) => acc + (l.credit || 0), 0);
            const isBalanced = Math.abs(entryDebit - entryCredit) < 0.01;

            return (
              <div
                key={entry.id}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs transition-shadow hover:shadow-xs"
              >
                {/* Entry Header */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="p-3 bg-slate-50/80 cursor-pointer flex flex-wrap items-center justify-between gap-2 border-b border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                      {entry.codeNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {entry.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${categoryLabels[entry.category]?.color}`}>
                      {categoryLabels[entry.category]?.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="text-slate-500">Valor:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(entryDebit)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isBalanced ? (
                        <span className="text-emerald-700 text-xs flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Cuadrado
                        </span>
                      ) : (
                        <span className="text-rose-700 text-xs flex items-center gap-1 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Descuadrado
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAdjustment(entry.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                      title="Eliminar asiento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Entry Lines / Table */}
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 mb-2 gap-1">
                    <p className="text-[11px] text-slate-600">
                      <strong>Concepto:</strong> {entry.description}
                    </p>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Ref: {entry.normativeReference}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-200 rounded">
                      <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="px-3 py-1.5 w-20">Código</th>
                          <th className="px-3 py-1.5">Cuenta Contable</th>
                          <th className="px-3 py-1.5">Detalle / Subcuenta</th>
                          <th className="px-3 py-1.5 text-right w-28">Débito</th>
                          <th className="px-3 py-1.5 text-right w-28">Crédito</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {entry.lines.map((l, lIdx) => {
                          const puc = getPucAccount(l.accountCode);
                          return (
                            <tr key={lIdx} className="hover:bg-slate-50">
                              <td className="px-3 py-1.5 font-bold text-slate-800">{l.accountCode}</td>
                              <td className="px-3 py-1.5 font-sans font-medium text-slate-800">
                                {l.accountName || puc?.name || `Cuenta ${l.accountCode}`}
                              </td>
                              <td className="px-3 py-1.5 font-sans text-slate-500 text-[10px]">{l.note || '-'}</td>
                              <td className="px-3 py-1.5 text-right text-slate-900 font-semibold">
                                {formatCurrency(l.debit)}
                              </td>
                              <td className="px-3 py-1.5 text-right text-slate-900 font-semibold">
                                {formatCurrency(l.credit)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50 font-mono text-[11px] font-bold border-t border-slate-200">
                        <tr>
                          <td colSpan={3} className="px-3 py-1.5 text-right font-sans text-[11px] text-slate-700">
                            SUMAS IGUALES DEL ASIENTO:
                          </td>
                          <td className="px-3 py-1.5 text-right text-emerald-700">{formatCurrency(entryDebit)}</td>
                          <td className="px-3 py-1.5 text-right text-emerald-700">{formatCurrency(entryCredit)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Adjustment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Asiento de Ajuste</h3>
                <p className="text-xs text-slate-500">Ingrese las cuentas y garantice el principio de partida doble.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Título del Ajuste</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Depreciación de Mobiliario Diciembre"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de Ajuste (Categoría)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="DEPRECIACION">Depreciación de Propiedad, Planta y Equipo</option>
                    <option value="AMORTIZACION_DIFERIDO">Amortización de Gastos/Ingresos Diferidos</option>
                    <option value="GASTO_ACUMULADO">Gasto Acumulado por Pagar (Causación)</option>
                    <option value="INGRESO_ACUMULADO">Ingreso Acumulado por Cobrar</option>
                    <option value="DETERIORO_CARTERA">Deterioro de Cuentas por Cobrar (Provisión)</option>
                    <option value="ARQUEO_INVENTARIO">Arqueo de Caja / Ajuste de Inventarios</option>
                    <option value="CORRECCION_ERROR">Corrección de Error Contable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Concepto / Explicación del Hecho Económico</label>
                <textarea
                  rows={2}
                  placeholder="Detalle la justificación técnica, cálculos realizados y el soporte contable..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Lines editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-800">Partidas del Asiento (Débitos y Créditos):</label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    + Agregar línea
                  </button>
                </div>

                <div className="space-y-2">
                  {formLines.map((line, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      {/* PUC selector */}
                      <div className="w-48">
                        <select
                          value={line.accountCode}
                          onChange={(e) => handleLineChange(idx, 'accountCode', e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-emerald-500"
                        >
                          {PUC_STANDARD_LIST.map((acc) => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Note */}
                      <input
                        type="text"
                        placeholder="Nota o beneficiario"
                        value={line.note || ''}
                        onChange={(e) => handleLineChange(idx, 'note', e.target.value)}
                        className="flex-1 text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-emerald-500 min-w-[120px]"
                      />

                      {/* Debit */}
                      <div className="w-28">
                        <input
                          type="number"
                          placeholder="Débito"
                          min="0"
                          value={line.debit || ''}
                          onChange={(e) => handleLineChange(idx, 'debit', Number(e.target.value))}
                          className="w-full text-xs p-1.5 text-right font-mono bg-white border border-slate-300 rounded focus:ring-emerald-500"
                        />
                      </div>

                      {/* Credit */}
                      <div className="w-28">
                        <input
                          type="number"
                          placeholder="Crédito"
                          min="0"
                          value={line.credit || ''}
                          onChange={(e) => handleLineChange(idx, 'credit', Number(e.target.value))}
                          className="w-full text-xs p-1.5 text-right font-mono bg-white border border-slate-300 rounded focus:ring-emerald-500"
                        />
                      </div>

                      {formLines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form sum validation */}
                <div className={`mt-3 p-2.5 rounded-lg border text-xs flex items-center justify-between font-mono ${
                  isFormBalanced ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-sans font-medium">
                    {isFormBalanced ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Partida Doble Verificada</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Diferencia: {formatCurrency(Math.abs(totalFormDebit - totalFormCredit))}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Débito: {formatCurrency(totalFormDebit)}</span>
                    <span>Crédito: {formatCurrency(totalFormCredit)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isFormBalanced || !formTitle}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                >
                  Guardar e Impactar Hoja de Trabajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
