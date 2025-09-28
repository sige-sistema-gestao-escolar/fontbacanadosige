import { useRef, useEffect } from 'react';

const GlobalClickSparkFinal = () => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = Date.now() - spark.startTime;
        if (elapsed >= 300) {
          return false;
        }

        const progress = elapsed / 300;
        const distance = progress * 15;
        const lineLength = 8 * (1 - progress);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Não interferir com botões ou elementos interativos
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      
      // Usar setTimeout para não interferir com a funcionalidade dos botões
      setTimeout(() => {
        
        const now = Date.now();
        const newSparks = Array.from({ length: 6 }, (_, i) => ({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / 6,
          startTime: now
        }));

        sparksRef.current.push(...newSparks);
      }, 0);
    };

    // Usar bubbling phase (padrão) para não interferir
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
        userSelect: 'none'
      }}
    />
  );
};

export default GlobalClickSparkFinal;
