"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* ШАПКА С МЕНЮ */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black text-red-700 tracking-tight">
            АВТОВЫКУП
          </Link>
          <nav className="hidden md:flex gap-6 font-medium text-gray-600">
            <Link href="#services" className="hover:text-red-700 transition">Услуги</Link>
            <Link href="#why" className="hover:text-red-700 transition">Почему мы</Link>
            <Link href="#reviews" className="hover:text-red-700 transition">Отзывы</Link>
            <Link href="#faq" className="hover:text-red-700 transition">Вопросы</Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="tel:+79527992760" className="font-bold text-lg hidden md:block hover:text-red-700">+7 952 799-27-60</a>
            <Link href="/quiz" className="bg-red-700 text-white px-5 py-2 rounded-full font-bold hover:bg-red-800 transition text-sm">
              ОЦЕНИТЬ АВТО
            </Link>
          </div>
        </div>
      </header>

      {/* ГЛАВНЫЙ БАННЕР (HERO) */}
      <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/hero-bg.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-lg mb-4">Калининградская область</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Срочный выкуп автомобилей в любом состоянии
          </h1>
          <p className="text-xl md:text-2xl text-red-500 font-bold mb-10">
            Деньги в кармане за 60 минут
          </p>
          <Link href="/quiz" className="inline-block bg-red-700 text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-red-800 transition shadow-lg shadow-red-700/50">
            РАССЧИТАТЬ СТОИМОСТЬ
          </Link>
        </div>
      </section>

      {/* УСЛУГИ */}
      <section id="services" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-2">Услуги</h2>
        <p className="text-gray-500 text-center mb-12">Оставьте заявку на выбранную вами услугу</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Выкуп авто", desc: "Бесплатный выезд оценщика" },
            { title: "Выкуп авто из кредита или залога", desc: "Производим выкуп кредитных и залоговых авто" },
            { title: "Обмен, Трейд-ин", desc: "Выгодный обмен вашего автомобиля на автомобиля из нашего автопарка" }
          ].map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between text-center">
              <div>
                <h3 className="text-xl font-bold mb-4 h-14">{service.title}</h3>
                <p className="text-gray-500 mb-8">{service.desc}</p>
              </div>
              <Link href="/quiz" className="block w-full bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600 transition">
                ОЦЕНИТЬ
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ПОЧЕМУ МЫ */}
      <section id="why" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2">Почему наш Автовыкуп</h2>
          <p className="text-gray-500 text-center mb-16">Наша главная цель — выкуп автомобилей по самым выгодным ценам</p>
          
          <div className="space-y-10">
            {[
              { icon: "💵", title: "Дорого и быстро", desc: "Получите до 95% рыночной стоимости" },
              { icon: "🗺️", title: "Оформление за 30 минут", desc: "После осмотра автомобиля производим быстрое оформление" },
              { icon: "🐷", title: "Деньги сразу", desc: "Вы получаете выплату за автомобиль сразу после подписания договора купли-продажи в полном объеме наличными или на банковский счет" }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-4xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="py-20 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-12">Отзывы наших клиентов</h2>
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <img src="https://i.pravatar.cc/150?img=11" alt="Клиент" className="w-24 h-24 rounded-full mx-auto mb-6 object-cover" />
          <p className="text-gray-600 text-lg italic mb-6">"Очень доволен, что выбрал вашу фирму, понравилось, что быстро оценили мой автомобиль и угостили вкусным кофе)))!"</p>
          <p className="font-bold text-lg">Степан Миков</p>
        </div>
      </section>

      {/* ВОПРОСЫ И ОТВЕТЫ */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Частые вопросы</h2>
          <div className="space-y-4">
            {[
              { q: "Как проходит выкуп?", a: "Сначала вы проходите осмотр. Затем параллельно проходит проверка автомобиля на юридическую чистоту. После прохождения осмотра специалист сообщает цену автомобиля, если она вас устраивает, тогда заключается договор купли-продажи." },
              { q: "Можно ли оценить дистанционно?", a: "Да, вы можете оценить авто дистанционно по телефону и узнать предварительную цену выкупа." },
              { q: "Есть ли выезд оценщика на место стоянки автомобиля?", a: "Да, наш специалист приедет по указанному адресу и произведет осмотр и сообщит точную цену." }
            ].map((item, i) => (
              <details key={i} className="group bg-gray-50 rounded-2xl p-6 cursor-pointer">
                <summary className="font-bold text-lg flex justify-between items-center list-none">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-2xl">+</span>
                </summary>
                <p className="mt-4 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ПОДВАЛ */}
      <footer className="bg-slate-900 text-gray-400 py-12 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl font-black text-white mb-6">АВТОВЫКУП</div>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8 text-sm">
            <Link href="#services" className="hover:text-white">Услуги</Link>
            <Link href="#why" className="hover:text-white">Почему мы</Link>
            <Link href="#reviews" className="hover:text-white">Отзывы</Link>
            <Link href="#faq" className="hover:text-white">Вопросы</Link>
          </div>
          <p>© 2026 Скупка Авто. Все права защищены.</p>
          <p className="mt-2">+7 952 799-27-60 | Калининградская область</p>
          <div className="mt-6">
             <Link href="/admin" className="text-xs text-gray-600 hover:text-white transition">Вход для сотрудника</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}