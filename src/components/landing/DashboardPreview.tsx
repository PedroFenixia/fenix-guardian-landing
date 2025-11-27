import { Activity, AlertTriangle, Users, TrendingUp, Clock, Shield } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Panel de control <span className="text-primary">centralizado</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Visualiza toda la actividad de tu equipo en tiempo real con nuestro dashboard intuitivo y potente.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-6xl mx-auto">
          <div className="glass-card neon-border p-2 lg:p-4 rounded-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-muted/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground">
                  dashboard.fenixguardian.com
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 lg:p-6 space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Usuarios activos", value: "127", icon: Users, trend: "+12%" },
                  { label: "Tiempo productivo", value: "87%", icon: Clock, trend: "+5%" },
                  { label: "Alertas hoy", value: "3", icon: AlertTriangle, trend: "-40%" },
                  { label: "Score seguridad", value: "94", icon: Shield, trend: "+2%" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/30 rounded-xl p-4 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-primary'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Activity chart */}
                <div className="lg:col-span-2 bg-muted/30 rounded-xl p-4 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Actividad semanal</h4>
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="h-40 flex items-end gap-2">
                    {[65, 80, 45, 90, 70, 85, 60].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk alerts */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Alertas recientes</h4>
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { text: "Acceso inusual detectado", time: "Hace 2h", level: "high" },
                      { text: "Software no autorizado", time: "Hace 5h", level: "medium" },
                      { text: "Sesión prolongada", time: "Hace 1d", level: "low" },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          alert.level === 'high' ? 'bg-destructive' : 
                          alert.level === 'medium' ? 'bg-yellow-500' : 'bg-primary'
                        }`} />
                        <div className="flex-1">
                          <p className="text-foreground">{alert.text}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team performance */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Rendimiento por equipo</h4>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { team: "Desarrollo", score: 92 },
                    { team: "Marketing", score: 88 },
                    { team: "Ventas", score: 95 },
                    { team: "Soporte", score: 85 },
                  ].map((item) => (
                    <div key={item.team} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className="fill-none stroke-muted stroke-[4]"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className="fill-none stroke-primary stroke-[4]"
                            strokeDasharray={`${item.score * 1.76} 176`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.team}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
