import React, { useEffect, useRef, memo } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartConfiguration } from 'chart.js';
import { MoodCount, MOOD_COLORS, MoodType } from '../types';

// Register Chart.js components once at module level
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MoodChartProps {
  moodCounts: MoodCount;
  className?: string;
}

export const MoodChart: React.FC<MoodChartProps> = memo(({ moodCounts, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Destroy previous chart instance to prevent memory leaks
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = Object.keys(moodCounts);
    const data = labels.map(mood => moodCounts[mood]);
    const colors = labels.map(mood => MOOD_COLORS[mood as MoodType] || '#6b7280');

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Mood Frequency',
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            ticks: {
              color: '#6b7280',
              precision: 0
            }
          }
        }
      }
    };

    chartRef.current = new Chart(canvas, config);

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [moodCounts]);

  return (
    <div className={`chart-container ${className || ''}`}>
      <canvas 
        ref={canvasRef}
        role="img"
        aria-label={`Bar chart showing mood frequency. ${Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count} entries`).join(', ')}`}
      />
    </div>
  );
});