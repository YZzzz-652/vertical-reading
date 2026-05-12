"use client";

import { useState } from "react";
import type { BookCover } from "../books";

function BookCard({ book }: { book: BookCover }) {
  const [errored, setErrored] = useState(false);

  if (book.cover && !errored) {
    return (
      <article className="vr-cover vr-cover--img" title={`${book.title} · ${book.author}, ${book.year}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.cover} alt={`${book.title} (${book.year})`} onError={() => setErrored(true)} />
        <div className="vr-cover-caption">
          <span className="vr-cover-caption-title">{book.title}</span>
          <span className="vr-cover-caption-meta">
            {book.author} · {book.year}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="vr-cover vr-cover--typographic vr-cover--paper">
      <div className="vr-cover-region">{book.region}</div>
      <div className="vr-cover-rule" />
      <h3 className="vr-cover-title">{book.title}</h3>
      <div className="vr-cover-zh">{book.zh}</div>
      <div className="vr-cover-foot">
        <span className="vr-cover-author">{book.author}</span>
        <span className="vr-cover-year">{book.year}</span>
      </div>
    </article>
  );
}

type LandingProps = {
  active: boolean;
  books: BookCover[];
  onEnter: () => void;
};

export function Landing({ active, books, onEnter }: LandingProps) {
  return (
    <section className={`vr-screen vr-landing ${active ? "is-active" : ""}`}>
      <div className="vr-landing-grid">
        <div className="vr-landing-hero">
          <div className="vr-landing-eyebrow">EST. 2026 · A LITERARY ATLAS</div>
          <h1 className="vr-landing-title">
            <span>Parallels</span>
            <span>经纬</span>
          </h1>
          <p className="vr-landing-tag">
            打破书本边界，以时间为坐标轴，
            <br />
            在同一历史时刻看见不同作品里的人物
            <br />
            如何在各自的命运里行走。
          </p>
          <p className="vr-landing-tag-en">
            <em>
              An atlas that lays the world&apos;s literature upon historical maps, so a single year
              reveals a continent of parallel lives.
            </em>
          </p>
          <button type="button" className="vr-landing-cta" onClick={onEnter}>
            <span>向下探索</span>
            <span className="vr-landing-cta-en">Enter the Atlas ↓</span>
          </button>
          <div className="vr-landing-stats">
            <div>
              <strong>{books.length}</strong>
              <span>Featured</span>
            </div>
            <div>
              <strong>7</strong>
              <span>Regions</span>
            </div>
            <div>
              <strong>1010-1936</strong>
              <span>Years</span>
            </div>
          </div>
        </div>
        <div className="vr-landing-wall">
          {books.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
