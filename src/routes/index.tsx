import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import openingTeam from "@/assets/opening-team.png.asset.json";
import laserBrochure from "@/assets/laser-brochure.png.asset.json";
import ndYagBrochure from "@/assets/nd-yag-brochure.png.asset.json";
import iplBrochure from "@/assets/ipl-brochure.png.asset.json";
import facialBrochure from "@/assets/facial-cleansing-brochure.png.asset.json";
import welcomeTeam from "@/assets/welcome-team.png.asset.json";
import stillLife from "@/assets/beauty-still-life.jpg";
import salonInterior from "@/assets/salon-interior.png.asset.json";
import salonTeam from "@/assets/salon-team.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruse Beauty Face | Козметичен салон в Русе" },
      { name: "description", content: "Ruse Beauty Face — beauty care и лазерна епилация на ул. „Олимпи Панов“ 19, Русе. Разгледайте салона и направете запитване за час." },
      { property: "og:title", content: "Ruse Beauty Face | Козметичен салон в Русе" },
      { property: "og:description", content: "Beauty care и лазерна епилация в спокойна и професионална среда в Русе." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  ["За нас", "#about"], ["Услуги", "#services"], ["Записване", "#booking"],
  ["Галерия", "#gallery"], ["Контакти", "#contact"],
];

const services = [
  { name: "Лазерна епилация", detail: "Зони за лице и тяло", duration: "30–60 мин", price: "от 30 лв." },
  { name: "Почистване на лице", detail: "Персонализирана beauty care грижа", duration: "60 мин", price: "от 70 лв." },
  { name: "Хидратираща терапия", detail: "Възстановяваща грижа за сияйна кожа", duration: "50 мин", price: "от 65 лв." },
];

const specialists = [
  { name: "Специалист 01", role: "Beauty care" },
  { name: "Специалист 02", role: "Лазерна епилация" },
];

const slots = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "18:30"];
const disabledSlots = new Set(["11:30", "16:00"]);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{children}</p>;
}

function DemoBadge() {
  return <span className="inline-flex border border-champagne px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">Demo данни</span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-primary-foreground/20 text-primary-foreground">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:flex lg:px-10">
        <a href="#top" className="min-w-0 font-display text-xl leading-none sm:text-2xl">Ruse Beauty Face</a>
        <nav className="hidden items-center gap-8 lg:ml-auto lg:flex" aria-label="Основна навигация">
          {navItems.map(([label, href]) => <a key={href} href={href} className="text-xs uppercase tracking-[0.14em] opacity-80 transition-opacity hover:opacity-100">{label}</a>)}
        </nav>
        <Button asChild variant="champagne" size="luxury" className="hidden lg:inline-flex"><a href="#booking">Запази час</a></Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Затвори меню" : "Отвори меню"}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-primary-foreground/20 bg-primary px-5 py-6 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-primary-foreground/10 py-4 text-sm uppercase tracking-[0.14em]">{label}</a>)}</nav>}
    </header>
  );
}

