'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

interface LandData {
  name: string;
  acres: number;
  legalStatus: string;
  compensation: string;
  fill: string;
}

const landData: LandData[] = [
  {
    name: 'Land Paid For',
    acres: 10000,
    legalStatus: 'Compensation disbursed. Land acquisition complete.',
    compensation: '₹16 lakh per acre + 121 sq yd developed plots offered',
    fill: '#00D4AA',
  },
  {
    name: 'Under Court Stay',
    acres: 2000,
    legalStatus: 'Court-issued stay orders in villages including Kurmidda, Thatiparti, and Medipally. Pending judicial resolution.',
    compensation: 'Compensation disputed. Enhanced packages proposed pending court approval.',
    fill: '#FF9500',
  },
  {
    name: 'Farmers Not Approached Courts',
    acres: 1500,
    legalStatus: 'Farmers have not accepted compensation or approached courts. Land remains vulnerable to Section 101 return claims.',
    compensation: 'Enhanced compensation package offered: ₹16 lakh/acre + 121 sq yd plots + free registration',
    fill: '#FF3B30',
  },
];

const totalAcres = landData.reduce((sum, item) => sum + item.acres, 0);

interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: LandData;
  percent: number;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-10}
        textAnchor="middle"
        fill="#FFFFFF"
        style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace' }}
      >
        {payload.acres.toLocaleString()}
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        textAnchor="middle"
        fill="#888888"
        style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace' }}
      >
        acres
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={2}
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#FFFFFF"
        style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#888888"
        style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
      >
        {`${(percent * 100).toFixed(1)}% of total`}
      </text>
    </g>
  );
};

export function LandStatusBreakdown() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
    setHoveredIndex(index);
  };

  const onPieLeave = () => {
    setHoveredIndex(null);
  };

  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const activeItem = landData[displayIndex];

  return (
    <div className="border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}
      >
        <h3 className="font-mono text-xs tracking-widest uppercase text-primary mb-1">
          Section 101 / Land Status
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Breakdown of {totalAcres.toLocaleString()} acres requiring LARR Act compliance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Chart */}
        <div className="lg:col-span-3 p-8 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                activeIndex={displayIndex}
                activeShape={renderActiveShape as any}
                data={landData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="acres"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                stroke="#000000"
                strokeWidth={2}
              >
                {landData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} style={{ outline: 'none' }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Details Panel */}
        <div
          className="lg:col-span-2 border-t lg:border-t-0 lg:border-l p-6 flex flex-col justify-center"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-sunken)' }}
        >
          <div className="space-y-6">
            {/* Active category details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 border"
                  style={{ backgroundColor: activeItem.fill, borderColor: activeItem.fill }}
                />
                <h4 className="font-bold text-lg text-primary">{activeItem.name}</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-1"
                    style={{ color: activeItem.fill }}
                  >
                    Legal Status
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    {activeItem.legalStatus}
                  </p>
                </div>

                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-1"
                    style={{ color: activeItem.fill }}
                  >
                    Compensation Details
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    {activeItem.compensation}
                  </p>
                </div>

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <p className="font-mono text-2xl font-bold" style={{ color: activeItem.fill }}>
                    {activeItem.acres.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    acres ({((activeItem.acres / totalAcres) * 100).toFixed(1)}% of total)
                  </p>
                </div>
              </div>
            </div>

            {/* Legend for all categories */}
            <div
              className="pt-6 border-t space-y-3"
              style={{ borderColor: 'var(--border)' }}
            >
              <p
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: 'var(--muted-foreground)' }}
              >
                All Categories
              </p>
              {landData.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveIndex(index);
                    setHoveredIndex(index);
                  }}
                  onMouseEnter={() => onPieEnter(null, index)}
                  onMouseLeave={onPieLeave}
                  className="w-full flex items-center justify-between gap-2 p-2 border transition-colors cursor-pointer"
                  style={{
                    borderColor: displayIndex === index ? item.fill : 'var(--border)',
                    backgroundColor: displayIndex === index ? 'var(--surface-elevated)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 border flex-shrink-0"
                      style={{ backgroundColor: item.fill, borderColor: item.fill }}
                    />
                    <span className="text-xs text-left" style={{ color: 'var(--foreground)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: item.fill }}>
                    {item.acres.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div
        className="border-t px-6 py-3"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-sunken)' }}
      >
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          <span className="font-bold" style={{ color: 'var(--accent-warning)' }}>Note:</span>{' '}
          Hover over chart segments or click category buttons to view detailed legal status and compensation information.
          Total land bank requires navigation of LARR Act Section 99 (change of purpose) and Section 101 (return of unutilized land) provisions.
        </p>
      </div>
    </div>
  );
}
