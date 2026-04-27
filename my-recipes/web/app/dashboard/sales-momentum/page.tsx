"use client";

export default function SalesMomentumDashboard({ events, ticketSales }) {
  return (
    <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <h1 className="text-2xl font-serif font-bold text-stone-800 mb-1">
        Sales Momentum
      </h1>
      <p className="text-stone-500 text-sm mb-8">cumulative sales over time</p>
      <p className="text-stone-600 text-sm mb-8">
        when do we sell more, closest to the event ? early on ?
      </p>
    </main>
  );
}
