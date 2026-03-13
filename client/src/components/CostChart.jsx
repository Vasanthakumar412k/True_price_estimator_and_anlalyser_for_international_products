import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function CostChart({ result }) {
  if (!result) return null;

  const pieData = {
    labels: [
      'Product Price (INR)',
      'Shipping',
      'Insurance',
      'Customs Duty (BCD)',
      'IGST',
      'Handling Fees'
    ],
    datasets: [{
      data: [
        result.convertedPriceINR,
        result.shippingINR || 0,
        result.insuranceINR || 0,
        result.customsDuty,
        result.igst,
        result.courierFeesINR || 0
      ],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(6, 182, 212, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(6, 182, 212, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodyFont: { family: 'Inter' },
        titleFont: { family: 'Inter', weight: 600 },
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        }
      }
    }
  };

  // Bar chart: compare import vs India price
  const hasIndiaPrice = result.indiaPrice && result.indiaPrice > 0;

  const barData = {
    labels: hasIndiaPrice
      ? ['Import Cost', 'India Price']
      : ['Product', 'Shipping', 'Customs', 'IGST', 'Fees', 'Total'],
    datasets: [{
      label: hasIndiaPrice ? 'Price (₹)' : 'Cost Breakdown (₹)',
      data: hasIndiaPrice
        ? [result.totalLandedCost, result.indiaPrice]
        : [
            result.convertedPriceINR,
            (result.shippingINR || 0) + (result.insuranceINR || 0),
            result.customsDuty,
            result.igst,
            result.courierFeesINR || 0,
            result.totalLandedCost
          ],
      backgroundColor: hasIndiaPrice
        ? [
            result.totalLandedCost <= result.indiaPrice
              ? 'rgba(16, 185, 129, 0.7)'
              : 'rgba(239, 68, 68, 0.7)',
            'rgba(99, 102, 241, 0.7)'
          ]
        : [
            'rgba(99, 102, 241, 0.7)',
            'rgba(6, 182, 212, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ],
      borderColor: hasIndiaPrice
        ? [
            result.totalLandedCost <= result.indiaPrice
              ? 'rgba(16, 185, 129, 1)'
              : 'rgba(239, 68, 68, 1)',
            'rgba(99, 102, 241, 1)'
          ]
        : [
            'rgba(99, 102, 241, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(139, 92, 246, 1)'
          ],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodyFont: { family: 'Inter' },
        titleFont: { family: 'Inter', weight: 600 },
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (v) => `₹${(v / 1000).toFixed(0)}K`
        },
        grid: { color: 'rgba(255, 255, 255, 0.04)' }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>📊 Cost Visualization</h3>
      <div className="charts-grid">
        <div>
          <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px', fontWeight: 500 }}>
            Cost Distribution
          </h4>
          <div className="chart-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px', fontWeight: 500 }}>
            {hasIndiaPrice ? 'Import vs India Price' : 'Cost Breakdown'}
          </h4>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
