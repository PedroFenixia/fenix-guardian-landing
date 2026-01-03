import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, Eye, Clock, LogOut, Globe, Target } from 'lucide-react';

interface AnalyticsData {
  total_visits: number;
  unique_sessions: number;
  avg_time_on_page: number;
  top_pages: Array<{ page_path: string; visits: number }>;
  top_referrers: Array<{ referrer: string; visits: number }>;
  utm_sources: Array<{ utm_source: string; visits: number }>;
  utm_campaigns: Array<{ utm_campaign: string; visits: number }>;
  exit_pages: Array<{ page_path: string; exits: number }>;
  visits_by_day: Array<{ date: string; visits: number }>;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: result, error: fetchError } = await supabase.rpc('get_analytics_summary');
        
        if (fetchError) {
          // For demo purposes, show mock data if not admin
          if (fetchError.message.includes('Access denied')) {
            setData(getMockData());
            setError('Vista demo - Los datos reales requieren rol de administrador');
          } else {
            throw fetchError;
          }
        } else {
          setData(result as unknown as AnalyticsData);
        }
      } catch (err) {
        setData(getMockData());
        setError('Vista demo - Los datos reales requieren rol de administrador');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Error al cargar los datos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Métricas de visitas y comportamiento de usuarios</p>
          {error && (
            <Badge variant="secondary" className="mt-2">{error}</Badge>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Visitas</p>
                  <p className="text-3xl font-bold text-foreground">{data.total_visits.toLocaleString()}</p>
                </div>
                <Eye className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sesiones Únicas</p>
                  <p className="text-3xl font-bold text-foreground">{data.unique_sessions.toLocaleString()}</p>
                </div>
                <Users className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                  <p className="text-3xl font-bold text-foreground">{formatTime(data.avg_time_on_page)}</p>
                </div>
                <Clock className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de Rebote</p>
                  <p className="text-3xl font-bold text-foreground">
                    {data.unique_sessions > 0 
                      ? Math.round((data.exit_pages.reduce((a, b) => a + b.exits, 0) / data.total_visits) * 100) 
                      : 0}%
                  </p>
                </div>
                <LogOut className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visits by Day */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Visitas por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.visits_by_day.slice().reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Páginas Más Visitadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.top_pages} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="page_path" 
                      stroke="hsl(var(--muted-foreground))" 
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* UTM Sources */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Fuentes UTM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                {data.utm_sources.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.utm_sources}
                        dataKey="visits"
                        nameKey="utm_source"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ utm_source }) => utm_source}
                      >
                        {data.utm_sources.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Sin datos UTM
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referrers */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {data.top_referrers.length > 0 ? (
                  data.top_referrers.map((ref, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate max-w-[180px]" title={ref.referrer}>
                        {formatReferrer(ref.referrer)}
                      </span>
                      <Badge variant="secondary">{ref.visits}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Sin referrers externos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exit Pages */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Páginas de Salida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {data.exit_pages.length > 0 ? (
                  data.exit_pages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{page.page_path}</span>
                      <Badge variant="outline">{page.exits}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Sin datos de salida
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns */}
        {data.utm_campaigns.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Campañas UTM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.utm_campaigns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="utm_campaign" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="visits" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatReferrer(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.slice(0, 30);
  }
}

function getMockData(): AnalyticsData {
  return {
    total_visits: 1247,
    unique_sessions: 892,
    avg_time_on_page: 124,
    top_pages: [
      { page_path: '/', visits: 523 },
      { page_path: '/contacto', visits: 245 },
      { page_path: '/nosotros', visits: 189 },
      { page_path: '/carreras', visits: 156 },
      { page_path: '/privacidad', visits: 67 },
    ],
    top_referrers: [
      { referrer: 'https://google.com', visits: 312 },
      { referrer: 'https://linkedin.com', visits: 189 },
      { referrer: 'https://twitter.com', visits: 78 },
    ],
    utm_sources: [
      { utm_source: 'google', visits: 245 },
      { utm_source: 'linkedin', visits: 156 },
      { utm_source: 'email', visits: 89 },
    ],
    utm_campaigns: [
      { utm_campaign: 'launch_2024', visits: 156 },
      { utm_campaign: 'brand_awareness', visits: 89 },
      { utm_campaign: 'webinar_q1', visits: 45 },
    ],
    exit_pages: [
      { page_path: '/contacto', exits: 189 },
      { page_path: '/', exits: 156 },
      { page_path: '/carreras', exits: 78 },
    ],
    visits_by_day: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
      visits: Math.floor(Math.random() * 100) + 50,
    })),
  };
}
