import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  FileText, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';

interface PedagogicalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PedagogicalGuide: React.FC<PedagogicalGuideProps> = ({
  isOpen,
  onClose,
}) => {
  const [section, setSection] = useState<'fundamentos' | 'tipos_ajustes' | 'diez_columnas' | 'regla_cuadre'>('fundamentos');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Guía Pedagógica del Instructor SENA: Hoja de Trabajo y Ajustes
              </h3>
              <p className="text-xs text-emerald-200">
                Material de apoyo para aprendices del Tecnólogo en Gestión Contable y de Información Financiera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setSection('fundamentos')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
              section === 'fundamentos'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Fundamentos & Objetivo
          </button>
          <button
            onClick={() => setSection('tipos_ajustes')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
              section === 'tipos_ajustes'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Tipos de Ajustes Contables
          </button>
          <button
            onClick={() => setSection('diez_columnas')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
              section === 'diez_columnas'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Estructura de 10 Columnas
          </button>
          <button
            onClick={() => setSection('regla_cuadre')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
              section === 'regla_cuadre'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Mecánica del Cuadre Final
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 text-xs text-slate-700 leading-relaxed space-y-4">
          {section === 'fundamentos' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-emerald-900 mb-1">
                  ¿Qué es la Hoja de Trabajo (Worksheet) en Contabilidad?
                </h4>
                <p className="text-slate-700">
                  La <strong>Hoja de Trabajo</strong> es un instrumento o papel de trabajo extracontable que utiliza el contador público y el equipo financiero al final del período contable. Su finalidad es recopilar los saldos preliminares, registrar los asientos de ajuste, obtener los saldos definitivos ajustados y clasificar las cuentas para elaborar los dos estados financieros fundamentales: el <strong>Estado de Resultados</strong> y el <strong>Estado de Situación Financiera</strong>.
                </p>
                <div className="mt-2 text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 p-2 rounded">
                  ⚠️ <strong>Aclaración Técnica SENA:</strong> La Hoja de Trabajo <u>no es un estado financiero formal</u> ni sustituye los libros oficiales de contabilidad (Diario, Mayor y Balances). Es un borrador analítico indispensable para evitar errores antes del cierre definitivo de las cuentas de resultado.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-white">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    Principio de Devengo / Acumulación (NIIF)
                  </h5>
                  <p className="text-slate-600 text-[11px]">
                    Bajo las Normas Internacionales de Información Financiera (NIIF para Pymes Sección 2 / Marco Conceptual), los efectos de las transacciones y demás sucesos se reconocen cuando <strong>ocurren</strong> (y no cuando se recibe o paga dinero en efectivo). Los ajustes contables son la herramienta operativa para garantizar que todos los ingresos y gastos devengados en el período queden fielmente reflejados.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-white">
                  <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Marco Normativo en Colombia
                  </h5>
                  <p className="text-slate-600 text-[11px]">
                    Regulado por la <strong>Ley 1314 de 2009</strong> y compilado en el <strong>Decreto Único Reglamentario 2420 de 2015</strong>. En la formación técnica y tecnológica del SENA, se enfatiza el Grupo 2 (NIIF para Pymes), complementado con la estructura pedagógica de codificación del Plan Único de Cuentas (PUC Decreto 2650).
                  </p>
                </div>
              </div>
            </div>
          )}

          {section === 'tipos_ajustes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Los 5 Tipos Esenciales de Ajustes Contables que Todo Aprendiz Debe Dominar
              </h4>

              <div className="space-y-3">
                {/* 1. Depreciacion */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">
                      1. Depreciación de Propiedad, Planta y Equipo (PPE - NIC 16 / NIIF Pymes Secc. 17)
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Débito 5160 / Crédito 1592
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Distribución sistemática del importe depreciable de un activo tangible a lo largo de su vida útil. Se calcula por línea recta: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">(Costo - Valor Residual) / Vida Útil</code>. La cuenta 1592 es una cuenta correctora de activo (naturaleza crédito).
                  </p>
                </div>

                {/* 2. Amortizacion diferidos */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">
                      2. Amortización de Pagos Anticipados (Diferidos - Activo 1705 o Pasivo 2705)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Débito 5125 / Crédito 1705
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Cuando una empresa paga por adelantado pólizas de seguro (1705) o cánones de arrendamiento, o cuando recibe dinero por servicios no prestados aún (2705). Al cierre del período, la porción consumida o devengada se traslada al gasto o al ingreso respectivamente.
                  </p>
                </div>

                {/* 3. Gastos Acumulados */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">
                      3. Gastos e Ingresos Acumulados (Causaciones Pendientes de Pago / Cobro)
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Débito 5305 / Crédito 2335
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Hechos económicos ya ocurridos pero no cancelados ni facturados al corte: servicios públicos recibidos en diciembre (5135/2335), intereses bancarios devengados en el mes (5305/2335), nómina y prestaciones acumuladas (5105/2505).
                  </p>
                </div>

                {/* 4. Deterioro cartera */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">
                      4. Deterioro de Cuentas por Cobrar (Provisión de Cartera - NIIF Pymes Secc. 11)
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Débito 5199 / Crédito 1399
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Reconocimiento de la pérdida crediticia esperada cuando existe evidencia objetiva de que la empresa no podrá recaudar la totalidad de su cartera comercial. La cuenta 1399 reduce el valor neto realizable de los clientes.
                  </p>
                </div>

                {/* 5. Conciliaciones y Arqueos */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">
                      5. Arqueos de Caja, Tomas Físicas de Inventario y Conciliación Bancaria
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Débito 1305 / Crédito 1105
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Ajustes para conciliar los saldos de los libros con las existencias reales: faltantes de caja atribuidos al cajero (1305 a 1105) o faltantes justificados (5395 a 1105), mermas o deterioros en inventarios (5199 a 1435), notas débito y comisiones bancarias no contabilizadas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {section === 'diez_columnas' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                La Estructura Técnica de las 10 Columnas de la Hoja de Trabajo
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-200 rounded">
                  <thead className="bg-slate-100 font-semibold text-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2 border">Columnas</th>
                      <th className="p-2 border">Nombre del Bloque</th>
                      <th className="p-2 border">¿Qué representa?</th>
                      <th className="p-2 border">Fórmula / Regla Operativa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    <tr>
                      <td className="p-2 font-mono font-bold text-center">1 y 2</td>
                      <td className="p-2 font-semibold">Balance de Comprobación</td>
                      <td className="p-2">Saldos preliminares tomados del Libro Mayor antes de ajustes.</td>
                      <td className="p-2 font-mono">Débitos = Créditos (Partida Doble)</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="p-2 font-mono font-bold text-center text-emerald-800">3 y 4</td>
                      <td className="p-2 font-semibold text-emerald-900">Ajustes del Período</td>
                      <td className="p-2">Movimientos débitos y créditos originados en el comprobante diario de ajustes.</td>
                      <td className="p-2 font-mono">Débitos = Créditos estrictos</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono font-bold text-center">5 y 6</td>
                      <td className="p-2 font-semibold">Balance Ajustado</td>
                      <td className="p-2">Saldos reales de las cuentas tras incorporar los ajustes.</td>
                      <td className="p-2">
                        Si naturaleza es Débito: <code className="bg-slate-100 p-0.5">Saldo Inicial D - C + (Ajuste D - Ajuste C)</code>
                      </td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="p-2 font-mono font-bold text-center text-blue-800">7 y 8</td>
                      <td className="p-2 font-semibold text-blue-900">Estado de Resultados (P&G)</td>
                      <td className="p-2">Únicamente cuentas nominales o de resultado: <strong>Clase 4 (Ingresos), 5 (Gastos) y 6 (Costos)</strong>.</td>
                      <td className="p-2 font-mono">Ingresos (Crédito) - Costos y Gastos (Débito) = Resultado Neto</td>
                    </tr>
                    <tr className="bg-indigo-50/50">
                      <td className="p-2 font-mono font-bold text-center text-indigo-800">9 y 10</td>
                      <td className="p-2 font-semibold text-indigo-900">Estado de Situación Financiera</td>
                      <td className="p-2">Únicamente cuentas reales o de balance: <strong>Clase 1 (Activo), 2 (Pasivo) y 3 (Patrimonio)</strong>.</td>
                      <td className="p-2 font-mono">Activo = Pasivo + Patrimonio (+ Utilidad / - Pérdida)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'regla_cuadre' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  La "Regla de Oro" del Cuadre de la Utilidad o Pérdida Neta
                </h4>
                <p className="text-slate-700">
                  Uno de los errores más frecuentes de los aprendices en el tecnólogo es no comprender la mecánica del traslado del resultado a las columnas finales. Observe con atención:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <span className="font-bold text-emerald-800 text-xs block mb-1">
                      Caso A: Cuando hay UTILIDAD NETA (Ingresos &gt; Gastos)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                      <li>En las columnas 7 y 8, la columna Crédito (Ingresos) es <strong>mayor</strong> que la columna Débito (Gastos).</li>
                      <li>Para que las columnas 7 y 8 den <strong>sumas iguales</strong>, la Utilidad Neta se anota en la columna <strong>DÉBITO</strong> de Resultados.</li>
                      <li>Simultáneamente, la Utilidad representa un incremento del Patrimonio (cuenta 3605), por lo que se traslada a la columna <strong>CRÉDITO</strong> del Estado de Situación Financiera (columnas 9 y 10).</li>
                      <li>¡Al hacer esto, ambas parejas de columnas cuadran con sumas iguales exactas!</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <span className="font-bold text-rose-800 text-xs block mb-1">
                      Caso B: Cuando hay PÉRDIDA NETA (Gastos &gt; Ingresos)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                      <li>La columna Débito (Gastos) es <strong>mayor</strong> que la columna Crédito (Ingresos).</li>
                      <li>Para cuadrar el Estado de Resultados, la Pérdida se anota en la columna <strong>CRÉDITO</strong>.</li>
                      <li>La pérdida disminuye el patrimonio (cuenta 3610), por lo que se traslada a la columna <strong>DÉBITO</strong> de la Situación Financiera para igualar los activos.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Servicio Nacional de Aprendizaje SENA · Dirección de Formación Profesional
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
