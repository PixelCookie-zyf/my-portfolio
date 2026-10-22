"use client";

import { useSyncExternalStore } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { Arrow } from "@/components/ui/Doodles";
import { giscusConfig } from "@/data/comments";
import {
  emptySubscribe,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "@/lib/hydration";

export default function Comments({ slug }: { slug: string }) {
  const mounted = useSyncExternalStore(emptySubscribe, getClientHydratedSnapshot, getServerHydratedSnapshot);
  const { resolvedTheme } = useTheme();

  if (!giscusConfig.categoryId) return null;

  // giscus needs an absolute URL for a custom theme; the files live in public/giscus.
  // Browsers won't let giscus.app load stylesheets from localhost, so dev uses the stock theme.
  const mode = resolvedTheme === "dark" ? "dark" : "light";
  const isLocal = mounted && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const theme = mounted && !isLocal ? `${window.location.origin}/giscus/${mode}.css` : mode;

  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-20 border-t border-dashed border-line pt-12">
      <p className="font-hand flex items-end gap-1 text-[1.7rem] leading-none text-tomato">
        leave a note
        <Arrow className="mb-[-14px] h-8 w-11 rotate-[18deg]" delay={0} />
      </p>
      <h2 id="comments-heading" className="font-display mt-2 text-[2rem] font-medium leading-tight">
        留言与讨论
      </h2>
      <p className="mt-3 text-[15px] text-soft">
        用 GitHub 账号登录就能留言或点个表情，评论会保存在本站仓库的 Discussions 里。
      </p>
      <div className="mt-8 min-h-[200px]">
        {mounted && (
          <Giscus
            id="comments-thread"
            repo={giscusConfig.repo}
            repoId={giscusConfig.repoId}
            category={giscusConfig.category}
            categoryId={giscusConfig.categoryId}
            mapping="specific"
            term={slug}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={theme}
            lang="zh-CN"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}
