"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Attendance = "yes" | "no";
type PlusOne = "yes" | "no";

const EVENT_DATE_ISO = "2026-06-27T15:30:00";
const PHOTO_SHARE_URL = "https://t.me/+fUcrOMkQtJphNzUy";
const HOST_INSTAGRAM_URL =
  "https://www.instagram.com/dimas_showman?igsh=d24xOXIxcXFrbG02";

const timeline = [
  {
    iconSrc: "/wed_4.png",
    time: "15:30",
    title: "Сбор гостей",
    text: "Будем рады обнять вас, сделать первые фотографии и вместе настроиться на красивый вечер.",
  },
  {
    iconSrc: "/photo2.png",
    time: "16:00",
    title: "Праздничный ужин",
    text: "Тёплые слова, музыка, танцы и атмосфера, которую мы запомним надолго.",
  },
  {
    iconSrc: "/svg.png",
    time: "23:00",
    title: "Завершение вечера",
    text: "Пусть после этого вечера у каждого останется немного магии внутри.",
  },
];

const drinksOptions = [
  "Красное вино",
  "Белое вино",
  "Игристое",
  "Виски",
  "Коньяк",
  "Водка",
  "Безалкогольные напитки",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function Countdown() {
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const eventDate = new Date(EVENT_DATE_ISO).getTime();
  const diff = Math.max(0, eventDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const items = [
    { label: "дней", value: days },
    { label: "часов", value: hours },
    { label: "минут", value: minutes },
    { label: "секунд", value: seconds },
  ];

  return (
    <div className="countdown-grid">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`countdown-cell ${index > 1 ? "countdown-cell-mobile-top" : ""}`}>
          <div className="countdown-value">{pad(item.value)}</div>
          <div className="countdown-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [plusOne, setPlusOne] = useState<PlusOne>("no");
  const [drinks, setDrinks] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [heroHeight, setHeroHeight] = useState("100vh");

  const guestCount = useMemo(() => {
    if (attendance === "no") return 0;
    return plusOne === "yes" ? 2 : 1;
  }, [attendance, plusOne]);

  useEffect(() => {
    function updateHeroHeight() {
      const viewportHeight = window.innerHeight;
      const minHeight = Math.round(viewportHeight * 0.62);
      const nextHeight = Math.max(
        minHeight,
        viewportHeight - window.scrollY * 0.45,
      );
      setHeroHeight(`${nextHeight}px`);
    }

    updateHeroHeight();
    window.addEventListener("scroll", updateHeroHeight, { passive: true });
    window.addEventListener("resize", updateHeroHeight);

    return () => {
      window.removeEventListener("scroll", updateHeroHeight);
      window.removeEventListener("resize", updateHeroHeight);
    };
  }, []);

  function toggleDrink(drink: string) {
    setDrinks((prev) =>
      prev.includes(drink)
        ? prev.filter((item) => item !== drink)
        : [...prev, drink],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!guestName.trim()) {
      setMessage("Пожалуйста, укажите имя и фамилию.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName,
          attendance,
          plusOne,
          guestCount,
          drinks,
          allergies,
          website: "", // honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось отправить форму.");
      }

      setMessage("Спасибо! Ваш ответ успешно сохранён.");
      setGuestName("");
      setAttendance("yes");
      setPlusOne("no");
      setDrinks([]);
      setAllergies("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при отправке.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <section className="px-0">
        <div
          className="relative w-full overflow-hidden bg-cover bg-center"
          style={{
            height: heroHeight,
            transition: "height 120ms linear",
            backgroundImage:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.45) 100%), url('/1.jpg')",
          }}>
          <div className="absolute bottom-8 left-6 z-10 text-left md:bottom-12 md:left-16">
            <h1 className="text-5xl font-semibold leading-tight text-white md:text-7xl">
              Маша & Никита
            </h1>
            <p className="mt-3 text-lg text-white/90 md:mt-4 md:text-2xl">
              27 июня 2026
            </p>
          </div>
        </div>
      </section>

      <section className="container-main py-10 md:py-14">
        <div className="mx-auto max-w-3xl border-b border-white/25 pb-10 text-center md:pb-14">
          <p className="text-lg leading-8 text-white/75 md:text-2xl md:leading-relaxed">
            Для нас это особенный день, и нам будет очень радостно провести его
            вместе с теми, кто действительно важен. С большим удовольствием
            приглашаем вас на знаменательный праздник — нашу свадьбу!
          </p>
          <p className="mt-8 text-xl text-white/85 md:text-3xl">
            С любовью, Маша и Никита!
          </p>
        </div>
      </section>

      <section className="container-main py-10 md:py-14">
        <div className="md:p-12">
          <h2 className="section-title text-center">Программа торжества</h2>

          <div className="relative mx-auto mt-12 max-w-3xl">
            <div
              className="absolute bottom-8 left-12 top-8 z-0 hidden w-px bg-white/10 md:block"
              aria-hidden
            />

            <div className="relative z-10 space-y-8 md:space-y-10">
              {timeline.map((item) => (
                <div
                  key={item.time}
                  className="relative z-20 flex items-start gap-5 md:gap-8">
                  <div className="relative z-30 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1f1d20] md:h-28 md:w-28">
                    <Image
                      src={item.iconSrc}
                      alt=""
                      aria-hidden
                      width={88}
                      height={88}
                      className="h-20 w-20 min-h-[80px] min-w-[80px] object-contain opacity-90"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="text-2xl font-semibold leading-none text-white md:text-3xl">
                      {item.time}
                    </div>
                    <div className="mt-3 text-xl text-white/95 md:text-2xl">
                      {item.title}
                    </div>
                    <div className="mt-3 max-w-xl text-base leading-8 text-white/75 md:text-lg md:leading-8">
                      {item.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-10 md:py-14">
        <div className="glass-card rounded-[32px] p-8 text-center md:p-12">
          <h2 className="section-title">Место проведения</h2>

          <div className="relative mt-8 overflow-hidden rounded-[18px]">
            <Image
              src="/rynkovka.jpg"
              alt="Загородный комплекс Рыньковка"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" aria-hidden />
          </div>

          <p className="mt-8 text-2xl text-white/90 md:text-3xl">
            Загородный комплекс &quot;Рыньковка&quot;
          </p>
          <p className="mt-3 text-lg text-white/75 md:text-xl">
            Брестский район, М-1, 8-й километр, 2
          </p>

          <a
            href="https://yandex.com/maps/-/CPV~VNK6"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary mt-8 inline-flex items-center justify-center">
            Посмотреть на карте
          </a>
        </div>
      </section>

      <section className="container-main py-10 md:py-14">
        <div className="md:p-12">
          <h2 className="section-title text-center">Детали</h2>
          <div className="mt-8  p-6 text-center md:p-8">
            <p className="text-lg leading-8 text-white/90 md:text-2xl md:leading-relaxed">
              Самый ценный подарок для нас - ваше присутствие.
            </p>
            <p className="mt-3 text-lg leading-8 text-white/80 md:text-xl md:leading-relaxed">
              Если захотите поддержать нас символическим знаком внимания, вместо
              цветов можно принести корм для животных. После свадьбы мы
              передадим его в приют &quot;Доброта&quot;.
            </p>
          </div>

          <div className="mt-10 p-6 text-center md:p-8">
            <p className="text-lg leading-8 text-white/90 md:text-2xl md:leading-relaxed">
              Переходите по этой ссылке и делитесь фотографиями в течение
              вечера!
            </p>

            <a
              href={PHOTO_SHARE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-6 inline-flex items-center justify-center">
              Перейти в Telegram
            </a>
          </div>
        </div>
      </section>

      <section className="container-main py-10 md:py-14">
        <div className="md:p-12">
          <h2 className="section-title text-center">Наш ведущий</h2>
          <p className="mt-6 text-lg leading-8 text-white/85 md:text-2xl md:leading-relaxed text-center">
            {" "}
            <a
              href={HOST_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/50 underline-offset-4 transition hover:text-white">
              Дмитрий Зауголков
            </a>
          </p>
        </div>
      </section>

      <section
        id="rsvp"
        className="container-main py-10 pb-20 md:py-14 md:pb-28">
        <div className="glass-card rounded-[32px] p-8 md:p-12">
          <h2 className="section-title">Подтверждение присутствия</h2>
          <p className="section-text mt-4 max-w-2xl">
            Ваши ответы на вопросы очень помогут нам при организации свадьбы.
          </p>

          <p className="section-text mt-4 max-w-2xl">
            Будем ждать ответ до 1.05.2026 г.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-7">
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
            />

            <div>
              <label className="mb-3 block text-lg text-white/70">
                Имя и фамилия
              </label>
              <input
                className="input-ui"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Например: Анна Иванова"
              />
            </div>

            <div>
              <div className="mb-3 block text-lg text-white/70">
                Сможете ли вы присутствовать?
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("yes")}
                  className={`btn-secondary ${attendance === "yes" ? "choice-active" : ""}`}>
                  Да, приду
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance("no")}
                  className={`btn-secondary ${attendance === "no" ? "choice-active" : ""}`}>
                  Нет, не смогу
                </button>
              </div>
            </div>

            {attendance === "yes" && (
              <div>
                <div className="mb-3 block text-lg text-white/70">
                  Будете ли вы с +1?
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPlusOne("no")}
                    className={`btn-secondary ${plusOne === "no" ? "choice-active" : ""}`}>
                    Нет
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlusOne("yes")}
                    className={`btn-secondary ${plusOne === "yes" ? "choice-active" : ""}`}>
                    Да, буду с +1
                  </button>
                </div>
              </div>
            )}

            {attendance === "yes" && (
              <div>
                <div className="mb-3 block text-lg text-white/70">
                  Предпочтения по напиткам
                </div>
                <p className="mb-4 text-xs uppercase tracking-[0.08em] text-white/45">
                  Можно выбрать несколько вариантов
                </p>

                <div className="space-y-3">
                  {drinksOptions.map((drink) => (
                    <label
                      key={drink}
                      className="flex cursor-pointer items-center gap-3 text-lg text-white/90">
                      <input
                        type="checkbox"
                        checked={drinks.includes(drink)}
                        onChange={() => toggleDrink(drink)}
                        className="h-5 w-5 cursor-pointer accent-white"
                      />
                      <span>{drink}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-3 block text-lg text-white/70">
                Аллергии или ограничения по еде
              </label>
              <textarea
                rows={4}
                className="input-ui"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Например: орехи, морепродукты, не употребляю алкоголь"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary">
                {isSubmitting ? "Отправка..." : "Отправить ответ"}
              </button>

              {message ? (
                <p className="text-lg text-white/70">{message}</p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
      <section className="container-main py-10 md:py-14">
        <div className="countdown-panel">
          <h2 className="countdown-title">Увидимся с вами через</h2>
          <div className="countdown-inner">
            <Countdown />
          </div>
        </div>
      </section>
    </main>
  );
}
