import React, { useEffect, useRef } from 'react';
import styles from '../styles/StarField.module.css';

const StarField = () => {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const animationRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createStars = () => {
            const stars = [];
            const numStars = 150;
            const colors = [
                '#ffffff', // White
                '#ff6666', // Red
                '#66b3ff', // Blue
                '#ffff99', // Yellow
                '#99ff99', // Green
            ];

            for (let i = 0; i < numStars; i++) {
                const isMeteor = Math.random() < 0.1;
                const isBright = !isMeteor && Math.random() < 0.3; // 30% chance for bright twinkling stars
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: isMeteor ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
                    speed: isMeteor ? Math.random() * 4 + 2 : Math.random() * 0.5 + 0.1,
                    opacity: isMeteor ? Math.random() * 0.5 + 0.5 : Math.random() * 0.6 + 0.4,
                    isMeteor,
                    tailLength: isMeteor ? Math.random() * 20 + 10 : 0,
                    color: isMeteor ? '#ffffff' : colors[Math.floor(Math.random() * colors.length)],
                    isBright,
                    twinklePhase: Math.random() * Math.PI * 2, // Random phase for twinkling
                    twinkleSpeed: isBright ? Math.random() * 0.05 + 0.02 : 0, // Twinkle speed for bright stars
                });
            }

            starsRef.current = stars;
        };

        const animateStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            starsRef.current.forEach((star) => {
                star.y += star.speed;

                if (star.y > canvas.height) {
                    star.y = -5;
                    star.x = Math.random() * canvas.width;
                    star.opacity = star.isMeteor ? Math.random() * 0.5 + 0.5 : Math.random() * 0.6 + 0.4;
                }

                ctx.save();

                // Apply twinkling effect for bright stars
                let currentOpacity = star.opacity;
                if (star.isBright && !star.isMeteor) {
                    currentOpacity = star.opacity * (0.7 + 0.3 * Math.sin(star.twinklePhase));
                    star.twinklePhase += star.twinkleSpeed;
                }
                ctx.globalAlpha = currentOpacity;

                if (star.isMeteor) {
                    const gradient = ctx.createLinearGradient(
                        star.x,
                        star.y,
                        star.x - star.tailLength,
                        star.y - star.tailLength
                    );
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = star.size;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(star.x - star.tailLength, star.y - star.tailLength);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = star.color;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animateStars);
        };

        resizeCanvas();
        createStars();
        animateStars();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createStars();
        });

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={styles.starCanvas}
        />
    );
};

export default StarField;