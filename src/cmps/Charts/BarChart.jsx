import { useRef, useEffect } from "react"
import Chart from "chart.js/auto"

export function BarChart({ data }) {
  console.log("🚀 ~ BarChart ~ data:", data)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byPriority?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()
    const root = getComputedStyle(document.documentElement)
    const filteredStatusData = data.byPriority.filter(s => s.id !== 'default');
    console.log("🚀 ~ BarChart ~ filteredStatusData:", filteredStatusData)

    const labels = filteredStatusData.filter(s => s.txt !== 'Default Label').map(s => s.txt)
    const values = filteredStatusData.map(s => s.tasksCount)
    const colors = filteredStatusData
      .filter(s => s.txt !== 'Default Label')
      .map(s => root.getPropertyValue(s.cssVar.trim()).trim() || '#ccc')

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tasks by Priority",
            data: values,
            backgroundColor: colors,
            borderRadius: 6,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Count",
            position: 'left',
            color: 'rgb(103, 104, 121 , 50%)',
            fullSize: true,
            // rotation: 90,
            font: {
              size: 10,
            },
          },
          tooltip: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxPadding: 2,
            bodyFont: { size: 10 },
            bodyAlign: 'left',
            callbacks: {
              label: (ctx) => {
                return ctx.label || '';
              },
              afterLabel: (ctx) => {
                const value = ctx.parsed.y;
                return `Count: ${value} tasks`;
              },
              title: () => [],
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: {
              color: 'rgb(236 236 236 / 50%)',
            },
            border: {
              display: false, // 👈 hides left/outer line
            },
          },
          x: {
            grid: {
              color: 'rgb(236 236 236 / 0%)',
            },
          }
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  // Add style to the canvas element
  return <canvas ref={canvasRef} style={{ height: '100%' }}></canvas>
}