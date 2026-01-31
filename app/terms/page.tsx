export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black uppercase italic mb-8">Terms of Service</h1>
      <div className="prose prose-zinc dark:prose-invert space-y-6 text-zinc-500 font-medium">
        <p>Last Updated: January 2026</p>
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">1. Use of Service</h2>
          <p>By using Darragh's Data Extravaganza, you agree to provide accurate information for delivery and payment.</p>
        </section>
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">2. Orders</h2>
          <p>All orders are subject to availability. We reserve the right to cancel orders in the event of stock errors or pricing discrepancies.</p>
        </section>
      </div>
    </div>
  );
}