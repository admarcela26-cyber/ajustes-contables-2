import {
  AccountItem,
  AdjustmentEntry,
  SenaAuditResult,
  SenaAuditIssue,
  WorksheetRow,
  WorksheetTotals,
} from '../types/accounting';
import { PUC_STANDARD_LIST, getPucAccount } from '../data/pucStandard';

export function calculateWorksheet(
  accounts: AccountItem[],
  adjustments: AdjustmentEntry[]
): {
  rows: WorksheetRow[];
  totals: WorksheetTotals;
  audit: SenaAuditResult;
} {
  // 1. Gather all accounts involved: base accounts + any new accounts introduced by adjustments
  const accountMap = new Map<string, AccountItem>();

  accounts.forEach((acc) => {
    accountMap.set(acc.code, { ...acc });
  });

  // Check adjustments for accounts not in initial list
  adjustments.forEach((adj) => {
    adj.lines.forEach((line) => {
      if (!accountMap.has(line.accountCode)) {
        const standardInfo = getPucAccount(line.accountCode);
        const codeClass = line.accountCode.charAt(0) as any;
        const isIncomeOrExpense = ['4', '5', '6', '7'].includes(codeClass);
        const defaultNature = standardInfo
          ? standardInfo.nature
          : isIncomeOrExpense && codeClass !== '4'
          ? 'DEBIT'
          : codeClass === '1'
          ? 'DEBIT'
          : 'CREDIT';

        accountMap.set(line.accountCode, {
          code: line.accountCode,
          name: standardInfo ? standardInfo.name : `Cuenta ${line.accountCode}`,
          nature: defaultNature,
          class: codeClass,
          category: isIncomeOrExpense ? 'RESULTADO' : 'BALANCE',
          initialDebit: 0,
          initialCredit: 0,
          description: standardInfo?.description,
        });
      }
    });
  });

  // Calculate total adjustments per account
  const adjDebits = new Map<string, number>();
  const adjCredits = new Map<string, number>();

  adjustments.forEach((adj) => {
    adj.lines.forEach((line) => {
      adjDebits.set(
        line.accountCode,
        (adjDebits.get(line.accountCode) || 0) + (line.debit || 0)
      );
      adjCredits.set(
        line.accountCode,
        (adjCredits.get(line.accountCode) || 0) + (line.credit || 0)
      );
    });
  });

  // Sort accounts by PUC code
  const sortedAccounts = Array.from(accountMap.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  );

  const rows: WorksheetRow[] = [];

  let sumInitDeb = 0;
  let sumInitCred = 0;
  let sumAdjDeb = 0;
  let sumAdjCred = 0;
  let sumAdjBalDeb = 0;
  let sumAdjBalCred = 0;
  let sumIncDeb = 0;
  let sumIncCred = 0;
  let sumBsDeb = 0;
  let sumBsCred = 0;

  sortedAccounts.forEach((acc) => {
    const initDeb = acc.initialDebit || 0;
    const initCred = acc.initialCredit || 0;
    const adjDeb = adjDebits.get(acc.code) || 0;
    const adjCred = adjCredits.get(acc.code) || 0;

    // Calculate Adjusted Balance according to account nature
    let adjBalDeb = 0;
    let adjBalCred = 0;

    if (acc.nature === 'DEBIT') {
      // Normal debit account (Assets, Expenses, Costs)
      const balance = initDeb - initCred + (adjDeb - adjCred);
      if (balance >= 0) {
        adjBalDeb = balance;
        adjBalCred = 0;
      } else {
        // Contrary balance
        adjBalDeb = 0;
        adjBalCred = Math.abs(balance);
      }
    } else {
      // Normal credit account (Liabilities, Equity, Incomes, Contra-assets like 1592, 1399)
      const balance = initCred - initDeb + (adjCred - adjDeb);
      if (balance >= 0) {
        adjBalDeb = 0;
        adjBalCred = balance;
      } else {
        // Contrary balance
        adjBalDeb = Math.abs(balance);
        adjBalCred = 0;
      }
    }

    // Determine destination column: Estado de Resultados vs Situación Financiera
    let incDeb = 0;
    let incCred = 0;
    let bsDeb = 0;
    let bsCred = 0;

    if (acc.category === 'RESULTADO') {
      incDeb = adjBalDeb;
      incCred = adjBalCred;
    } else {
      bsDeb = adjBalDeb;
      bsCred = adjBalCred;
    }

    sumInitDeb += initDeb;
    sumInitCred += initCred;
    sumAdjDeb += adjDeb;
    sumAdjCred += adjCred;
    sumAdjBalDeb += adjBalDeb;
    sumAdjBalCred += adjBalCred;
    sumIncDeb += incDeb;
    sumIncCred += incCred;
    sumBsDeb += bsDeb;
    sumBsCred += bsCred;

    rows.push({
      code: acc.code,
      name: acc.name,
      nature: acc.nature,
      class: acc.class,
      category: acc.category,
      initialDebit: initDeb,
      initialCredit: initCred,
      adjustmentDebit: adjDeb,
      adjustmentCredit: adjCred,
      adjustedDebit: adjBalDeb,
      adjustedCredit: adjBalCred,
      incomeDebit: incDeb,
      incomeCredit: incCred,
      balanceSheetDebit: bsDeb,
      balanceSheetCredit: bsCred,
      hasAdjustment: adjDeb > 0 || adjCred > 0,
    });
  });

  // Net Income calculation
  // Total revenues (incCred) - Total expenses/costs (incDeb)
  const netIncome = sumIncCred - sumIncDeb;

  // Balancing logic
  const initialBalanced = Math.abs(sumInitDeb - sumInitCred) < 0.01;
  const initialDiff = sumInitDeb - sumInitCred;

  const adjustmentBalanced = Math.abs(sumAdjDeb - sumAdjCred) < 0.01;
  const adjustmentDiff = sumAdjDeb - sumAdjCred;

  const adjustedBalanced = Math.abs(sumAdjBalDeb - sumAdjBalCred) < 0.01;
  const adjustedDiff = sumAdjBalDeb - sumAdjBalCred;

  // Income statement balancing with net income
  // If netIncome > 0 (Utilidad), it adds to debit side of income statement
  // And it adds to credit side of balance sheet!
  const finalIncomeDebWithNet = netIncome >= 0 ? sumIncDeb + netIncome : sumIncDeb;
  const finalIncomeCredWithNet = netIncome < 0 ? sumIncCred + Math.abs(netIncome) : sumIncCred;
  const incomeBalancedWithResult =
    Math.abs(finalIncomeDebWithNet - finalIncomeCredWithNet) < 0.01;

  const finalBsDebWithNet = netIncome < 0 ? sumBsDeb + Math.abs(netIncome) : sumBsDeb;
  const finalBsCredWithNet = netIncome >= 0 ? sumBsCred + netIncome : sumBsCred;
  const balanceSheetBalancedWithResult =
    Math.abs(finalBsDebWithNet - finalBsCredWithNet) < 0.01;

  const isOverallWorksheetBalanced =
    initialBalanced &&
    adjustmentBalanced &&
    adjustedBalanced &&
    incomeBalancedWithResult &&
    balanceSheetBalancedWithResult;

  const totals: WorksheetTotals = {
    initialDebit: sumInitDeb,
    initialCredit: sumInitCred,
    initialBalanced,
    initialDiff,
    adjustmentDebit: sumAdjDeb,
    adjustmentCredit: sumAdjCred,
    adjustmentBalanced,
    adjustmentDiff,
    adjustedDebit: sumAdjBalDeb,
    adjustedCredit: sumAdjBalCred,
    adjustedBalanced,
    adjustedDiff,
    incomeDebit: sumIncDeb,
    incomeCredit: sumIncCred,
    netIncome,
    incomeBalancedWithResult,
    balanceSheetDebit: sumBsDeb,
    balanceSheetCredit: sumBsCred,
    balanceSheetBalancedWithResult,
    isOverallWorksheetBalanced,
  };

  // Perform SENA pedagogical audit
  const issues: SenaAuditIssue[] = [];
  let score = 100;

  // 1. Initial Balance check
  if (!initialBalanced) {
    score -= 30;
    issues.push({
      type: 'ERROR',
      title: 'Desbalance en Balance de Comprobación Inicial',
      description: `Los débitos ($${sumInitDeb.toLocaleString('es-CO')}) y créditos ($${sumInitCred.toLocaleString('es-CO')}) iniciales no son iguales. Diferencia: $${Math.abs(initialDiff).toLocaleString('es-CO')}.`,
      recommendation:
        'Verifique el registro de asientos preliminares antes de iniciar la etapa de ajustes. La partida doble inicial es un requisito insoslayable.',
    });
  } else {
    issues.push({
      type: 'SUCCESS',
      title: 'Balance de Comprobación Inicial Equilibrado',
      description: `Las sumas iniciales guardan partida doble perfecta ($${sumInitDeb.toLocaleString('es-CO')}).`,
      recommendation: 'Continúe con el registro metódico de los ajustes del período.',
    });
  }

  // 2. Adjustments check
  if (adjustments.length === 0) {
    score -= 25;
    issues.push({
      type: 'WARNING',
      title: 'Sin Asientos de Ajuste Registrados',
      description:
        'Aún no se ha registrado ningún asiento de ajuste en el período contable.',
      recommendation:
        'Analice las transacciones pendientes: depreciación de activos fijos, amortización de diferidos y causación de gastos/ingresos acumulados.',
    });
  } else if (!adjustmentBalanced) {
    score -= 35;
    issues.push({
      type: 'ERROR',
      title: 'Partida Doble Rota en la Columna de Ajustes',
      description: `Los ajustes débitos ($${sumAdjDeb.toLocaleString('es-CO')}) no coinciden con los créditos ($${sumAdjCred.toLocaleString('es-CO')}). Descuadre: $${Math.abs(adjustmentDiff).toLocaleString('es-CO')}.`,
      recommendation:
        'Revise cada asiento de ajuste en el comprobante diario. Cada registro debe tener débitos y créditos estrictamente iguales.',
    });
  } else {
    // Check individual entries for internal balance
    const unbalancedEntry = adjustments.find((a) => {
      const d = a.lines.reduce((acc, l) => acc + (l.debit || 0), 0);
      const c = a.lines.reduce((acc, l) => acc + (l.credit || 0), 0);
      return Math.abs(d - c) > 0.01;
    });

    if (unbalancedEntry) {
      score -= 20;
      issues.push({
        type: 'ERROR',
        title: `Asiento Individual Descuadrado: ${unbalancedEntry.codeNumber}`,
        description: `El asiento "${unbalancedEntry.title}" tiene débitos y créditos desiguales.`,
        recommendation:
          'Corrija los importes en las líneas del asiento para restablecer el principio de partida doble.',
      });
    } else {
      issues.push({
        type: 'SUCCESS',
        title: 'Asientos de Ajuste Cuadrados',
        description: `Se han aplicado ${adjustments.length} asientos con estricta partida doble ($${sumAdjDeb.toLocaleString('es-CO')}).`,
        recommendation:
          'Excelente aplicación del principio de devengo y medición posterior.',
      });
    }
  }

  // 3. Adjusted Balance check
  if (!adjustedBalanced) {
    score -= 20;
    issues.push({
      type: 'ERROR',
      title: 'Descuadre en Balance Ajustado',
      description: `El Balance Ajustado Débito ($${sumAdjBalDeb.toLocaleString('es-CO')}) difiere del Crédito ($${sumAdjBalCred.toLocaleString('es-CO')}).`,
      recommendation:
        'Revise la fórmula de suma algebraica de acuerdo con la naturaleza de cada cuenta contable.',
    });
  } else {
    issues.push({
      type: 'SUCCESS',
      title: 'Balance Ajustado en Sumas Iguales',
      description: `El Balance Ajustado cuadra en $${sumAdjBalDeb.toLocaleString('es-CO')}.`,
      recommendation: 'Los saldos ajustados están listos para la distribución a estados financieros.',
    });
  }

  // 4. Financial Statements & Result Transfer check
  if (isOverallWorksheetBalanced) {
    issues.push({
      type: 'SUCCESS',
      title: 'Hoja de Trabajo 100% Cuadrada y Conforme a NIIF',
      description: `El resultado del ejercicio (${netIncome >= 0 ? 'Utilidad' : 'Pérdida'} de $${Math.abs(netIncome).toLocaleString('es-CO')}) equilibra con exactitud tanto el Estado de Resultados como el Estado de Situación Financiera.`,
      recommendation:
        'El ciclo de cierre contable es impecable. Puede proceder a emitir los Estados Financieros formales.',
    });
  } else {
    score -= 15;
    issues.push({
      type: 'WARNING',
      title: 'Verificación de Traslado de Resultados',
      description:
        'La utilidad o pérdida calculada no está cuadrando simultáneamente el Estado de Resultados y el Balance.',
      recommendation:
        'Verifique que no haya cuentas de balance asignadas a resultados ni viceversa.',
    });
  }

  // Final grade calculation
  score = Math.max(0, Math.min(100, score));
  let qualification: 'COMPETENTE / APROBADO' | 'EN PROCESO' | 'NO APROBADO - REVISION REQUERIDA';
  if (score >= 90 && isOverallWorksheetBalanced) {
    qualification = 'COMPETENTE / APROBADO';
  } else if (score >= 60) {
    qualification = 'EN PROCESO';
  } else {
    qualification = 'NO APROBADO - REVISION REQUERIDA';
  }

  const summary =
    qualification === 'COMPETENTE / APROBADO'
      ? '¡Felicitaciones aprendiz! Ha alcanzado el resultado de aprendizaje satisfactoriamente. Su Hoja de Trabajo cumple con todos los principios técnicos contables colombianos y la normativa NIIF.'
      : qualification === 'EN PROCESO'
      ? 'Buen avance. Se detectaron algunas inconsistencias en los asientos de ajuste o en la distribución de cuentas que debe subsanar para alcanzar la competencia.'
      : 'Se requiere revisión integral. Existen desbalances sustanciales en la partida doble o en los saldos de la hoja de trabajo. Consulte la guía didáctica y realice las correcciones sugeridas.';

  const audit: SenaAuditResult = {
    score,
    qualification,
    summary,
    issues,
    balancedBlocks: {
      initial: initialBalanced,
      adjustments: adjustmentBalanced,
      adjusted: adjustedBalanced,
      results: incomeBalancedWithResult,
      balanceSheet: balanceSheetBalancedWithResult,
    },
  };

  return {
    rows,
    totals,
    audit,
  };
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return '-';
  return '$' + Math.round(amount).toLocaleString('es-CO');
}
