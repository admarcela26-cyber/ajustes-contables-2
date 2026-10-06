export type AccountNature = 'DEBIT' | 'CREDIT';

export type AccountClass = 
  | '1' // Activo
  | '2' // Pasivo
  | '3' // Patrimonio
  | '4' // Ingresos
  | '5' // Gastos
  | '6' // Costos de Ventas
  | '7'; // Costos de Producción

export interface AccountItem {
  code: string;
  name: string;
  nature: AccountNature;
  class: AccountClass;
  category: 'BALANCE' | 'RESULTADO';
  initialDebit: number;
  initialCredit: number;
  description?: string;
}

export interface AdjustmentLine {
  accountCode: string;
  accountName?: string;
  debit: number;
  credit: number;
  note?: string;
}

export interface AdjustmentEntry {
  id: string;
  date: string;
  codeNumber: string; // ej: ADJ-001
  title: string;
  description: string;
  category: 
    | 'DEPRECIACION' 
    | 'AMORTIZACION_DIFERIDO' 
    | 'GASTO_ACUMULADO' 
    | 'INGRESO_ACUMULADO' 
    | 'DETERIORO_CARTERA' 
    | 'ARQUEO_INVENTARIO' 
    | 'CORRECCION_ERROR';
  lines: AdjustmentLine[];
  normativeReference: string; // ej: NIC 16 / NIIF Pymes Secc. 17
  isSenaCaseStep?: boolean;
}

export interface WorksheetRow {
  code: string;
  name: string;
  nature: AccountNature;
  class: AccountClass;
  category: 'BALANCE' | 'RESULTADO';
  // 1-2 Balance de Comprobación
  initialDebit: number;
  initialCredit: number;
  // 3-4 Ajustes
  adjustmentDebit: number;
  adjustmentCredit: number;
  // 5-6 Balance Ajustado
  adjustedDebit: number;
  adjustedCredit: number;
  // 7-8 Estado de Resultados
  incomeDebit: number;
  incomeCredit: number;
  // 9-10 Estado de Situación Financiera
  balanceSheetDebit: number;
  balanceSheetCredit: number;
  // Flags
  hasAdjustment: boolean;
}

export interface WorksheetTotals {
  initialDebit: number;
  initialCredit: number;
  initialBalanced: boolean;
  initialDiff: number;

  adjustmentDebit: number;
  adjustmentCredit: number;
  adjustmentBalanced: boolean;
  adjustmentDiff: number;

  adjustedDebit: number;
  adjustedCredit: number;
  adjustedBalanced: boolean;
  adjustedDiff: number;

  incomeDebit: number;
  incomeCredit: number;
  netIncome: number; // Resultado del ejercicio: Credito - Debito
  incomeBalancedWithResult: boolean;

  balanceSheetDebit: number;
  balanceSheetCredit: number;
  balanceSheetBalancedWithResult: boolean;

  isOverallWorksheetBalanced: boolean;
}

export interface SenaExerciseCase {
  id: string;
  title: string;
  companyName: string;
  nit: string;
  period: string;
  difficulty: 'Inicial' | 'Intermedio' | 'Avanzado';
  context: string;
  instructions: string[];
  initialAccounts: AccountItem[];
  suggestedAdjustments: Omit<AdjustmentEntry, 'id'>[];
}

export interface SenaAuditIssue {
  type: 'ERROR' | 'WARNING' | 'SUCCESS';
  title: string;
  description: string;
  recommendation: string;
}

export interface SenaAuditResult {
  score: number; // 0 - 100
  qualification: 'COMPETENTE / APROBADO' | 'EN PROCESO' | 'NO APROBADO - REVISION REQUERIDA';
  summary: string;
  issues: SenaAuditIssue[];
  balancedBlocks: {
    initial: boolean;
    adjustments: boolean;
    adjusted: boolean;
    results: boolean;
    balanceSheet: boolean;
  };
}
