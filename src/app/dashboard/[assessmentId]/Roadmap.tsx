import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink, Zap, TrendingUp, BookOpen, ChevronRight } from "lucide-react";

interface SkillGap {
  skillId: string;
  skill: string;
  target: number;
  self: number;
  weight: number;
  resource_url: string | null;
  gap: number;
  impact: number;
}

export function Roadmap({ gaps }: { gaps: SkillGap[] }) {
  const filteredGaps = gaps.filter((g) => g.gap > 0).slice(0, 6);

  if (filteredGaps.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Priority Roadmap</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Strategic Next Steps
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="text-primary w-8 h-8" />
          </div>
          <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">Market Ready</p>
          <p className="text-xs text-slate-400 mt-2 font-medium italic">
            You have surpassed all target requirements.
          </p>
        </CardContent>
      </Card>
    );
  }

  const categorize = (g: SkillGap) => {
    if (g.impact >= 5) return { 
      label: "Critical", 
      color: "bg-red-500", 
      text: "text-red-600 dark:text-red-400", 
      bg: "bg-red-50 dark:bg-red-950/30",
      icon: Zap 
    };
    if (g.impact >= 2) return { 
      label: "Growth", 
      color: "bg-amber-500", 
      text: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-50 dark:bg-amber-950/30",
      icon: TrendingUp 
    };
    return { 
      label: "Refinement", 
      color: "bg-blue-500", 
      text: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-50 dark:bg-blue-950/30",
      icon: BookOpen 
    };
  };

  const estimateTime = (gap: number) => {
    const weeks = gap * 2;
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  };

  return (
    <Card className="border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-md overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">Priority Roadmap</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">
              Optimized Learning Path
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-black text-[10px] uppercase border-2 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800">
            {filteredGaps.length} Action Items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredGaps.map((g, i) => {
            const cat = categorize(g);
            const Icon = cat.icon;
            return (
              <div 
                key={g.skillId} 
                className="group relative p-5 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className={`w-5 h-5 ${cat.text}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">{g.skill}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${cat.text}`}>
                          {cat.label}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase">{estimateTime(g.gap)} Est.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {g.resource_url ? (
                    <a 
                      href={g.resource_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
                    >
                      Learn
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800" />
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1">
                      Current Proficiency <span className="text-slate-300 dark:text-slate-700">/</span> Target
                    </span>
                    <span className="tabular-nums font-bold">
                      <span className={cat.text}>{g.self}</span>
                      <span className="mx-1 text-slate-300 dark:text-slate-700">/</span>
                      <span className="text-slate-700 dark:text-slate-200">{g.target}</span>
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                    {/* Target level marker (faint background) */}
                    <div 
                      className={`absolute top-0 left-0 h-full ${cat.color} opacity-10 transition-all duration-1000`}
                      style={{ width: `${(g.target / 4) * 100}%` }}
                    />
                    {/* Current level progress */}
                    <div 
                      className={`absolute top-0 left-0 h-full ${cat.color} transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.1)] rounded-full`} 
                      style={{ width: `${(g.self / 4) * 100}%` }}
                    />
                    {/* Gap highlights */}
                    <div 
                      className="absolute top-0 h-full bg-white/30 dark:bg-black/10 animate-pulse"
                      style={{ 
                        left: `${(g.self / 4) * 100}%`, 
                        width: `${((g.target - g.self) / 4) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <TrendingUp className="w-3 h-3" />
            <p className="text-[10px] font-bold uppercase tracking-tighter">
              Roadmap prioritized by business impact and skill weight
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
