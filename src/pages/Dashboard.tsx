import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  CreditCard,
  Home,
  Users2,
  Settings,
  HelpCircle,
  FileText,
  CreditCard as BillingIcon,
  BarChart2,
  MessageSquare,
  Box,
  X,
  ChevronRight,
  Zap,
  Layers,
  PieChart,
  LucideIcon
} from 'lucide-react';

import {
  AreaChart, 
  Area, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';

import DashboardLayout from '../components/DashboardLayout';

// Definição de tipos para os dados dos gráficos
interface RevenueDataPoint {
  name: string;
  value: number;
}

interface DailyRevenueDataPoint {
  name: string;
  value: number;
  acumulado: number;
}

interface ConversionDataPoint {
  name: string;
  taxa: number;
  media: number;
}

interface UserSegmentDataPoint {
  name: string;
  value: number;
}

// Dados para os gráficos
const revenueData: RevenueDataPoint[] = [
  { name: 'Jan', value: 42000 },
  { name: 'Fev', value: 55000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 78000 },
  { name: 'Jun', value: 74000 },
  { name: 'Jul', value: 65000 },
  { name: 'Ago', value: 71000 },
  { name: 'Set', value: 82000 },
  { name: 'Out', value: 95000 },
  { name: 'Nov', value: 102000 },
  { name: 'Dez', value: 115000 },
];

// Gerar dados dos últimos 30 dias (27 de fevereiro a 27 de março)
const generateLast30DaysData = (): DailyRevenueDataPoint[] => {
  const resultado = [];
  const hoje = new Date(2023, 2, 27); // 27 de março de 2023
  const totalMensal = 243952.54; // Faturamento do mês
  
  // Valores fixos para alguns dias específicos:
  // Hoje (27/03): R$ 19.891 (do card)
  // Ontem (26/03): R$ 16.200
  // Anteontem (25/03): R$ 8.300
  // 24/03: R$ 13.000
  
  // Vamos criar valores com variações significativas
  const valoresFixos: Record<number, number> = {
    29: 19891, // 27/03 (hoje)
    28: 16200, // 26/03 (ontem)
    27: 8300,  // 25/03 (anteontem)
    26: 13000, // 24/03
    // Outros dias com variação
    23: 7800,  // 21/03
    20: 12500, // 18/03
    18: 6700,  // 16/03
    15: 11300, // 13/03
    10: 5500,  // 08/03
    5: 9800,   // 03/03
    2: 4500,   // 28/02
  };
  
  // Criar array base para os 30 dias (começa com valores mais baixos)
  const valoresBase = [];
  for (let i = 0; i < 30; i++) {
    // Se for um dia com valor fixo, use esse valor
    if (valoresFixos[i] !== undefined) {
      valoresBase.push(valoresFixos[i]);
    } else {
      // Para os outros dias, gere valores com uma tendência de crescimento,
      // mas com variações significativas
      
      // Base inicial que cresce ao longo do mês (de ~4000 a ~9000)
      const base = 4000 + (i / 29) * 5000;
      
      // Variação significativa para criar altos e baixos (-50% a +50% da base)
      const variacao = base * (Math.random() - 0.5);
      
      // Adiciona um fator cíclico para simular padrões de negócio (ex: picos em dias específicos)
      const ciclico = Math.sin(i * 0.4) * 1000; 
      
      // Resultado final com variações significativas
      valoresBase.push(Math.round(base + variacao + ciclico));
    }
  }
  
  // Calcular a soma atual
  const somaAtual = valoresBase.reduce((sum, val) => sum + val, 0);
  
  // Ajustar para que a soma seja igual ao total mensal, mas preservando os valores fixos
  const diasAjustaveis = Array.from({ length: 30 }, (_, i) => i).filter(i => valoresFixos[i] === undefined);
  const somaFixa = Object.values(valoresFixos).reduce((sum, val) => sum + val, 0);
  const somaAjustavel = somaAtual - somaFixa;
  const fatorAjuste = (totalMensal - somaFixa) / somaAjustavel;
  
  const valoresAjustados = valoresBase.map((valor, idx) => {
    if (valoresFixos[idx] !== undefined) {
      return valoresFixos[idx]; // Mantém os valores fixos
    }
    return Math.round(valor * fatorAjuste); // Ajusta os outros valores
  });
  
  // Fazer ajuste final para garantir o total exato
  const somaFinal = valoresAjustados.reduce((sum, val) => sum + val, 0);
  const diferenca = Math.round(totalMensal) - somaFinal;
  
  // Distribuir a diferença entre os dias ajustáveis (que não têm valores fixos)
  if (diasAjustaveis.length > 0) {
    const ajustePorDia = Math.floor(diferenca / diasAjustaveis.length);
    diasAjustaveis.forEach(idx => {
      valoresAjustados[idx] += ajustePorDia;
    });
    
    // Ajustar os centavos no primeiro dia ajustável
    const somaNova = valoresAjustados.reduce((sum, val) => sum + val, 0);
    if (diasAjustaveis.length > 0) {
      valoresAjustados[diasAjustaveis[0]] += Math.round(totalMensal) - somaNova;
    }
  }
  
  // Criar os objetos de dados finais
  let acumulado = 0;
  for (let i = 0; i < 30; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - (29 - i)); // Começa do dia 27/02
    
    acumulado += valoresAjustados[i];
    
    resultado.push({
      name: data.getDate().toString().padStart(2, '0') + '/' + (data.getMonth() + 1).toString().padStart(2, '0'),
      value: valoresAjustados[i],
      acumulado: acumulado
    });
  }
  
  return resultado;
};

