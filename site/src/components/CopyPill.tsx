import { useEffect, useRef, useState } from "react";
import { CopyIcon, CheckIcon } from "@/components/Icons";

type Props = { label: string; command: string };

export function CopyPill({ label, command }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 1100);
    } catch {
      /* clipboard blocked under file:// */
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${command}`}
      className="inline-flex items-center gap-2 h-10 pl-2.5 pr-3.5 rounded-full bg-surface border border-border-soft text-[13px] font-mono text-fg hover:bg-surface-alt transition-colors"
    >
      <span className="px-2 py-0.5 rounded-full bg-surface-alt text-fg-muted text-[12px]">
        {label}
      </span>
      <span>{command}</span>
      {copied ? (
        <CheckIcon className="size-4 text-fg-muted" />
      ) : (
        <CopyIcon className="size-4 text-fg-faint" />
      )}
    </button>
  );
}
