"use client";

type EventTypeGlyphProps = {
  type: string;
  className?: string;
};

export function EventTypeGlyph({ type, className = "" }: EventTypeGlyphProps) {
  switch (type) {
    case "死亡":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M14 4v20 M5 9h18"]} />;
    case "新生":
      return (
        <Glyph
          className={className}
          type={type}
          viewBox="0 0 28 28"
          paths={["M14 22C14 22 7 16 7 11 7 7 10 5 14 5s7 2 7 6c0 5-7 11-7 11z M14 5V3"]}
        />
      );
    case "离散":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M4 14h7 M17 14h7 M11 10l-4 4 4 4 M17 10l4 4-4 4"]} />;
    case "团聚":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M4 14h8 M16 14h8 M12 10l4 4-4 4"]} />;
    case "背叛":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M2 8h3 M7 8h2 M11 8h3"]} />;
    case "忠诚":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M8 3L12 5v3.5q0 3-4 4.5q-4-1.5-4-4.5V5z"]} />;
    case "堕落":
      return (
        <Glyph
          className={className}
          type={type}
          viewBox="0 0 28 28"
          paths={[
            "M8 8Q14 12 20 8Q18 16 14 22Q10 16 8 8Z",
            { d: "M11 14h6", strokeDasharray: "1.5 2" },
          ]}
        />
      );
    case "救赎":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M8 20Q14 16 20 20Q18 12 14 6Q10 12 8 20Z M14 6V3"]} />;
    case "顿悟":
      return (
        <Glyph
          className={className}
          type={type}
          viewBox="0 0 16 16"
          circles={[{ cx: 8, cy: 8, r: 2 }]}
          paths={["M8 2.5v1.5 M8 12v1.5 M2.5 8h1.5 M12 8h1.5 M4 4l1 1 M11 11l1 1 M4 12l1-1 M11 5l1-1"]}
        />
      );
    case "迷茫":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M2 5q2-1.5 4 0t4 0 4 0 M2 8q2-1.5 4 0t4 0 4 0 M2 11q2-1.5 4 0t4 0 4 0"]} />;
    case "反抗":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M8 2v9 M5 5l3-3 3 3 M4 13h8"]} />;
    case "屈服":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M7 12Q14 10 21 12 M7 16Q14 18 21 16"]} />;
    case "相遇":
      return (
        <Glyph
          className={className}
          type={type}
          viewBox="0 0 16 16"
          circles={[{ cx: 8, cy: 8, r: 1.4 }]}
          paths={["M2 2l4 4 M14 2l-4 4 M2 14l4-4 M14 14l-4-4"]}
        />
      );
    case "决裂":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M2 6h5 M9 10h5"]} />;
    case "萌芽":
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M14 22C7 16 4 12 4 9C4 6 6 4 9 4C11 4 13 5 14 7C15 5 17 4 19 4C22 4 24 6 24 9C24 12 21 16 14 22Z"]} />;
    case "幻灭":
      return (
        <Glyph
          className={className}
          type={type}
          viewBox="0 0 28 28"
          paths={[
            { d: "M8 9Q11 6 14 9Q17 6 20 9Q22 12 14 19Q6 12 8 9Z", strokeDasharray: "2.5 2" },
            "M8 21h12",
          ]}
        />
      );
    case "叩问":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M5.5 6q0-3 2.5-3t2.5 2.5q0 2-2.5 3v1 M8 13v0.1"]} />;
    case "笃定":
      return <Glyph className={className} type={type} viewBox="0 0 16 16" paths={["M3 8l3 3 7-7"]} />;
    default:
      return <Glyph className={className} type={type} viewBox="0 0 28 28" paths={["M8 9Q11 6 14 9Q17 6 20 9Q22 12 14 19Q6 12 8 9Z", "M8 21h12"]} />;
  }
}

type GlyphPath = string | { d: string; strokeDasharray?: string };

function Glyph({
  className,
  type,
  viewBox,
  circles = [],
  paths,
}: {
  className: string;
  type: string;
  viewBox: string;
  circles?: Array<{ cx: number; cy: number; r: number }>;
  paths: GlyphPath[];
}) {
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" data-event-type={type}>
      {circles.map((circle) => (
        <circle key={`${circle.cx}-${circle.cy}-${circle.r}`} cx={circle.cx} cy={circle.cy} r={circle.r} />
      ))}
      {paths.map((path) => {
        const d = typeof path === "string" ? path : path.d;
        const strokeDasharray = typeof path === "string" ? undefined : path.strokeDasharray;
        return <path key={d} d={d} strokeDasharray={strokeDasharray} />;
      })}
    </svg>
  );
}
