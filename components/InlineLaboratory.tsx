"use client";
import { useEffect, useRef, useState } from "react";
import Laboratory from "./Laboratory";
import { type SceneId } from "./lab-state";
export default function InlineLaboratory({ id }: { id: SceneId }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const progress = useRef(0.5);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const update = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect)
        progress.current = Math.max(
          0,
          Math.min(
            1,
            (innerHeight * 0.7 - rect.top) / (innerHeight * 0.7 + rect.height),
          ),
        );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [visible]);
  return (
    <div className="mobile-laboratory" id={`${id}-experiment`} ref={ref}>
      <Laboratory id={id} compact progress={progress} paused={!visible} />
    </div>
  );
}
