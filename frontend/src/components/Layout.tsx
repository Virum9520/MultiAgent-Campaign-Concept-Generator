import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950 text-white grid-bg">
      <header className="border-b border-cyber-500/10 bg-surface-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative h-9 w-9 rounded bg-surface-800 border border-cyber-500/30 flex items-center justify-center glow-cyan">
              <span className="text-xs font-bold text-cyber-400 tracking-tighter font-mono">
                TRG
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Campaign Concept Generator
              </h1>
              <span className="text-[10px] font-mono text-cyber-500/60 uppercase tracking-widest">
                Agentic AI System
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-500"></span>
            </span>
            <span className="text-[11px] font-mono text-surface-400">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
