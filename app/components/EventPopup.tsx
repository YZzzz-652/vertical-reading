"use client";

import type { LiteraryEvent } from "../types";

type EventPopupProps = {
  event: LiteraryEvent | null;
  onClose: () => void;
};

export function EventPopup({ event, onClose }: EventPopupProps) {
  if (!event) return null;

  return (
    <div className="vr-popup-overlay" onClick={onClose}>
      <article className="vr-popup-card" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <header>
          <div className="vr-popup-title-row">
            <h2>{event.character || "未命名人物"}</h2>
            <span className="vr-popup-chip">{event.class || "未知阶层"}</span>
            <span className="vr-popup-chip">{event.gender || "未知性别"}</span>
            {event.tags && <span className="vr-popup-chip">{event.tags}</span>}
          </div>
          <p>
            <em>
              {event.book || "未知作品"} · {event.author || "未知作者"}
            </em>
          </p>
        </header>
        <div className="vr-popup-rule" />
        <p className="vr-popup-event">{event.event || "暂无事件描述"}</p>
        <p className="vr-popup-meta">
          地点：{event.locationName || event.city || "未知地点"} · {event.locationType || "未知地点类型"}
          　时间：{event.timeType || "未知时间类型"}
        </p>
        <div className="vr-popup-rule" />
        <details className="vr-popup-quote" open>
          <summary>原文摘录</summary>
          <p>{event.quote || "暂无摘录"}</p>
        </details>
      </article>
    </div>
  );
}
