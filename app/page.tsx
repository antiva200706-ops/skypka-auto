"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Состояние: показываем главный экран или опрос
  const [showQuiz, setShowQuiz] = useState(false); 
  
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [data, setData] = useState({
    brand: "",
    yearRange: "",
    transmission: "",
    condition: "",
    mileageRange: "",
    meetingTime: "",
    phone: "",
    contactMethod: "Звонок",
  });

  const [carsDb, setCarsDb] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetch("/api/cars").then(res => res.json()).then(d => {
      if (Array.isArray(d)) setCarsDb(d);
    });
  }, []);

  const suggestions = carsDb.filter(car => 
    `${car.brand} ${car.model}`.toLowerCase().includes(data.brand.toLowerCase()) && data.brand.length > 0
  );

  const handleSelectCar = (car: any) => {
    setData({ ...data, brand: `${car.brand} ${car.model}` });
    setShowSuggestions(false);
  };

  const nextStep = () => {
    if (step === 1 && !data.brand) return alert("Введите марку авто");
    if (step === 2 && !data.yearRange) return alert("Выберите год");
    if (step === 3 && !data.transmission) return alert("Выберите коробку передач");
    if (step === 4 && !data.condition) return alert("Выберите состояние");
    if (step === 5 && !data.mileageRange) return alert("Выберите пробег");
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.phone) return alert("Введите номер телефона");

    const newLead = {
      brand: data.brand,
      year: data.yearRange, 
      mileage: data.mileageRange,
      phone: data.phone,
      isRunning: data.condition === "Неисправное" ? "Не на ходу" : "На ходу",
      docs: data.condition === "Без документов" ? "Нет документов" : "Полный пакет",
      isDamaged: data.condition === "Битое" ? "Битая" : "Не битая",
      priceMin: 0,
      priceMax: 0,
      extraInfo: `КПП: ${data.transmission} | Осмотр: ${data.meetingTime} | Связь: ${data.contactMethod}`
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Ошибка при отправке заявки");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  const images = {
    manual: "/manual.jpg",
    auto: "/auto.jpg",
    good: "/good.jpg",
    broken: "/broken.jpg",
    broken2: "/engine.jpg",
    zalog: "/zalog.jpg",
    docs: "/docs.jpg",
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Заявка принята!</h1>
          <p className="text-gray-500 mb-8">Наш менеджер свяжется с вами в ближайшее время, чтобы обсудить детали и цену.</p>
          <button onClick={() => window.location.reload()} className="block w-full bg-red-700 text-white font-bold py-4 rounded-xl hover:bg-red-800 transition">
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (!showQuiz) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative overflow-hidden">
        
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/hero-bg.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <header className="relative z-10 flex justify-between items-center p-6 md:px-12 text-white">
          <div className="text-xl font-black tracking-tight">
             СКУПКА АВТО
          </div>
          <div className="text-lg font-bold">+7 952 799-27-60</div>
        </header>

        <main className="relative z-10 flex-grow flex items-center px-6 md:px-12 py-12">
          <div className="max-w-xl">
            <p className="text-gray-400 text-base mb-2">Калининградская область</p>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-6">
              Срочный выкуп автомобилей в любом состоянии
            </h1>
            
            <p className="text-lg md:text-xl text-red-500 font-bold mb-8">
              Деньги в кармане за 60 минут
            </p>
            
            <button 
              onClick={() => setShowQuiz(true)}
              className="bg-red-700 text-white font-bold text-base py-3 px-8 rounded-full hover:bg-red-800 transition shadow-lg shadow-red-700/50"
            >
              РАССЧИТАТЬ СТОИМОСТЬ
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-900">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => setShowQuiz(false)} className="text-xl font-black text-red-700 tracking-tight flex items-center gap-2 hover:text-red-800">
          ← Назад
        </button>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-800">Админка</Link>
      </div>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-lg p-8 md:p-12 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
        
        {step < 7 && (
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-red-700 text-white font-bold px-4 py-2 rounded-full text-sm">
              {step} из 6
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1 && "Марка и модель автомобиля"}
              {step === 2 && "Год выпуска автомобиля"}
              {step === 3 && "Тип коробки передач"}
              {step === 4 && "Состояние вашего автомобиля"}
              {step === 5 && "Пробег вашего автомобиля"}
              {step === 6 && "Когда удобно встретиться?"}
            </h2>
          </div>
        )}

        <div className="flex-grow">
          {step === 1 && (
            <div className="relative max-w-lg">
              <input
                type="text"
                placeholder="Например: Lada Vesta"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-red-500 rounded-xl p-4 text-lg outline-none transition"
                value={data.brand}
                onChange={(e) => { setData({ ...data, brand: e.target.value }); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-2 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {suggestions.map((car) => (
                    <li key={car.id} onClick={() => handleSelectCar(car)} className="p-4 hover:bg-red-50 cursor-pointer border-b last:border-0 font-bold">
                      {car.brand} {car.model}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["до 2005", "2005-2010", "2011-2015", "2016-2020", "2021-2026"].map(year => (
                <button key={year} onClick={() => setData({ ...data, yearRange: year })} className={`p-6 text-left rounded-2xl border-2 transition font-medium ${data.yearRange === year ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 hover:border-red-300'}`}>
                  {year}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <button onClick={() => setData({ ...data, transmission: "Механическая" })} className={`rounded-2xl border-2 overflow-hidden transition text-left ${data.transmission === "Механическая" ? 'border-red-600 shadow-lg' : 'border-gray-100 hover:border-red-300'}`}>
                <img src={images.manual} alt="Механика" className="w-full h-40 object-cover" />
                <div className="p-4 font-bold text-center bg-white">Механическая</div>
              </button>
              <button onClick={() => setData({ ...data, transmission: "Автоматическая" })} className={`rounded-2xl border-2 overflow-hidden transition text-left ${data.transmission === "Автоматическая" ? 'border-red-600 shadow-lg' : 'border-gray-100 hover:border-red-300'}`}>
                <img src={images.auto} alt="Автомат" className="w-full h-40 object-cover" />
                <div className="p-4 font-bold text-center bg-white">Автоматическая</div>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Хорошее состояние", img: images.good },
                { label: "Битое", img: images.broken },
                { label: "Неисправное", img: images.broken2 },
                { label: "В залоге", img: images.zalog },
                { label: "Без документов", img: images.docs }
              ].map(item => (
                <button key={item.label} onClick={() => setData({ ...data, condition: item.label })} className={`rounded-2xl border-2 overflow-hidden transition text-left ${data.condition === item.label ? 'border-red-600 shadow-lg' : 'border-gray-100 hover:border-red-300'}`}>
                  <img src={item.img} alt={item.label} className="w-full h-24 object-cover" />
                  <div className="p-3 font-bold text-sm text-center bg-white">{item.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["от 0 до 50 000 км", "от 50 000 до 100 000 км", "от 100 000 до 200 000 км", "от 200 000 км и более"].map(mil => (
                <button key={mil} onClick={() => setData({ ...data, mileageRange: mil })} className={`p-6 text-left rounded-2xl border-2 transition font-medium ${data.mileageRange === mil ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 hover:border-red-300'}`}>
                  {mil}
                </button>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Сегодня", "Завтра", "Ближайшие 3 дня", "Ближайшую неделю"].map(time => (
                <button key={time} onClick={() => setData({ ...data, meetingTime: time })} className={`p-6 text-left rounded-2xl border-2 transition font-medium ${data.meetingTime === time ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 hover:border-red-300'}`}>
                  {time}
                </button>
              ))}
            </div>
          )}

          {step === 7 && (
            <form onSubmit={handleSubmit} className="max-w-lg">
              <h2 className="text-xl font-bold text-red-700 mb-2">Мы подготовили для Вас вариант оценки!</h2>
              <p className="text-gray-500 mb-8">Куда удобнее отправить результат?</p>

              <div className="flex gap-4 mb-6">
                {["Звонок", "Telegram", "MAX"].map(method => (
                  <button type="button" key={method} onClick={() => setData({ ...data, contactMethod: method })} className={`flex-1 py-3 rounded-xl border-2 transition font-medium ${data.contactMethod === method ? 'border-red-600 text-red-700 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-red-300'}`}>
                    {method}
                  </button>
                ))}
              </div>

              <p className="font-bold mb-2">Укажите Ваш номер телефона</p>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                className="w-full bg-gray-100 border-2 border-transparent focus:border-red-500 rounded-xl p-4 text-lg outline-none transition mb-6"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                required
              />

              <button type="submit" className="w-full bg-red-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-red-800 transition shadow-lg shadow-red-700/30">
                ПОЛУЧИТЬ ЦЕНУ
              </button>
            </form>
          )}
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          {step > 1 && step < 7 ? (
            <button onClick={() => setStep(step - 1)} className="px-8 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition">
              НАЗАД
            </button>
          ) : <div></div>}

          {step < 6 && (
            <button onClick={nextStep} className="px-10 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition shadow-lg shadow-red-700/30 ml-auto">
              ДАЛЕЕ
            </button>
          )}
          
          {step === 6 && (
             <button onClick={() => setStep(7)} className="px-10 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition shadow-lg shadow-red-700/30 ml-auto">
              УЗНАТЬ ЦЕНУ
            </button>
          )}
        </div>

      </div>
    </div>
  );
}