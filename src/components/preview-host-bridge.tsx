/**
 * STUB — 来源缺失：原仓库引用 `@/components/preview-host-bridge` 但未提交实现。
 *
 * 作用推断：向预览宿主（iframe 外层）上报高度与当前路由，使容器能自适应。
 * 部署侧按最小可用原则补齐：只 postMessage，不读取宿主数据、不做跳转。
 * 真实协议（事件名、字段）需设计侧确认后替换。
 */
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PreviewHostBridge() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    const post = () =>
      window.parent.postMessage(
        { type: "preview:resize", pathname, height: document.documentElement.scrollHeight },
        "*",
      );
    post();
    const ob = new ResizeObserver(post);
    ob.observe(document.documentElement);
    return () => ob.disconnect();
  }, [pathname]);

  return null;
}
