import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function PricingCard({
  name, price, features, highlight, badge,
}: {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div className={`relative card-luxe p-8 flex flex-col ${highlight ? "ring-1 ring-gold/60" : ""}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
          {badge}
        </div>
      )}
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{name}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-5xl font-display font-bold text-gradient-gold">{price}</span>
      </div>
      <ul className="mt-8 space-y-3 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/contact" className={`mt-8 text-center rounded-full py-3 text-sm ${highlight ? "btn-gold" : "btn-ghost-gold"}`}>
        Choose {name}
      </Link>
    </div>
  );
}
