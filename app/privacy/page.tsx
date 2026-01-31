export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black uppercase italic mb-8">Privacy Policy</h1>
      <div className="prose prose-zinc dark:prose-invert space-y-6 text-zinc-500 font-medium">
        <p>Last Updated: January 2026</p>
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">1. Data Collection</h2>
          <p>We use Auth0 for authentication. We only store your email and name to manage your orders. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">2. Payments</h2>
          <p>Payments are processed securely via Stripe. We do not store your credit card information on our servers.</p>
        </section>
        <section>
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">3. Cookies</h2>
          <p>We use essential cookies to keep you logged in and to remember your shopping basket items.</p>
        </section>
      </div>
    </div>
  );
}