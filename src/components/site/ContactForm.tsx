import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { submitMessage } from "@/lib/public-content.functions";

const inputClass =
  "mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold/60 focus:bg-white/[0.055]";

const optionClass =
  "group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-gold/45 hover:bg-white/[0.055]";

const businessTypes = [
  "Hotel & Hospitality",
  "Restaurant & Café",
  "Real Estate",
  "Fashion & Tailoring",
  "Education",
  "Healthcare",
  "Retail & E-commerce",
  "Professional Services",
  "Technology / SaaS",
  "Other",
];

const needs = [
  "Website",
  "Mobile App",
  "Web App / SaaS",
  "E-commerce",
  "Website Redesign",
  "Branding",
  "SEO & Digital Marketing",
  "Custom Software",
  "Other",
];

const goals = [
  "Get more customers",
  "Build a stronger online presence",
  "Increase sales or bookings",
  "Generate more leads",
  "Automate business operations",
  "Launch a new product or service",
  "Improve the brand experience",
  "Other",
];

const features = [
  "Online booking",
  "Online payments",
  "User accounts",
  "Admin dashboard",
  "CMS / content management",
  "WhatsApp integration",
  "AI / chatbot",
  "Maps & location",
  "Search & filters",
  "Analytics & reporting",
  "Multilingual support",
  "Other",
];

const contactMethods = ["Email", "WhatsApp", "Phone call", "Telegram", "Other"];

type FormState = {
  name: string;
  businessName: string;
  businessType: string;
  need: string;
  goal: string;
  features: string[];
  contactMethod: string;
  contactValue: string;
};

const initialForm: FormState = {
  name: "",
  businessName: "",
  businessType: "",
  need: "",
  goal: "",
  features: [],
  contactMethod: "",
  contactValue: "",
};

const questions = [
  "Your name",
  "Business name",
  "Business type",
  "What do you need?",
  "What's your main goal?",
  "What features do you need?",
  "How can we contact you?",
];

function ChoiceList({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`${optionClass} ${selected ? "border-gold/70 bg-gold/10 shadow-[0_0_0_1px_hsl(var(--gold)/0.18)]" : ""}`}
          >
            <span>{option}</span>
            {selected && <Check className="h-4 w-4 shrink-0 text-gold" />}
          </button>
        );
      })}
    </div>
  );
}

export function ContactForm() {
  const send = useServerFn(submitMessage);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / questions.length) * 100;
  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return form.name.trim().length >= 2;
      case 1:
        return form.businessName.trim().length >= 2;
      case 2:
        return Boolean(form.businessType);
      case 3:
        return Boolean(form.need);
      case 4:
        return Boolean(form.goal);
      case 5:
        return form.features.length > 0;
      case 6:
        return Boolean(form.contactMethod) && form.contactValue.trim().length >= 3;
      default:
        return false;
    }
  }, [form, step]);

  const setText = (key: "name" | "businessName" | "contactValue") => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));
  };

  const submit = async () => {
    setBusy(true);
    setError("");

    const contactLine = `${form.contactMethod}: ${form.contactValue.trim()}`;
    const message = [
      "Website enquiry",
      "",
      `Business type: ${form.businessType}`,
      `What they need: ${form.need}`,
      `Main goal: ${form.goal}`,
      `Requested features: ${form.features.join(", ")}`,
      `Preferred contact: ${contactLine}`,
    ].join("\n");

    const email = form.contactMethod === "Email" ? form.contactValue.trim() : "";
    const phone =
      form.contactMethod === "WhatsApp" || form.contactMethod === "Phone call"
        ? form.contactValue.trim()
        : "";

    try {
      await send({
        data: {
          name: form.name.trim(),
          email,
          phone,
          company: form.businessName.trim(),
          message,
        },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    if (!canContinue) {
      setError("Please answer this question before continuing.");
      return;
    }
    setError("");
    if (step === questions.length - 1) {
      void submit();
    } else {
      setStep((current) => current + 1);
    }
  };

  if (done) {
    return (
      <div className="mt-8 rounded-3xl border border-gold/30 bg-gold/[0.06] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <Check className="h-6 w-6 text-gold" />
        </div>
        <h3 className="mt-5 font-display text-2xl">We received your message.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          Thank you for sharing your project with us. We’ll review your answers and contact you using your preferred method.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-7">
        <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div key={step} className="animate-[fade-in_300ms_ease-out]">
        <div className="eyebrow">Question {step + 1}</div>
        <h3 className="mt-3 font-display text-2xl sm:text-3xl">{questions[step]}</h3>

        {step === 0 && (
          <input
            autoFocus
            required
            minLength={2}
            className={inputClass}
            value={form.name}
            onChange={setText("name")}
            placeholder="Your full name"
          />
        )}

        {step === 1 && (
          <input
            autoFocus
            required
            minLength={2}
            className={inputClass}
            value={form.businessName}
            onChange={setText("businessName")}
            placeholder="Your business or company name"
          />
        )}

        {step === 2 && (
          <ChoiceList
            options={businessTypes}
            value={form.businessType}
            onChange={(value) => setForm((current) => ({ ...current, businessType: value }))}
          />
        )}

        {step === 3 && (
          <ChoiceList
            options={needs}
            value={form.need}
            onChange={(value) => setForm((current) => ({ ...current, need: value }))}
          />
        )}

        {step === 4 && (
          <ChoiceList
            options={goals}
            value={form.goal}
            onChange={(value) => setForm((current) => ({ ...current, goal: value }))}
          />
        )}

        {step === 5 && (
          <>
            <p className="mt-3 text-sm text-muted-foreground">Choose all that apply.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const selected = form.features.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`${optionClass} ${selected ? "border-gold/70 bg-gold/10 shadow-[0_0_0_1px_hsl(var(--gold)/0.18)]" : ""}`}
                  >
                    <span>{feature}</span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${selected ? "border-gold bg-gold text-black" : "border-white/20"}`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Choose your preferred channel, then enter the detail we should use.
            </p>
            <ChoiceList
              options={contactMethods}
              value={form.contactMethod}
              onChange={(value) => setForm((current) => ({ ...current, contactMethod: value }))}
            />
            <label className="mt-5 block text-sm">
              {form.contactMethod ? `${form.contactMethod} ${form.contactMethod === "Email" ? "address" : "number / username"}` : "Your contact detail"}
              <input
                required
                className={inputClass}
                value={form.contactValue}
                onChange={setText("contactValue")}
                placeholder={
                  form.contactMethod === "Email"
                    ? "you@example.com"
                    : form.contactMethod === "WhatsApp" || form.contactMethod === "Phone call"
                      ? "+251 ..."
                      : "Your contact detail"
                }
              />
            </label>
          </>
        )}
      </div>

      {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={step === 0 || busy}
          onClick={() => {
            setError("");
            setStep((current) => Math.max(0, current - 1));
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm transition-colors hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={next}
          className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : step === questions.length - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {step === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