const dailyRevenueData: DailyRevenueDataPoint[] = generateLast30DaysData();

const conversionData: ConversionDataPoint[] = [
  { name: 'Seg', taxa: 3.2, media: 2.8 },
  { name: 'Ter', taxa: 3.5, media: 2.8 },
  { name: 'Qua', taxa: 4.1, media: 2.8 },
  { name: 'Qui', taxa: 3.8, media: 2.8 },
  { name: 'Sex', taxa: 4.5, media: 2.8 },
  { name: 'Sáb', taxa: 5.2, media: 2.8 },
  { name: 'Dom', taxa: 4.8, media: 2.8 },
];

const userSegmentData: UserSegmentDataPoint[] = [
  { name: 'Premium', value: 45 },
  { name: 'Plus', value: 30 },
  { name: 'Basic', value: 25 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

interface SidebarMenuItemProps {
  icon: LucideIcon;
  text: string;
  active?: boolean;
  children?: React.ReactNode;
}

function SidebarMenuItem({ icon: Icon, text, active = false, children = null }: SidebarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
            active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{text}</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-2 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{text}</span>
    </button>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white">
            <Box className="w-5 h-5" />
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">Trafegante Pro</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        <SidebarMenuItem icon={Home} text="Dashboard" active />
        
        <SidebarMenuItem icon={Users2} text="Clientes">
          <SidebarMenuItem icon={Users} text="Lista de Clientes" />
          <SidebarMenuItem icon={Activity} text="Segmentação" />
          <SidebarMenuItem icon={MessageSquare} text="Feedback" />
        </SidebarMenuItem>
        
        <SidebarMenuItem icon={BillingIcon} text="Faturamento">
          <SidebarMenuItem icon={CreditCard} text="Cobranças" />
          <SidebarMenuItem icon={FileText} text="Faturas" />
          <SidebarMenuItem icon={DollarSign} text="Preços" />
        </SidebarMenuItem>
        
        <SidebarMenuItem icon={BarChart2} text="Analytics">
          <SidebarMenuItem icon={TrendingUp} text="Crescimento" />
          <SidebarMenuItem icon={Users} text="Retenção" />
          <SidebarMenuItem icon={Activity} text="Engajamento" />
        </SidebarMenuItem>
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <SidebarMenuItem icon={Settings} text="Configurações" />
          <SidebarMenuItem icon={HelpCircle} text="Suporte" />
        </div>
      </nav>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  trendColor?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, trend, trendValue, trendColor = 'blue', subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-600 font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-${trendColor}-50`}>
          <Icon className={`w-6 h-6 text-${trendColor}-500`} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 tracking-tight mb-2">{value}</p>
        {trend && (
          <div className={`inline-flex items-center ${trend === 'up' ? `text-${trendColor}-500` : 'text-red-500'} bg-${trend === 'up' ? `${trendColor}` : 'red'}-50 px-2.5 py-1 rounded-lg text-sm font-medium`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            <span>{trendValue}% vs mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Faturamento Diário</h3>
          <p className="text-gray-500 text-sm mt-1">Últimos 30 dias (27/02 - 27/03)</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600 font-medium bg-blue-50 rounded-lg px-3 py-1.5">
            Total: <span className="font-bold text-blue-600">R$ 243.952,54</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={dailyRevenueData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => value.split('/')[0]} // Mostra apenas o dia
              interval={2} // Mostra apenas alguns dias para não ficar muito denso
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#6b7280' }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `R$ ${value.toLocaleString()}`} 
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#10b981' }} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} 
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'value') return [`R$ ${Number(value).toLocaleString()}`, 'Receita do dia'];
                if (name === 'acumulado') return [`R$ ${Number(value).toLocaleString()}`, 'Acumulado'];
                return [value, name];
              }}
              labelFormatter={(label) => `Dia: ${label}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'value') return <span className="text-blue-600">Receita Diária</span>;
                if (value === 'acumulado') return <span className="text-green-600">Acumulado no Mês</span>;
                return value;
              }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="value" 
              name="value"
              stroke="#3b82f6" 
              fill="url(#colorRevenue)" 
              fillOpacity={0.8}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="acumulado" 
              name="acumulado"
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ConversionChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Taxa de Conversão</h3>
          <p className="text-gray-500 text-sm mt-1">Última semana vs média</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={conversionData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
            <Tooltip 
              formatter={(value) => [`${value}%`, value === 'taxa' ? 'Taxa atual' : 'Média']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="taxa" 
              name="Taxa atual" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="media" 
              name="Média histórica"
              stroke="#9ca3af" 
              strokeDasharray="5 5" 
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SegmentationChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Segmentação de Clientes</h3>
          <p className="text-gray-500 text-sm mt-1">Por plano</p>
        </div>
      </div>
      
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={userSegmentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {userSegmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentual']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Métricas Principais</h3>
        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center">
          <span>Ver relatório completo</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-blue-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">Taxa de Conversão</p>
              <p className="text-sm text-gray-400">Últimos 30 dias</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">4.28%</p>
            <p className="text-sm text-blue-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +0.8% mês anterior
            </p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-green-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">LTV Médio</p>
              <p className="text-sm text-gray-400">Por cliente</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">R$ 4.892</p>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% mês anterior
            </p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-purple-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">Churn Rate</p>
              <p className="text-sm text-gray-400">Mensal</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">1.2%</p>
            <p className="text-sm text-purple-500 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -0.3% mês anterior
            </p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-indigo-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">Tempo de Aquisição</p>
              <p className="text-sm text-gray-400">Média em dias</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">5.4 dias</p>
            <p className="text-sm text-indigo-500 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -1.2 dias vs anterior
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">Acompanhe seus principais indicadores em tempo real</p>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            <div className="w-64">
              <StatCard
                title="Total de Usuários"
                subtitle="Ativos na plataforma"
                value="6.838"
                icon={Users}
                trend="up"
                trendValue="12.5"
                trendColor="blue"
              />
            </div>
            <div className="w-64">
              <StatCard
                title="Faturamento Total"
                subtitle="Acumulado do ano"
                value="R$ 684.765,82"
                icon={DollarSign}
                trend="up"
                trendValue="8.2"
                trendColor="green"
              />
            </div>
            <div className="w-64">
              <StatCard
                title="Faturamento do Mês"
                subtitle="Mês atual"
                value="R$ 243.952,54"
                icon={Layers}
                trend="up"
                trendValue="9.3"
                trendColor="green"
              />
            </div>
            <div className="w-64">
              <StatCard
                title="Faturamento Hoje"
                subtitle="Atualizado em tempo real"
                value="R$ 19.891,31"
                icon={CreditCard}
                trend="up"
                trendValue="15.3"
                trendColor="purple"
              />
            </div>
            <div className="w-64">
              <StatCard
                title="MRR Previsto"
                subtitle="Próximo mês"
                value="R$ 195.472"
                icon={TrendingUp}
                trend="up"
                trendValue="5.7"
                trendColor="indigo"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <RevenueChart />
          </div>
          <div>
            <MetricsCard />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConversionChart />
          <SegmentationChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 