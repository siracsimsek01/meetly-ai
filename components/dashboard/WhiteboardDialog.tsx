'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Download,
  Eraser,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'meetly:whiteboard';

const PALETTE = [
  { id: 'mint', value: '#36F0B6' },
  { id: 'coral', value: '#FF5340' },
  { id: 'amber', value: '#FFB547' },
  { id: 'sky', value: '#74D3FF' },
  { id: 'white', value: '#FFFFFF' },
  { id: 'muted', value: '#7F8B8E' },
];

const BRUSH_SIZES = [2, 4, 8, 14];

interface WhiteboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tool = 'pen' | 'eraser';

const WhiteboardDialog = ({ open, onOpenChange }: WhiteboardDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState(PALETTE[0].value);
  const [brush, setBrush] = useState(BRUSH_SIZES[1]);
  const { toast } = useToast();

  // Resize + restore on open
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#0E1416';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Restore from localStorage
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          historyRef.current = [
            ctx.getImageData(0, 0, canvas.width, canvas.height),
          ];
        };
        img.src = saved;
      } else {
        historyRef.current = [
          ctx.getImageData(0, 0, canvas.width, canvas.height),
        ];
      }
    } catch {
      historyRef.current = [
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      ];
    }
  }, [open]);

  const getPos = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const beginStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = getPos(e);

    // Snapshot history at start of stroke
    const ctx = canvas.getContext('2d');
    if (ctx) {
      historyRef.current.push(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      );
      // Cap history at 20 entries
      if (historyRef.current.length > 20) historyRef.current.shift();
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = getPos(e);
    const last = lastPointRef.current ?? p;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brush;
    ctx.strokeStyle = tool === 'pen' ? color : '#0E1416';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPointRef.current = p;
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    );
    ctx.fillStyle = '#0E1416';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = historyRef.current.pop();
    if (!snapshot) return;
    ctx.putImageData(snapshot, 0, 0);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const data = canvas.toDataURL('image/png');
      window.localStorage.setItem(STORAGE_KEY, data);
      toast({ title: 'Whiteboard saved', description: 'Your sketch is persisted locally.' });
    } catch {
      toast({ title: 'Save failed', description: 'Local storage is unavailable.' });
    }
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = data;
    a.download = `meetly-whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] w-[90vw] max-w-[1100px] flex-col gap-4 rounded-3xl border border-white/5 bg-ink-850/95 p-5 text-white backdrop-blur-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
              <Pencil className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-display text-lg font-semibold">
                Whiteboard
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-soft">
                Sketch ideas live. Saved locally.
              </DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={undo} className="rounded-full">
              <RotateCcw className="h-4 w-4" /> Undo
            </Button>
            <Button variant="secondary" size="sm" onClick={clearAll} className="rounded-full">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <Button variant="secondary" size="sm" onClick={exportPng} className="rounded-full">
              <Download className="h-4 w-4" /> PNG
            </Button>
            <Button size="sm" onClick={save} className="rounded-full">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
          <ToolButton
            label="Pen"
            icon={Pencil}
            active={tool === 'pen'}
            onClick={() => setTool('pen')}
          />
          <ToolButton
            label="Eraser"
            icon={Eraser}
            active={tool === 'eraser'}
            onClick={() => setTool('eraser')}
          />
          <span className="h-6 w-px bg-white/5" />
          <div className="flex items-center gap-1.5">
            {PALETTE.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setColor(c.value);
                  setTool('pen');
                }}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition',
                  color === c.value && tool === 'pen'
                    ? 'border-white scale-110'
                    : 'border-white/10 hover:scale-105',
                )}
                style={{ background: c.value }}
                aria-label={`Color ${c.id}`}
              />
            ))}
          </div>
          <span className="h-6 w-px bg-white/5" />
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setBrush(s)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border transition',
                  brush === s
                    ? 'border-mint-400/40 bg-mint-400/15'
                    : 'border-white/5 bg-white/[0.04] hover:bg-white/[0.07]',
                )}
                aria-label={`Brush ${s}`}
              >
                <span
                  className="rounded-full bg-white"
                  style={{ width: s, height: s }}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden rounded-2xl border border-white/5 bg-ink-900"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            onPointerDown={beginStroke}
            onPointerMove={draw}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ToolButton = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Pencil;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
      active
        ? 'border-mint-400/40 bg-mint-400/15 text-mint-200'
        : 'border-white/5 bg-white/[0.04] text-muted-soft hover:text-white',
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </button>
);

export default WhiteboardDialog;
