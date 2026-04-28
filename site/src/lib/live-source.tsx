import { createContext, useContext, useState, type ReactNode } from "react";

type Sources = Record<string, string>;

type Ctx = {
  get: (id: string) => string;
  set: (id: string, value: string) => void;
  reset: (id?: string) => void;
  isOverridden: (id: string) => boolean;
};

const Context = createContext<Ctx | null>(null);

type ProviderProps = { defaults: Sources; children: ReactNode };

export function LiveSourceProvider({ defaults, children }: ProviderProps) {
  const [overrides, setOverrides] = useState<Sources>({});
  const value: Ctx = {
    get: (id) => overrides[id] ?? defaults[id] ?? "",
    set: (id, v) => setOverrides((o) => ({ ...o, [id]: v })),
    reset: (id) =>
      setOverrides((o) => {
        if (!id) return {};
        const n = { ...o };
        delete n[id];
        return n;
      }),
    isOverridden: (id) => Object.prototype.hasOwnProperty.call(overrides, id),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLiveSource(id: string): string {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("LiveSourceProvider missing");
  return ctx.get(id);
}

export function useLiveSourceCtx(): Ctx {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("LiveSourceProvider missing");
  return ctx;
}
