import { AccountItem } from '../types/accounting';

export interface PucAccountTemplate {
  code: string;
  name: string;
  nature: 'DEBIT' | 'CREDIT';
  class: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  category: 'BALANCE' | 'RESULTADO';
  description: string;
}

export const PUC_STANDARD_LIST: PucAccountTemplate[] = [
  // CLASE 1 - ACTIVO
  {
    code: '1105',
    name: 'Caja General',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Efectivo en poder de la entidad disponible inmediatamente para operaciones.',
  },
  {
    code: '1110',
    name: 'Bancos Nacionales',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Depósitos monetarios en cuentas corrientes o de ahorro en entidades financieras.',
  },
  {
    code: '1305',
    name: 'Clientes Nacionales (Cuentas por Cobrar)',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Derechos de cobro a clientes por venta de bienes o prestación de servicios a crédito.',
  },
  {
    code: '1399',
    name: 'Deterioro de Cuentas por Cobrar (Provisión Cartera)',
    nature: 'CREDIT',
    class: '1',
    category: 'BALANCE',
    description: 'Cuenta correctora de activo. Estima la pérdida por incobrabilidad según NIIF Pymes Secc. 11.',
  },
  {
    code: '1435',
    name: 'Inventarios (Mercancías no Fabricadas por la Empresa)',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Bienes adquiridos a terceros destinados para la venta en el giro ordinario del negocio.',
  },
  {
    code: '1524',
    name: 'Equipo de Oficina (Muebles y Enseres)',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Propiedad, planta y equipo usada en administración o comercialización.',
  },
  {
    code: '1528',
    name: 'Equipo de Computación y Comunicación',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Equipos tecnológicos tangibles sujetos a desgaste por uso u obsolescencia.',
  },
  {
    code: '1540',
    name: 'Flota y Equipo de Transporte',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Vehículos automotores al servicio de las actividades de la entidad.',
  },
  {
    code: '1592',
    name: 'Depreciación Acumulada',
    nature: 'CREDIT',
    class: '1',
    category: 'BALANCE',
    description: 'Cuenta correctora de activo que refleja el desgaste acumulado de Propiedad, Planta y Equipo.',
  },
  {
    code: '1705',
    name: 'Gastos Pagados por Anticipado (Diferidos)',
    nature: 'DEBIT',
    class: '1',
    category: 'BALANCE',
    description: 'Servicios pagados antes de devengarse (seguros, intereses, suscripciones, arrendamiento).',
  },

  // CLASE 2 - PASIVO
  {
    code: '2105',
    name: 'Obligaciones Financieras (Bancos Nacionales)',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Créditos o pagarés adquiridos con instituciones bancarias autorizadas.',
  },
  {
    code: '2205',
    name: 'Proveedores Nacionales',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Obligaciones por adquisición de mercancías o materias primas a crédito.',
  },
  {
    code: '2335',
    name: 'Costos y Gastos por Pagar (Causaciones Pendientes)',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Pasivos causados pendientes de pago: servicios públicos, honorarios, intereses devengados.',
  },
  {
    code: '2365',
    name: 'Retención en la Fuente por Pagar',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Retenciones tributarias practicadas a terceros pendientes de declarar a la DIAN.',
  },
  {
    code: '2505',
    name: 'Salarios y Prestaciones Sociales por Pagar',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Obligaciones laborales devengadas con los trabajadores al corte del período.',
  },
  {
    code: '2705',
    name: 'Ingresos Recibidos por Anticipado (Pasivo Diferido)',
    nature: 'CREDIT',
    class: '2',
    category: 'BALANCE',
    description: 'Recursos recibidos de clientes por bienes o servicios pendientes de entregar/devengar.',
  },

  // CLASE 3 - PATRIMONIO
  {
    code: '3115',
    name: 'Capital Social / Aportes Sociales',
    nature: 'CREDIT',
    class: '3',
    category: 'BALANCE',
    description: 'Aportes de los socios o accionistas al constituir o capitalizar la sociedad.',
  },
  {
    code: '3305',
    name: 'Reservas Obligatorias (Reserva Legal)',
    nature: 'CREDIT',
    class: '3',
    category: 'BALANCE',
    description: 'Apropiaciones de utilidades exigidas por la ley comercial colombiana.',
  },
  {
    code: '3605',
    name: 'Utilidad del Ejercicio (Resultado del Período)',
    nature: 'CREDIT',
    class: '3',
    category: 'BALANCE',
    description: 'Beneficio neto generado en el período contable que incrementa el patrimonio.',
  },
  {
    code: '3610',
    name: 'Pérdida del Ejercicio',
    nature: 'DEBIT',
    class: '3',
    category: 'BALANCE',
    description: 'Déficit neto del período contable que reduce el patrimonio neto de la entidad.',
  },

  // CLASE 4 - INGRESOS
  {
    code: '4135',
    name: 'Comercio al por Mayor y al por Menor (Ingresos Ordinarios)',
    nature: 'CREDIT',
    class: '4',
    category: 'RESULTADO',
    description: 'Ingresos por venta de productos o mercancías durante el ciclo de operación.',
  },
  {
    code: '4210',
    name: 'Ingresos Financieros (Intereses y Rendimientos)',
    nature: 'CREDIT',
    class: '4',
    category: 'RESULTADO',
    description: 'Rendimientos generados por colocación de recursos o depósitos de la entidad.',
  },
  {
    code: '4220',
    name: 'Ingresos por Arrendamientos Devengados',
    nature: 'CREDIT',
    class: '4',
    category: 'RESULTADO',
    description: 'Alquiler de inmuebles o muebles propiedad de la compañía devengados en el período.',
  },

  // CLASE 5 - GASTOS
  {
    code: '5105',
    name: 'Gastos de Personal (Administración)',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Sueldos, prestaciones sociales y aportes de seguridad social de empleados administrativos.',
  },
  {
    code: '5110',
    name: 'Honorarios y Servicios Profesionales',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Pagos por asesorías jurídicas, contables, revisoría fiscal o auditorías.',
  },
  {
    code: '5120',
    name: 'Gastos de Arrendamientos',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Cánones de arrendamiento de oficinas o locales comerciales correspondientes al período.',
  },
  {
    code: '5125',
    name: 'Gastos de Seguros (Amortización Póliza)',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Valor devengado de las primas de seguro amortizadas en el período contable.',
  },
  {
    code: '5135',
    name: 'Servicios Públicos e Internet',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Energía eléctrica, acueducto, telefonía y conectividad consumida en el ejercicio.',
  },
  {
    code: '5160',
    name: 'Gastos de Depreciación (Propiedad, Planta y Equipo)',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Distribución sistemática del importe depreciable de los activos tangibles en su vida útil.',
  },
  {
    code: '5199',
    name: 'Gasto por Deterioro de Cartera (Pérdidas Crediticias)',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Reconocimiento del gasto por deterioro de valor de cuentas comerciales por cobrar.',
  },
  {
    code: '5305',
    name: 'Gastos Financieros (Intereses Bancarios)',
    nature: 'DEBIT',
    class: '5',
    category: 'RESULTADO',
    description: 'Causación de intereses remuneratorios sobre préstamos u obligaciones financieras.',
  },

  // CLASE 6 - COSTOS DE VENTAS
  {
    code: '6135',
    name: 'Costo de Ventas (Comercio al por Mayor y al por Menor)',
    nature: 'DEBIT',
    class: '6',
    category: 'RESULTADO',
    description: 'Costo de adquisición de las mercancías vendidas en el ejercicio contable.',
  },
];

export const getPucAccount = (code: string): PucAccountTemplate | undefined => {
  return PUC_STANDARD_LIST.find((a) => a.code === code);
};
