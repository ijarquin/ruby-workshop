"use client";

interface Event {
  eventId: string;
  name: string;
  date: string;
}

interface TicketSale {
  eventId: string;
  date: string;
  ticketsSold: number;
}

interface PageView {
  eventId: string;
  date: string;
  views: number;
}

export default function ConversionRateDashboard({
  events,
  ticketSales,
  pageViews,
}: {
  events: Event[];
  ticketSales: TicketSale[];
  pageViews: PageView[];
}) {
  return (
    <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <h1 className="text-2xl font-serif font-bold text-stone-800 mb-1">
        Analytics
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Daily ticket sales vs page views
      </p>
      <p className="text-stone-600 text-sm mb-8">
        what is the correlation between the number of page views and the actual
        tickets sale
      </p>
    </main>
  );
}
