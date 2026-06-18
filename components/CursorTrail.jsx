"use client";

import { useEffect, useRef, useState } from "react";

const MAX_PARTICLES = 32;
const FADE_RATE = 0.045;

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const updateEnabled = () => {
      setEnabled(!reducedMotionQuery.matches && !coarsePointerQuery.matches);
    };

    updateEnabled();
    reducedMotionQuery.addEventListener("change", updateEnabled);
    coarsePointerQuery.addEventListener("change", updateEnabled);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateEnabled);
      coarsePointerQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return undefined;
    }

    let animationFrame = 0;
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const addParticle = (event) => {
      particles.push({
        x: event.clientX,
        y: event.clientY,
        alpha: 1,
        radius: 10 + Math.random() * 8
      });

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.alpha -= FADE_RATE;
        particle.radius += 0.28;

        if (particle.alpha <= 0) {
          particles.splice(index, 1);
          continue;
        }

        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );

        gradient.addColorStop(0, `rgba(249, 115, 22, ${particle.alpha * 0.9})`);
        gradient.addColorStop(0.55, `rgba(251, 191, 36, ${particle.alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(249, 115, 22, 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", addParticle, { passive: true });
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", addParticle);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