function Booking() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const steps = ["Услуга", "Специалист", "Дата", "Час", "Данни", "Готово"];
  const canContinue = [Boolean(service), Boolean(specialist), Boolean(date), Boolean(time), true, false][step];
  const selectedService = useMemo(() => services.find((item) => item.name === service), [service]);

  const validateAndFinish = () => {
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) nextErrors["name"] = "Моля, въведете име.";
    if (!/^[+\d][\d\s-]{7,19}$/.test(form.phone.trim())) nextErrors["phone"] = "Моля, въведете валиден телефон.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors["email"] = "Моля, въведете валиден имейл.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(5);
  };

  const chooseAndAdvance = (setter: (value: string) => void, value: string) => {
    setter(value);
    window.setTimeout(() => setStep((current) => current + 1), 180);
  };

  return (
    <section id="booking" className="bg-primary py-20 text-primary-foreground sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <SectionLabel>Онлайн записване · Demo</SectionLabel>
          <h2 className="font-display text-4xl leading-tight sm:text-6xl">Вашето време за грижа</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/65">Изберете предпочитания час. Това е демонстрационна форма — заявката не се изпраща автоматично.</p>
        </div>
        <div className="border border-primary-foreground/20 bg-card text-card-foreground shadow-2xl shadow-primary/30">
          <div className="overflow-x-auto border-b border-border px-5 py-5 sm:px-8">
            <div className="flex min-w-[620px] items-center justify-between">
              {steps.map((item, index) => <div key={item} className="flex items-center last:flex-none">
                <div className="flex items-center gap-2.5"><span className={`grid size-7 place-items-center rounded-full text-[0.65rem] font-semibold transition-colors ${index <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index < step ? <Check className="size-3.5" /> : index + 1}</span><span className={`text-[0.66rem] uppercase tracking-[0.13em] ${index === step ? "text-foreground" : "text-muted-foreground"}`}>{item}</span></div>
                {index < steps.length - 1 && <span className="mx-4 h-px w-7 bg-border sm:w-12" />}
              </div>)}
            </div>
          </div>

          <div key={step} className="min-h-[500px] p-5 reveal-up sm:p-10 lg:p-14">
            {step === 0 && <div><div className="mb-8 flex items-center justify-between gap-4"><div><DemoBadge /><h3 className="mt-4 font-display text-3xl">Изберете услуга</h3></div><span className="text-xs text-muted-foreground">01 / 06</span></div><div className="grid gap-3 lg:grid-cols-3">{services.map((item) => <button key={item.name} type="button" onClick={() => chooseAndAdvance(setService, item.name)} className={`group min-h-52 border p-6 text-left transition-all hover:-translate-y-1 hover:border-champagne ${service === item.name ? "border-primary bg-secondary" : "border-border bg-card"}`}><Sparkles className="mb-8 size-5 text-champagne" /><h4 className="font-display text-2xl">{item.name}</h4><p className="mt-3 text-sm text-muted-foreground">{item.detail}</p><div className="mt-7 flex items-end justify-between text-xs"><span>{item.duration}</span><span className="font-semibold">{item.price}</span></div></button>)}</div></div>}
            {step === 1 && <div><div className="mb-8 flex items-center justify-between"><div><DemoBadge /><h3 className="mt-4 font-display text-3xl">Изберете специалист</h3></div><span className="text-xs text-muted-foreground">02 / 06</span></div><div className="grid gap-4 sm:grid-cols-2">{specialists.map((item, index) => <button key={item.name} type="button" onClick={() => chooseAndAdvance(setSpecialist, item.name)} className={`flex items-center gap-5 border p-5 text-left transition-all hover:border-champagne ${specialist === item.name ? "border-primary bg-secondary" : "border-border"}`}><span className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary font-display text-2xl">0{index + 1}</span><span><strong className="block font-display text-xl font-normal">{item.name}</strong><span className="mt-1 block text-sm text-muted-foreground">{item.role}</span></span><ArrowRight className="ml-auto size-4" /></button>)}</div></div>}
            {step === 2 && <div><div className="mb-6 flex items-center justify-between"><div><DemoBadge /><h3 className="mt-4 font-display text-3xl">Изберете дата</h3></div><span className="text-xs text-muted-foreground">03 / 06</span></div><div className="flex justify-center py-4"><Calendar mode="single" selected={date} onSelect={(value) => { if (value) { setDate(value); window.setTimeout(() => setStep(3), 180); } }} locale={bg} disabled={[{ before: new Date() }, { dayOfWeek: [0] }]} className="pointer-events-auto w-full max-w-md bg-card p-0 [--cell-size:2.75rem] sm:[--cell-size:3.25rem]" /></div><p className="mt-5 text-center text-xs text-muted-foreground">Неделя е почивен ден.</p></div>}
            {step === 3 && <div><div className="mb-8 flex items-center justify-between"><div><DemoBadge /><h3 className="mt-4 font-display text-3xl">Свободни часове</h3><p className="mt-2 text-sm text-muted-foreground">{date ? format(date, "d MMMM yyyy", { locale: bg }) : ""}</p></div><span className="text-xs text-muted-foreground">04 / 06</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{slots.map((slot) => <Button key={slot} type="button" variant={time === slot ? "luxury" : "outline"} size="lg" disabled={disabledSlots.has(slot)} onClick={() => chooseAndAdvance(setTime, slot)} className="h-14 rounded-none">{slot}</Button>)}</div><div className="mt-7 flex gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-primary" />Свободен</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-muted" />Зает</span></div></div>}
            {step === 4 && <div><div className="mb-8 flex items-center justify-between"><div><h3 className="font-display text-3xl">Вашите данни</h3><p className="mt-2 text-sm text-muted-foreground">Ще се свържем с вас за потвърждение.</p></div><span className="text-xs text-muted-foreground">05 / 06</span></div><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs uppercase tracking-[0.12em]">Име и фамилия *<Input value={form.name} maxLength={100} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 h-12 rounded-none" placeholder="Вашето име" />{errors["name"] && <span className="mt-1 block text-xs text-destructive">{errors["name"]}</span>}</label><label className="text-xs uppercase tracking-[0.12em]">Телефон *<Input value={form.phone} maxLength={20} inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 h-12 rounded-none" placeholder="08•• ••• •••" />{errors["phone"] && <span className="mt-1 block text-xs text-destructive">{errors["phone"]}</span>}</label><label className="text-xs uppercase tracking-[0.12em] sm:col-span-2">Имейл <Input value={form.email} maxLength={255} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 h-12 rounded-none" placeholder="name@example.com" />{errors["email"] && <span className="mt-1 block text-xs text-destructive">{errors["email"]}</span>}</label><label className="text-xs uppercase tracking-[0.12em] sm:col-span-2">Бележка <Textarea value={form.note} maxLength={500} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-2 min-h-24 rounded-none" placeholder="Нещо, което е важно да знаем" /></label></div><Button variant="luxury" size="luxury" className="mt-7 w-full sm:w-auto" onClick={validateAndFinish}>Преглед на заявката <ArrowRight /></Button></div>}
            {step === 5 && <div className="mx-auto max-w-xl py-6 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-secondary"><Check className="size-7" /></span><DemoBadge /><h3 className="mt-5 font-display text-4xl">Заявката е подготвена</h3><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">Това е демонстрация. Часът не е изпратен. За реално записване се обадете на <a className="font-semibold text-foreground underline underline-offset-4" href="tel:+359887871548">0887 871 548</a>.</p><div className="mt-8 border-y border-border py-6 text-left text-sm"><div className="grid grid-cols-2 gap-y-4"><span className="text-muted-foreground">Услуга</span><strong>{selectedService?.name}</strong><span className="text-muted-foreground">Специалист</span><strong>{specialist}</strong><span className="text-muted-foreground">Дата и час</span><strong>{date ? format(date, "d MMM yyyy", { locale: bg }) : ""}, {time}</strong><span className="text-muted-foreground">Име</span><strong>{form.name}</strong></div></div><Button asChild variant="luxury" size="luxury" className="mt-8"><a href="tel:+359887871548"><Phone /> Обади се за потвърждение</a></Button></div>}
          </div>
          {step > 0 && step < 5 && <div className="flex items-center justify-between border-t border-border px-5 py-5 sm:px-10"><Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft /> Назад</Button>{step < 4 && <Button variant="luxury" disabled={!canContinue} onClick={() => setStep(step + 1)}>Напред <ArrowRight /></Button>}</div>}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return <main id="top">
    <Header />
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <img src={openingTeam.url} width={768} height={1024} alt="Две участнички на козметично обучение" className="mt-20 max-h-[900px] w-full object-contain" />
      <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-10">
        <div className="reveal-up"><p className="mb-4 text-xs uppercase tracking-[0.18em] text-primary-foreground/75">Beauty care & laser studio · Русе</p><h1 className="font-display text-4xl leading-tight sm:text-6xl">Ruse Beauty Face</h1><p className="mt-4 max-w-lg text-sm leading-7 text-primary-foreground/75">Красотата започва с грижа. Спокойно пространство за beauty care и лазерна епилация в сърцето на Русе.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild variant="champagne" size="luxury"><a href="#booking">Запази час <ArrowRight /></a></Button><Button asChild variant="outline" size="luxury" className="rounded-none border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><a href="#services">Разгледай услугите</a></Button></div></div>
      </div>
    </section>

    <section id="about" className="py-20 sm:py-32"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10"><div><SectionLabel>За нас</SectionLabel><h2 className="font-display text-4xl leading-tight sm:text-6xl">Грижа, която се усеща лично.</h2><p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">Ruse Beauty Face е козметичен салон в Русе с фокус върху beauty care и лазерна епилация. Посрещаме ви в спокойна, професионална среда и подхождаме с внимание към всяко посещение.</p><div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-7"><div><ShieldCheck className="mb-3 size-5 text-champagne" /><strong className="font-display text-xl font-normal">Професионална грижа</strong></div><div><Sparkles className="mb-3 size-5 text-champagne" /><strong className="font-display text-xl font-normal">Личен подход</strong></div></div></div><div className="relative"><img src={salonTeam.url} loading="lazy" width={768} height={768} alt="Екипът на Ruse Beauty Face в салона" className="aspect-square w-full object-cover" /><div className="absolute -bottom-5 -left-3 bg-primary px-5 py-4 text-primary-foreground sm:-left-6"><span className="block text-[0.6rem] uppercase tracking-[0.18em] opacity-60">Адрес</span><span className="mt-1 block text-sm">ул. „Олимпи Панов“ 19</span></div></div></div></section>

    <section id="services" className="bg-ivory py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10">
      <div className="mb-16 border-b border-border pb-16">
        <SectionLabel>01 · Лазерна епилация</SectionLabel>
        <h2 className="mb-8 font-display text-4xl leading-tight sm:text-6xl">Лазерна епилация</h2>
        <img src={laserBrochure.url} loading="lazy" width={1366} height={768} alt="Информация от салона за Fotora Quattro Ultra" className="h-auto w-full object-contain" />
      </div>
      <div className="mb-16 border-b border-border pb-16">
        <SectionLabel>02 · Апаратно почистване на лице</SectionLabel>
        <h2 className="mb-8 font-display text-4xl leading-tight sm:text-6xl">Апаратно почистване на лице</h2>
        <div className="grid items-start gap-6 md:grid-cols-3">
          <img src={ndYagBrochure.url} loading="lazy" width={768} height={1366} alt="Ценоразпис: Nd Yag Laser и карбонов пилинг" className="h-auto w-full object-contain" />
          <img src={iplBrochure.url} loading="lazy" width={768} height={1366} alt="Ценоразпис: IPL и области на приложение" className="h-auto w-full object-contain" />
          <img src={facialBrochure.url} loading="lazy" width={768} height={1366} alt="Ценоразпис: апаратно почистване с водно дермабразио" className="h-auto w-full object-contain" />
        </div>
      </div>
      <div className="grid gap-5 border-b border-border pb-10 sm:grid-cols-[1fr_auto] sm:items-end"><div><SectionLabel>Услуги</SectionLabel><h2 className="font-display text-4xl sm:text-6xl">Ритуали за вашата кожа</h2></div><div className="sm:pb-2"><DemoBadge /><p className="mt-3 max-w-sm text-xs leading-5 text-muted-foreground">Имената, продължителността и цените по-долу са примерни и очакват потвърждение от салона.</p></div></div><div>{services.map((item, index) => <article key={item.name} className="group grid gap-5 border-b border-border py-8 transition-colors hover:bg-card sm:grid-cols-[80px_1fr_auto] sm:items-center sm:px-5"><span className="font-display text-2xl text-muted-foreground">0{index + 1}</span><div><h3 className="font-display text-3xl">{item.name}</h3><p className="mt-2 text-sm text-muted-foreground">{item.detail} · {item.duration}</p></div><div className="flex items-center justify-between gap-8 sm:justify-end"><strong className="text-sm">{item.price}</strong><Button asChild variant="ghost" size="icon" className="rounded-full border border-border"><a href="#booking" aria-label={`Избери ${item.name}`}><ArrowRight /></a></Button></div></article>)}</div></div></section>

    <Booking />

    <section id="gallery" className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="mb-10 max-w-xl"><SectionLabel>Галерия</SectionLabel><h2 className="font-display text-4xl sm:text-6xl">В салона</h2></div><div className="grid auto-rows-[220px] gap-3 sm:grid-cols-2 sm:auto-rows-[300px] lg:grid-cols-12"><figure className="overflow-hidden sm:row-span-2 lg:col-span-5"><img src={salonInterior.url} loading="lazy" width={768} height={1024} alt="Интериор и рецепция на Ruse Beauty Face" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></figure><figure className="overflow-hidden lg:col-span-7"><img src={stillLife} loading="lazy" width={1408} height={1008} alt="Козметична грижа в неутрални тонове" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]" /></figure><figure className="overflow-hidden lg:col-span-7"><img src={salonTeam.url} loading="lazy" width={768} height={768} alt="Екипът на салона" className="h-full w-full object-cover object-[center_35%] transition-transform duration-700 hover:scale-[1.02]" /></figure></div></div></section>

    <section id="contact" className="bg-secondary py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]"><div><SectionLabel>Контакти</SectionLabel><h2 className="font-display text-5xl leading-tight sm:text-7xl">Заповядайте, очакваме ви…</h2><Button asChild variant="luxury" size="luxury" className="mt-9"><a href="tel:+359887871548"><Phone /> 0887 871 548</a></Button></div><div className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"><div><MapPin className="mb-5 size-5 text-champagne" /><h3 className="text-xs font-semibold uppercase tracking-[0.16em]">Адрес</h3><p className="mt-3 leading-7 text-muted-foreground">ул. „Олимпи Панов“ 19<br />Русе</p><a href="https://www.google.com/maps/search/?api=1&query=%D1%83%D0%BB.%20%D0%9E%D0%BB%D0%B8%D0%BC%D0%BF%D0%B8%20%D0%9F%D0%B0%D0%BD%D0%BE%D0%B2%2019%2C%20%D0%A0%D1%83%D1%81%D0%B5" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-foreground pb-1 text-xs uppercase tracking-[0.12em]">Отвори в Maps <ArrowRight className="size-3" /></a></div><div><Clock3 className="mb-5 size-5 text-champagne" /><h3 className="text-xs font-semibold uppercase tracking-[0.16em]">Работно време</h3><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Понеделник–Петък</dt><dd>09:00–19:00</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Събота</dt><dd>09:00–14:00</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Неделя</dt><dd>Почивен ден</dd></div></dl></div></div></div><div className="mt-14"><img src={welcomeTeam.url} loading="lazy" width={768} height={1024} alt="Две участнички на козметичен семинар" className="mx-auto h-auto w-full max-w-3xl object-contain" /></div></div></section>

    <footer className="bg-primary py-8 text-primary-foreground"><div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-5 lg:px-10"><span className="min-w-0 font-display text-xl">Ruse Beauty Face</span><span className="text-right text-[0.62rem] uppercase tracking-[0.15em] text-primary-foreground/50">Beauty care · Русе</span></div></footer>
  </main>;
}
