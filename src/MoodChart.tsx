import React, { memo, useEffect, useRef } from 'react';
import type { JournalEntry } from './types';
import { calculateMoodCounts, MOOD_COLORS } from './utils';

interface MoodChartProps {
  entries: JournalEntry[];
  className?: string;
}

const MoodChart: React.FC<MoodChartProps> = memo(({ entries, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initChart = async () => {
      if (!canvasRef.current) return;

      try {
        // Destroy existing chart to prevent memory leaks
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }

        // Dynamic import for better code splitting
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);

        const moodCounts = calculateMoodCounts(entries);
        const labels = Object.keys(moodCounts);
        const data = Object.values(moodCounts);
        const backgroundColor = labels.map(mood => MOOD_COLORS[mood as keyof typeof MOOD_COLORS] || '#94a3b8');

        chartInstanceRef.current = new Chart(canvasRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Number of entries',
              data,
              backgroundColor,
              borderColor: backgroundColor.map(color => color.replace(')', ', 0.8)')),
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 750,
              easing: 'easeInOutQuart'
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  title: () => '',
                  label: (context) => {
                    const mood = context.label;
                    const count = context.raw as number;
                    const total = entries.length;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return `${mood}: ${count} entries (${percentage}%)`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                border: {
                  display: false
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    size: 12,
                    weight: 500
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                },
                border: {
                  display: false
                },
                ticks: {
                  color: '#6b7280',
                  font: {
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    size: 12
                  },
                  stepSize: 1,
                  callback: (value) => {
                    return Number.isInteger(Number(value)) ? value : '';
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    };

    initChart();

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [entries]);

  const isEmpty = entries.length === 0;

  if (isEmpty) {
    return (
      <div className={`chart-container ${className}`}>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">📊</div>
          <h3 className="empty-state-title">No mood data yet</h3>
          <p className="empty-state-description">
            Add some journal entries to see your mood patterns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chart-container ${className}`}>
      <canvas 
        ref={canvasRef}
        className="chart-canvas"
        aria-label={`Mood frequency chart showing ${entries.length} total entries`}
        role="img"
      />
      <div className="sr-only">
        Chart showing mood frequency data. Total entries: {entries.length}.
        {Object.entries(calculateMoodCounts(entries)).map(([mood, count]) => (
          <span key={mood}>{mood}: {count} entries. </span>
        ))}
      </div>
    </div>
  );
});

MoodChart.displayName = 'MoodChart';

export default MoodChart;