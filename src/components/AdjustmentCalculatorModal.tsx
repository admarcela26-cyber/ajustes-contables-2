import React, { useState } from 'react';
import { Calculator, Sparkles, X, ArrowRight, BookOpen } from 'lucide-react';
import { AdjustmentEntry } from '../types/accounting';
import { formatCurrency } from '../utils/worksheetCalculator';

interface AdjustmentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCalculatedAdjustment: (entry: AdjustmentEntry) => void;
}

export const AdjustmentCalculatorModal: React.FC<AdjustmentCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyCalculatedAdjustment,
}) => {
  const [activeTab, setActiveTab] = useState<'depreciacion' | 'diferidos' | 'intereses'>('depreciacion');

  // 1. Depreciación State
  const [depCost, setDepCost] = useState<number>(18000000);
  const [depResidual, setDepResidual] = useState<number>(0);
  const [depLifeYears, setDepLifeYears] = useState<number>(10);
  const [depAssetType, setDepAssetType] = useState<string>('1524'); // Equipo de oficina
  const [depMonths, setDepMonths] = useState<number>(12); // meses a depreciar

  // Depreciación calculation: (Costo - Residual) / (Años * 12) * Meses
  const depDepreciableBase = Math.max(0, depCost - depResidual);
  const depMonthly = depLifeYears > 0 ? depDepreciableBase / (depLifeYears * 12) : 0;
  const depCalculated = Math.round(depMonthly * depMonths);

  // 2. Diferidos State (Seguros o Arriendos anticipados)
  const [difTotalValue, setDifTotalValue] = useState<number>(6000000);
  const [difContractMonths, setDifContractMonths] = useState<number>(12);
  const [difElapsedMonths, setDifElapsedMonths] = useState<number>(6);
  const [difAccountAsset, setDifAccountAsset] = useState<string>('1705'); // Gastos pagados anticipado
  const [difAccountExpense, setDifAccountExpense] = useState<string>('5125'); // Seguro

  // Diferidos calculation: (Total / ContractMonths) * ElapsedMonths
  const difMonthly = difContractMonths > 0 ? difTotalValue / difContractMonths : 0;
  const difAmortized = Math.round(difMonthly * difElapsedMonths);
  const difRemaining = Math.max(0, difTotalValue - difAmortized);

  // 3. Intereses State (Causación de costos por préstamos)
  const [intPrincipal, setIntPrincipal] = useState<number>(30000000);
  const [intRatePercent, setIntRatePercent] = useState<number>(1.5); // % mensual
  const [intDays, setIntDays] = useState<number>(30); // 30 días del mes comercial

  // Intereses calculation: Principal * (Rate / 100) * (Days / 30)
  const intCalculated = Math.round(intPrincipal * (intRatePercent / 100) * (intDays / 30));

  if (!isOpen) return null;

  const handleApplyDepreciation = () => {
    const entry: AdjustmentEntry = {
      id: `adj-calc-${Date.now()}`,
      date: '2026-12-31',
      codeNumber: `ADJ-DEP`,
      title: `Depreciación Calculada (${depMonths} meses)`,
      description: `Depreciación lineal sobre base de $${depDepreciableBase.toLocaleString('es-CO')} a ${depLifeYears} años (${depMonths} meses causados).`,
      category: 'DEPRECIACION',
      normativeReference: 'NIIF Pymes Sección 17 / NIC 16',
      lines: [
        {
          accountCode: '5160',
          accountName: 'Gastos de Depreciación (PPE)',
          debit: depCalculated,
          credit: 0,
          note: `Depreciación período (${depMonths} meses)`,
        },
        {
          accountCode: '1592',
          accountName: 'Depreciación Acumulada',
          debit: 0,
          credit: depCalculated,
          note: 'Correctora de activo PPE',
        },
      ],
    };
    onApplyCalculatedAdjustment(entry);
    onClose();
  };

  const handleApplyDeferred = () => {
    const entry: AdjustmentEntry = {
      id: `adj-calc-${Date.now()}`,
      date: '2026-12-31',
      codeNumber: `ADJ-DIF`,
      title: `Amortización de Diferido (${difElapsedMonths} meses)`,
      description: `Causación del gasto devengado de $${difTotalValue.toLocaleString('es-CO')} en ${difElapsedMonths} de ${difContractMonths} meses.`,
      category: 'AMORTIZACION_DIFERIDO',
      normativeReference: 'Principio de Devengo / NIIF Pymes Sección 2',
      lines: [
        {
          accountCode: difAccountExpense,
          accountName: difAccountExpense === '5125' ? 'Gastos de Seguros' : 'Gastos de Arrendamientos',
          debit: difAmortized,
          credit: 0,
          note: `Devengo de ${difElapsedMonths} meses consumidos`,
        },
        {
          accountCode: difAccountAsset,
          accountName: 'Gastos Pagados por Anticipado (Diferidos)',
          debit: 0,
          credit: difAmortized,
          note: 'Disminución del activo diferido',
        },
      ],
    };
    onApplyCalculatedAdjustment(entry);
    onClose();
  };

  const handleApplyInterest = () => {
    const entry: AdjustmentEntry = {
      id: `adj-calc-${Date.now()}`,
      date: '2026-12-31',
      codeNumber: `ADJ-INT`,
      title: `Causación de Intereses Bancarios (${intDays} días)`,
      description: `Intereses acumulados sobre saldo capital de $${intPrincipal.toLocaleString('es-CO')} a tasa ${intRatePercent}% mensual por ${intDays} días.`,
      category: 'GASTO_ACUMULADO',
      normativeReference: 'NIIF Pymes Sección 25 (Costos por Préstamos)',
      lines: [
        {
          accountCode: '5305',
          accountName: 'Gastos Financieros (Intereses)',
          debit: intCalculated,
          credit: 0,
          note: `Intereses causados del mes (${intDays} días)`,
        },
        {
          accountCode: '2335',
          accountName: 'Costos y Gastos por Pagar',
          debit: 0,
          credit: intCalculated,
          note: 'Pasivo devengado por pagar a bancos',
        },
      ],
    };
    onApplyCalculatedAdjustment(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Calculadora Didáctica de Ajustes Contables SENA
              </h3>
              <p className="text-xs text-slate-500">
                Herramienta matemática para liquidar partidas bajo NIIF y generar el asiento directo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 pt-2 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('depreciacion')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'depreciacion'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Depreciación (Línea Recta)
          </button>
          <button
            onClick={() => setActiveTab('diferidos')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'diferidos'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Amortización de Diferidos
          </button>
          <button
            onClick={() => setActiveTab('intereses')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'intereses'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Intereses Devengados
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 space-y-4">
          {/* TAB 1: DEPRECIACION */}
          {activeTab === 'depreciacion' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Fórmula NIIF Pymes Sección 17:
                </span>
                <p>
                  <strong>Depreciación = (Costo Histórico - Valor Residual) ÷ Vida Útil</strong>
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  En Colombia, las vidas útiles de referencia habituales son: Muebles y Enseres (10 años), Equipos de Cómputo (5 años), Vehículos (5-10 años), Edificaciones (20-45 años).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Costo de Adquisición ($)</label>
                  <input
                    type="number"
                    value={depCost}
                    onChange={(e) => setDepCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Valor Residual / Salvamento ($)</label>
                  <input
                    type="number"
                    value={depResidual}
                    onChange={(e) => setDepResidual(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Vida Útil Estimada (Años)</label>
                  <select
                    value={depLifeYears}
                    onChange={(e) => setDepLifeYears(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-emerald-500"
                  >
                    <option value={3}>3 años (Equipos periféricos / Software)</option>
                    <option value={5}>5 años (Equipo de Computación)</option>
                    <option value={10}>10 años (Equipo de Oficina / Mobiliario)</option>
                    <option value={10}>10 años (Vehículos y Flota)</option>
                    <option value={20}>20 años (Maquinaria y Equipo)</option>
                    <option value={45}>45 años (Edificaciones y Construcciones)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Meses a Depreciar en el Período</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={depMonths}
                    onChange={(e) => setDepMonths(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Result card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">Cuota de Depreciación Liquidada:</span>
                  <div className="text-xl font-extrabold text-emerald-900 font-mono">
                    {formatCurrency(depCalculated)}
                  </div>
                  <span className="text-[11px] text-emerald-700">
                    (${Math.round(depMonthly).toLocaleString('es-CO')}/mes × {depMonths} meses)
                  </span>
                </div>
                <button
                  onClick={handleApplyDepreciation}
                  className="px-3 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Transferir al Comprobante</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DIFERIDOS */}
          {activeTab === 'diferidos' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Principio de Devengo / Causación en Diferidos:
                </span>
                <p>
                  Los pagos anticipados (cuenta 1705) representan activos hasta que se consume el beneficio económico con el paso del tiempo. Cada mes que transcurre se traslada la porción consumida al gasto (cuenta 5125 / 5120).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Valor Total Pagado por Anticipado ($)</label>
                  <input
                    type="number"
                    value={difTotalValue}
                    onChange={(e) => setDifTotalValue(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipo de Gasto a Devengar</label>
                  <select
                    value={difAccountExpense}
                    onChange={(e) => setDifAccountExpense(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-emerald-500"
                  >
                    <option value="5125">5125 - Póliza de Seguros</option>
                    <option value="5120">5120 - Arrendamientos de Oficinas</option>
                    <option value="5135">5135 - Servicios y Suscripciones</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Meses Contratados en Total</label>
                  <input
                    type="number"
                    min={1}
                    value={difContractMonths}
                    onChange={(e) => setDifContractMonths(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Meses Transcurridos al Corte</label>
                  <input
                    type="number"
                    min={1}
                    max={difContractMonths}
                    value={difElapsedMonths}
                    onChange={(e) => setDifElapsedMonths(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Result card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">Gasto Amortizado a Reconocer:</span>
                  <div className="text-xl font-extrabold text-emerald-900 font-mono">
                    {formatCurrency(difAmortized)}
                  </div>
                  <span className="text-[11px] text-emerald-700">
                    Saldo remanente en activo 1705: {formatCurrency(difRemaining)}
                  </span>
                </div>
                <button
                  onClick={handleApplyDeferred}
                  className="px-3 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Transferir al Comprobante</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INTERESES */}
          {activeTab === 'intereses' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Causación de Costos por Préstamos (NIIF Pymes Secc. 25):
                </span>
                <p>
                  Aunque el pago de la cuota bancaria se efectúe en el mes siguiente, los intereses transcurridos durante los días del mes en curso deben registrarse como gasto financiero (5305) y pasivo por pagar (2335).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Capital del Préstamo ($)</label>
                  <input
                    type="number"
                    value={intPrincipal}
                    onChange={(e) => setIntPrincipal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tasa Mensual Vencida (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={intRatePercent}
                    onChange={(e) => setIntRatePercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Días Devengados</label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={intDays}
                    onChange={(e) => setIntDays(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Result card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">Intereses Causados a Registrar:</span>
                  <div className="text-xl font-extrabold text-emerald-900 font-mono">
                    {formatCurrency(intCalculated)}
                  </div>
                  <span className="text-[11px] text-emerald-700">
                    Débito: 5305 Gastos Financieros / Crédito: 2335 Costos por Pagar
                  </span>
                </div>
                <button
                  onClick={handleApplyInterest}
                  className="px-3 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Transferir al Comprobante</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
