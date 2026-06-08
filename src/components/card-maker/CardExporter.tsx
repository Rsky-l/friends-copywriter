"use client";
import { useCallback } from "react";
import { Button } from "@/components/ui/Button";

export function CardExporter({ canvasId = "card-canvas" }: { canvasId?: string }) {
  const handleDownload = useCallback(() => {
    const canvas = document.querySelector(`#${canvasId} canvas`) as HTMLCanvasElement | null;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `文案卡片_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [canvasId]);

  return (
    <Button onClick={handleDownload} variant="outline" className="w-full !py-2">
      📥 下载卡片图片
    </Button>
  );
}
