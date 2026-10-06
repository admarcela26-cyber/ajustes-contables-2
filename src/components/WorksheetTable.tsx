import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { WorksheetRow, WorksheetTotals } from '../types/accounting';
import { formatCurrency } from '../utils/worksheetCalculator';

interface WorksheetTableProps {
  rows: WorksheetRow[];
  totals: WorksheetTotals;
  companyName: string;
  period: string;
  onOpenAudit: () => void;
}

export const WorksheetTable: React.FC<WorksheetTableProps> = ({
  rows,
  totals,
  companyName,
  period,
  onOpenAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [onlyAdjusted, setOnlyAdjusted] = useState(false);
  const [selectedRowDetail, setSelectedRowDetail] = useState<WorksheetRow | null>(null);

  // Filter rows
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || row.class === selectedClass;
    const matchesAdjusted = !onlyAdjusted || row.hasAdjustment;
    return matchesSearch && matchesClass && matchesAdjusted;
  });

  const classBadges: Record<string, { label: string; color: string }> = {
    '1': { label: '1 - Activo', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    '2': { label: '2 - Pasivo', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    '3': { label: '3 - Patrimonio', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    '4': { label: '4 - Ingresos', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    '5': { label: '5 - Gastos', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    '6': { label: '6 - Costos', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    '7': { label: '7 - Producción', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cuenta o código PUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Clase:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Todas las Clases</option>
              <option value="1">1 - Activos</option>
              <option value="2">2 - Pasivos</option>
              <option value="3">3 - Patrimonio</option>
              <option value="4">4 - Ingresos</option>
              <option value="5">5 - Gastos</option>
              <option value="6">6 - Costos</option>
            </select>
          </div>

          {/* Only adjusted toggle */}
          <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={onlyAdjusted}
              onChange={(e) => setOnlyAdjusted(e.target.checked)}
              className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>Solo cuentas con ajustes ({rows.filter((r) => r.hasAdjustment).length})</span>
          </label>
        </div>

        {/* Legend & Help hint */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Cuentas modificadas por ajustes
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 hidden sm:inline">
            Haga clic en cualquier fila para ver el desglose formativo
          </span>
        </div>
      </div>

      {/* Main Worksheet Spreadsheet Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-xs border-collapse">
          {/* Main Grouped Header */}
          <thead>
            <tr className="bg-slate-900 text-white font-semibold text-center border-b border-slate-800">
              <th rowSpan={2} className="px-3 py-2 text-left w-16 border-r border-slate-800 sticky left-0 bg-slate-900 z-10">
                Código
              </th>
              <th rowSpan={2} className="px-3 py-2 text-left min-w-[200px] border-r border-slate-800 sticky left-16 bg-slate-900 z-10">
                Cuenta Contable (PUC / NIIF)
              </th>
              <th colSpan={2} className="px-3 py-1.5 border-r border-slate-800 bg-slate-800">
                1. Balance Comprobación
              </th>
              <th colSpan={2} className="px-3 py-1.5 border-r border-slate-800 bg-emerald-950/60 text-emerald-300">
                2. Ajustes del Período
              </th>
              <th colSpan={2} className="px-3 py-1.5 border-r border-slate-800 bg-slate-800">
                3. Balance Ajustado
              </th>
              <th colSpan={2} className="px-3 py-1.5 border-r border-slate-800 bg-blue-950/60 text-blue-300">
                4. Estado de Resultados
              </th>
              <th colSpan={2} className="px-3 py-1.5 bg-indigo-950/60 text-indigo-300">
                5. Situación Financiera
              </th>
            </tr>
            <tr className="bg-slate-800 text-slate-300 text-[11px] font-medium border-b border-slate-700">
              {/* Bal Comprobacion */}
              <th className="px-2 py-1.5 text-right w-24">Débito</th>
              <th className="px-2 py-1.5 text-right w-24 border-r border-slate-700">Crédito</th>
              {/* Ajustes */}
              <th className="px-2 py-1.5 text-right w-24 bg-emerald-900/40 text-emerald-300 font-semibold">Débito</th>
              <th className="px-2 py-1.5 text-right w-24 bg-emerald-900/40 text-emerald-300 font-semibold border-r border-slate-700">Crédito</th>
              {/* Bal Ajustado */}
              <th className="px-2 py-1.5 text-right w-24">Débito</th>
              <th className="px-2 py-1.5 text-right w-24 border-r border-slate-700">Crédito</th>
              {/* Est Resultados */}
              <th className="px-2 py-1.5 text-right w-24 bg-blue-900/40 text-blue-300">Débito (Gastos)</th>
              <th className="px-2 py-1.5 text-right w-24 bg-blue-900/40 text-blue-300 border-r border-slate-700">Crédito (Ingr.)</th>
              {/* Sit Financiera */}
              <th className="px-2 py-1.5 text-right w-24 bg-indigo-900/40 text-indigo-300">Débito (Activo)</th>
              <th className="px-2 py-1.5 text-right w-24 bg-indigo-900/40 text-indigo-300">Crédito (Pas+Pat)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-slate-400 font-sans text-xs">
                  No se encontraron cuentas contables que coincidan con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isSelected = selectedRowDetail?.code === row.code;
                return (
                  <tr
                    key={row.code}
                    onClick={() => setSelectedRowDetail(row)}
                    className={`cursor-pointer transition-colors ${
                      row.hasAdjustment
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/80'
                        : isSelected
                        ? 'bg-blue-50/60'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Code */}
                    <td className="px-3 py-1.5 font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-inherit">
                      <div className="flex items-center gap-1">
                        <span>{row.code}</span>
                        {row.hasAdjustment && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" title="Ajustada"></span>
                        )}
                      </div>
                    </td>

                    {/* Account Name */}
                    <td className="px-3 py-1.5 font-sans text-slate-900 font-medium border-r border-slate-200 sticky left-16 bg-inherit truncate max-w-[240px]">
                      <span title={row.name}>{row.name}</span>
                    </td>

                    {/* 1. Bal Comprobacion */}
                    <td className="px-2 py-1.5 text-right text-slate-700">
                      {formatCurrency(row.initialDebit)}
                    </td>
                    <td className="px-2 py-1.5 text-right text-slate-700 border-r border-slate-200">
                      {formatCurrency(row.initialCredit)}
                    </td>

                    {/* 2. Ajustes */}
                    <td className={`px-2 py-1.5 text-right ${row.adjustmentDebit > 0 ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-400'}`}>
                      {formatCurrency(row.adjustmentDebit)}
                    </td>
                    <td className={`px-2 py-1.5 text-right border-r border-slate-200 ${row.adjustmentCredit > 0 ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-400'}`}>
                      {formatCurrency(row.adjustmentCredit)}
                    </td>

                    {/* 3. Bal Ajustado */}
                    <td className={`px-2 py-1.5 text-right ${row.adjustedDebit > 0 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {formatCurrency(row.adjustedDebit)}
                    </td>
                    <td className={`px-2 py-1.5 text-right border-r border-slate-200 ${row.adjustedCredit > 0 ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {formatCurrency(row.adjustedCredit)}
                    </td>

                    {/* 4. Est Resultados */}
                    <td className={`px-2 py-1.5 text-right ${row.incomeDebit > 0 ? 'text-blue-900 font-semibold bg-blue-50/30' : 'text-slate-300'}`}>
                      {formatCurrency(row.incomeDebit)}
                    </td>
                    <td className={`px-2 py-1.5 text-right border-r border-slate-200 ${row.incomeCredit > 0 ? 'text-blue-900 font-semibold bg-blue-50/30' : 'text-slate-300'}`}>
                      {formatCurrency(row.incomeCredit)}
                    </td>

                    {/* 5. Sit Financiera */}
                    <td className={`px-2 py-1.5 text-right ${row.balanceSheetDebit > 0 ? 'text-indigo-900 font-semibold bg-indigo-50/30' : 'text-slate-300'}`}>
                      {formatCurrency(row.balanceSheetDebit)}
                    </td>
                    <td className={`px-2 py-1.5 text-right ${row.balanceSheetCredit > 0 ? 'text-indigo-900 font-semibold bg-indigo-50/30' : 'text-slate-300'}`}>
                      {formatCurrency(row.balanceSheetCredit)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Subtotales y Sumas de Cierre */}
          <tfoot className="border-t-2 border-slate-400 font-mono text-[11px]">
            {/* Fila 1: Subtotales de las Columnas */}
            <tr className="bg-slate-100 font-bold text-slate-900">
              <td colSpan={2} className="px-3 py-2 text-left font-sans text-xs sticky left-0 bg-slate-100 z-10 border-r border-slate-300">
                SUBTOTALES PRELIMINARES
              </td>
              {/* Bal Comprobacion */}
              <td className="px-2 py-2 text-right">{formatCurrency(totals.initialDebit)}</td>
              <td className="px-2 py-2 text-right border-r border-slate-300">{formatCurrency(totals.initialCredit)}</td>
              {/* Ajustes */}
              <td className="px-2 py-2 text-right text-emerald-800 bg-emerald-100/50">{formatCurrency(totals.adjustmentDebit)}</td>
              <td className="px-2 py-2 text-right text-emerald-800 bg-emerald-100/50 border-r border-slate-300">{formatCurrency(totals.adjustmentCredit)}</td>
              {/* Bal Ajustado */}
              <td className="px-2 py-2 text-right">{formatCurrency(totals.adjustedDebit)}</td>
              <td className="px-2 py-2 text-right border-r border-slate-300">{formatCurrency(totals.adjustedCredit)}</td>
              {/* Est Resultados */}
              <td className="px-2 py-2 text-right text-blue-900 bg-blue-100/50">{formatCurrency(totals.incomeDebit)}</td>
              <td className="px-2 py-2 text-right text-blue-900 bg-blue-100/50 border-r border-slate-300">{formatCurrency(totals.incomeCredit)}</td>
              {/* Sit Financiera */}
              <td className="px-2 py-2 text-right text-indigo-900 bg-indigo-100/50">{formatCurrency(totals.balanceSheetDebit)}</td>
              <td className="px-2 py-2 text-right text-indigo-900 bg-indigo-100/50">{formatCurrency(totals.balanceSheetCredit)}</td>
            </tr>

            {/* Fila 2: Resultado del Ejercicio (Utilidad o Pérdida) */}
            <tr className="bg-amber-50/80 border-y border-amber-200 font-bold text-amber-950">
              <td colSpan={2} className="px-3 py-2 text-left font-sans text-xs sticky left-0 bg-amber-50/90 z-10 border-r border-amber-200">
                <div className="flex items-center gap-1.5">
                  {totals.netIncome >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    RESULTADO DEL EJERCICIO: {totals.netIncome >= 0 ? 'UTILIDAD NETA' : 'PÉRDIDA NETA'}
                  </span>
                </div>
              </td>
              {/* Bal Comprobacion: Vacio */}
              <td className="px-2 py-2 text-right text-slate-400">-</td>
              <td className="px-2 py-2 text-right text-slate-400 border-r border-slate-200">-</td>
              {/* Ajustes: Vacio */}
              <td className="px-2 py-2 text-right text-slate-400">-</td>
              <td className="px-2 py-2 text-right text-slate-400 border-r border-slate-200">-</td>
              {/* Bal Ajustado: Vacio */}
              <td className="px-2 py-2 text-right text-slate-400">-</td>
              <td className="px-2 py-2 text-right text-slate-400 border-r border-slate-200">-</td>

              {/* Est Resultados: Se coloca en el lado menor para cuadrar */}
              <td className="px-2 py-2 text-right bg-blue-50 text-blue-900 font-extrabold">
                {totals.netIncome >= 0 ? formatCurrency(totals.netIncome) : '-'}
              </td>
              <td className="px-2 py-2 text-right border-r border-slate-200 bg-blue-50 text-blue-900 font-extrabold">
                {totals.netIncome < 0 ? formatCurrency(Math.abs(totals.netIncome)) : '-'}
              </td>

              {/* Sit Financiera: Se traslada al Patrimonio en el lado contrario */}
              <td className="px-2 py-2 text-right bg-indigo-50 text-indigo-900 font-extrabold">
                {totals.netIncome < 0 ? formatCurrency(Math.abs(totals.netIncome)) : '-'}
              </td>
              <td className="px-2 py-2 text-right bg-indigo-50 text-indigo-900 font-extrabold">
                {totals.netIncome >= 0 ? formatCurrency(totals.netIncome) : '-'}
              </td>
            </tr>

            {/* Fila 3: Sumas Iguales Definitivas */}
            <tr className="bg-slate-900 text-white font-extrabold text-xs">
              <td colSpan={2} className="px-3 py-2.5 text-left font-sans sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>SUMAS IGUALES DEFINITIVAS</span>
                </div>
              </td>
              {/* Bal Comprobacion */}
              <td className="px-2 py-2.5 text-right">{formatCurrency(totals.initialDebit)}</td>
              <td className="px-2 py-2.5 text-right border-r border-slate-800">{formatCurrency(totals.initialCredit)}</td>
              {/* Ajustes */}
              <td className="px-2 py-2.5 text-right text-emerald-300">{formatCurrency(totals.adjustmentDebit)}</td>
              <td className="px-2 py-2.5 text-right border-r border-slate-800 text-emerald-300">{formatCurrency(totals.adjustmentCredit)}</td>
              {/* Bal Ajustado */}
              <td className="px-2 py-2.5 text-right">{formatCurrency(totals.adjustedDebit)}</td>
              <td className="px-2 py-2.5 text-right border-r border-slate-800">{formatCurrency(totals.adjustedCredit)}</td>
              {/* Est Resultados */}
              <td className="px-2 py-2.5 text-right text-blue-300">
                {formatCurrency(totals.netIncome >= 0 ? totals.incomeDebit + totals.netIncome : totals.incomeDebit)}
              </td>
              <td className="px-2 py-2.5 text-right border-r border-slate-800 text-blue-300">
                {formatCurrency(totals.netIncome < 0 ? totals.incomeCredit + Math.abs(totals.netIncome) : totals.incomeCredit)}
              </td>
              {/* Sit Financiera */}
              <td className="px-2 py-2.5 text-right text-indigo-300">
                {formatCurrency(totals.netIncome < 0 ? totals.balanceSheetDebit + Math.abs(totals.netIncome) : totals.balanceSheetDebit)}
              </td>
              <td className="px-2 py-2.5 text-right text-indigo-300">
                {formatCurrency(totals.netIncome >= 0 ? totals.balanceSheetCredit + totals.netIncome : totals.balanceSheetCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Row detail drawer / modal if apprentice clicks an account */}
      {selectedRowDetail && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {selectedRowDetail.code} - {selectedRowDetail.name}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-sans font-semibold ${classBadges[selectedRowDetail.class]?.color}`}>
                {classBadges[selectedRowDetail.class]?.label}
              </span>
              <span className="text-xs text-slate-500 font-sans">
                Naturaleza: {selectedRowDetail.nature === 'DEBIT' ? 'Débito' : 'Crédito'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              <strong>Explicación Formativa:</strong>{' '}
              {selectedRowDetail.hasAdjustment ? (
                <span>
                  Esta cuenta fue impactada por ajustes del período (Débito: {formatCurrency(selectedRowDetail.adjustmentDebit)}, Crédito: {formatCurrency(selectedRowDetail.adjustmentCredit)}).
                  Su saldo pasó de {formatCurrency(selectedRowDetail.initialDebit || selectedRowDetail.initialCredit)} a un saldo ajustado de{' '}
                  {formatCurrency(selectedRowDetail.adjustedDebit || selectedRowDetail.adjustedCredit)}.
                </span>
              ) : (
                <span>
                  No presentó movimientos de ajuste en este cierre. Su saldo inicial se traslada intacto al Balance Ajustado.
                </span>
              )}
              {' '}Se clasifica en el{' '}
              <strong>{selectedRowDetail.category === 'RESULTADO' ? 'Estado de Resultados (P&G)' : 'Estado de Situación Financiera'}</strong>{' '}
              por ser cuenta de Clase {selectedRowDetail.class}.
            </p>
          </div>
          <button
            onClick={() => setSelectedRowDetail(null)}
            className="text-xs text-slate-500 hover:text-slate-800 underline self-start md:self-center"
          >
            Cerrar detalle
          </button>
        </div>
      )}
    </div>
  );
};
