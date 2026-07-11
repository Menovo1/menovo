import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl glass p-12 sm:p-16 text-center">
          <div className="absolute inset-0 opacity-40 grid-gold [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-gold">Let's begin</div>
            <h2 className="mt-6 font-display font-bold text-4xl sm:text-6xl leading-tight">
              Ready to Bring Your Business <span className="text-gradient-gold">Online?</span>
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
              Let's create an online experience your customers will never forget.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="rounded-full btn-gold px-7 py-3.5 text-sm">Get Started</Link>
              <a href="https://wa.me/251946471234" target="_blank" rel="noreferrer noopener" className="rounded-full btn-ghost-gold px-7 py-3.5 text-sm">Book a Call</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
