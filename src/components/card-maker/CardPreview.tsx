"use client";
import { useRef, useEffect } from "react";
import type { TemplateConfig } from "@/types";

const CANVAS_SIZE = 1080;

interface CardPreviewProps {
  text: string;
  config: TemplateConfig;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const char of text) {
    const test = current + char;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function CardPreview({ text, config }: CardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Background
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Accent decorations
    if (config.decorations.includes("top_line")) {
      ctx.strokeStyle = config.accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(config.padding * 3, config.padding * 2);
      ctx.lineTo(CANVAS_SIZE - config.padding * 3, config.padding * 2);
      ctx.stroke();
    }

    if (config.decorations.includes("corner_leaf")) {
      ctx.fillStyle = config.accentColor;
      ctx.globalAlpha = 0.3;
      ctx.font = "80px serif";
      ctx.textAlign = "left";
      ctx.fillText("🍃", 48, CANVAS_SIZE - 80);
      ctx.globalAlpha = 1;
    }

    // Text
    const fontSize = config.fontSize * 3;
    ctx.fillStyle = config.textColor;
    ctx.font = `${fontSize}px "${config.fontFamily}", "PingFang SC", sans-serif`;
    ctx.textAlign = config.layout === "centered" ? "center" : "left";

    const x = config.layout === "centered" ? CANVAS_SIZE / 2 : config.padding * 3;
    const y = config.layout === "bottom-heavy"
      ? CANVAS_SIZE - config.padding * 4
      : CANVAS_SIZE / 2;

    const maxWidth = CANVAS_SIZE - config.padding * 6;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.6;
    const startY = y - (lines.length * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });

    // Watermark
    if (config.watermark) {
      ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
      ctx.font = "36px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("文案生成器", CANVAS_SIZE - 48, CANVAS_SIZE - 48);
    }
  }, [text, config]);

  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-md">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
    </div>
  );
}
