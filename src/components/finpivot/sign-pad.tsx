import { useEffect, useRef } from "react";

export function SignPad({ label, onChange }: { label: string; onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 480;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(160 * ratio);
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1c1917";
    let drawing = false;
    let dirty = false;
    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const down = (event: PointerEvent) => {
      drawing = true;
      canvas.setPointerCapture(event.pointerId);
      const next = point(event);
      ctx.beginPath();
      ctx.moveTo(next.x, next.y);
    };
    const move = (event: PointerEvent) => {
      if (!drawing) return;
      const next = point(event);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      dirty = true;
    };
    const up = () => {
      if (!drawing) return;
      drawing = false;
      if (dirty) onChangeRef.current(canvas.toDataURL("image/png"));
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label={label}
      className="h-40 w-full touch-none border border-ink bg-paper"
    />
  );
}
