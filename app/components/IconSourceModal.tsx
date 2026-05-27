"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CLASS_ICON_SOURCES, GENDER_ICON_SOURCES } from "../icon-sources";

type IconSourceModalProps = {
  type: "class" | "gender";
  onClose: () => void;
};

export function IconSourceModal({ type, onClose }: IconSourceModalProps) {
  const items = type === "class" ? CLASS_ICON_SOURCES : GENDER_ICON_SOURCES;
  const [index, setIndex] = useState(0);
  const portalRoot = typeof document === "undefined" ? null : document.body;
  const current = items[index];

  const title = useMemo(
    () =>
      type === "class"
        ? { zh: "阶层图标来源", en: "Class Iconography · Sources" }
        : { zh: "性别图标来源", en: "Gender Iconography · Sources" },
    [type],
  );

  useEffect(() => {
    document.body.classList.add("vr-icon-source-modal-open");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
      if (event.key === "ArrowRight") setIndex((value) => Math.min(items.length - 1, value + 1));
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("vr-icon-source-modal-open");
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items.length, onClose]);

  function step(delta: number) {
    setIndex((value) => Math.min(items.length - 1, Math.max(0, value + delta)));
  }

  if (!portalRoot) return null;

  return createPortal(
    <>
      <button type="button" className="vr-artpop-scrim is-open" aria-label="关闭图标来源弹窗" onClick={onClose} />
      <section className="vr-artpop is-open" role="dialog" aria-modal="true" aria-label={title.zh}>
        <header className="vr-artpop-head">
          <div className="vr-artpop-head-l">
            <h2 className="vr-artpop-source-title">
              <span>{title.zh}</span>
              <em>{title.en}</em>
            </h2>
          </div>
          <button type="button" className="vr-artpop-close" aria-label="关闭" onClick={onClose}>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2 L10 10 M10 2 L2 10" />
            </svg>
          </button>
        </header>

        <div className="vr-artpop-body">
          <button
            type="button"
            className="vr-artpop-nav vr-artpop-nav--prev"
            aria-label="上一幅"
            disabled={index === 0}
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 5 L7 12 L14.5 19" />
            </svg>
          </button>

          <div className="vr-artpop-stage">
            {items.map((item, itemIndex) => (
              <div key={item.label} className={`vr-artpop-slide ${itemIndex === index ? "is-active" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imagePath} alt={`${item.label}图标来源：${item.titleZh}`} />
              </div>
            ))}
          </div>

          <div className="vr-artpop-info">
            <p className="vr-artpop-label">
              <span>{current.label}</span>
              <span className="vr-artpop-label-en">Source</span>
            </p>
            <h3 className="vr-artpop-work">
              <span className="vr-artpop-work-zh">《{current.titleZh}》</span>
              <span className="vr-artpop-work-orig">{current.titleOriginal}</span>
            </h3>
            <span className="vr-artpop-rule" aria-hidden="true" />
            <p className="vr-artpop-painter">{current.artist}</p>
            <p className="vr-artpop-meta">
              <span>{current.year}</span>
              <span>{current.country}</span>
            </p>
          </div>

          <button
            type="button"
            className="vr-artpop-nav vr-artpop-nav--next"
            aria-label="下一幅"
            disabled={index === items.length - 1}
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 5 L17 12 L9.5 19" />
            </svg>
          </button>
        </div>

        <footer className="vr-artpop-foot">
          <div className="vr-artpop-dots">
            {items.map((item, itemIndex) => (
              <button
                key={item.label}
                type="button"
                className={`vr-artpop-dot ${itemIndex === index ? "is-active" : ""}`}
                aria-label={`查看${item.label}`}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
          </div>
          <div className="vr-artpop-counter">
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span className="vr-artpop-counter-sep" aria-hidden="true" />
            <span>{String(items.length).padStart(2, "0")}</span>
          </div>
        </footer>
      </section>
    </>,
    portalRoot,
  );
}
