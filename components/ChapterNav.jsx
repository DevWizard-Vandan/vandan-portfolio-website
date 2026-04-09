"use client";

export default function ChapterNav({ items, activeId, onNavigate }) {
  return (
    <nav className="chapter-nav" aria-label="Chapter progress">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            type="button"
            key={item.id}
            className={`chapter-nav-button ${isActive ? "is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-label={`Jump to ${item.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="chapter-nav-dot" aria-hidden="true" />
            <span className="chapter-nav-label">{item.markerLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
