"use client";

import type { LiteraryEvent } from "../types";
import { EventTypeGlyph } from "./EventTypeGlyph";

type EventPopupProps = {
  event: LiteraryEvent | null;
  atlasOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
};

export function EventPopup({ event, atlasOpen, isClosing, onClose }: EventPopupProps) {
  if (!event) return null;

  return (
    <div className={`vr-popup-overlay ${atlasOpen ? "is-atlas-open" : "is-atlas-collapsed"} ${isClosing ? "is-closing" : ""}`}>
      <article className="vr-popup-card">
        <button type="button" className="vr-popup-close" aria-label="关闭气泡卡片" onClick={onClose}>
          ×
        </button>
        <header>
          <div className="vr-popup-title-row">
            <h2>{event.character || "未命名人物"}</h2>
            <span className="vr-popup-chip">{event.class || "未知阶层"}</span>
            <span className="vr-popup-chip">{event.gender || "未知性别"}</span>
            {event.tags && <span className="vr-popup-chip">{event.tags}</span>}
          </div>
          <p>
            <em>
              《{event.book || "未知作品"}》{event.author || "未知作者"}
            </em>
          </p>
        </header>
        <div className="vr-popup-rule" />
        <p className="vr-popup-event">{event.event || "暂无事件描述"}</p>
        {event.eventTypes.length > 0 && (
          <div className="vr-popup-evtype">
            <span className="vr-popup-evtype-label">事件类型：</span>
            {event.eventTypes.map((type) => (
              <span key={type} className="vr-popup-evtype-tag">
                <EventTypeGlyph type={type} />
                {type}
              </span>
            ))}
          </div>
        )}
        <p className="vr-popup-meta">
          地点：{event.locationType || "未知地点类型"} · {event.locationName || event.city || "未知地点"}
          　时间：{event.timeType || "未知时间类型"}
          {event.year ? ` · ${event.year}` : ""}
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
