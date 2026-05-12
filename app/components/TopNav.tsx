"use client";

type TopNavProps = {
  mapState: boolean;
  onHome: () => void;
};

export function TopNav({ mapState, onHome }: TopNavProps) {
  return (
    <nav className={`vr-top-nav ${mapState ? "is-map" : "is-landing"}`} aria-label="主导航">
      <button type="button" className="vr-top-brand" onClick={onHome}>
        Parallels · 经纬
      </button>
    </nav>
  );
}
