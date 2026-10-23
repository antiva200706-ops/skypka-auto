"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isRunning, setIsRunning] = useState("yes");
  const [docs, setDocs] = useState("full");
  const [isDamaged, setIsDamaged] = useState("no");
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Состояния для базы машин
  const [carsDb, setCarsDb] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // Загружаем машины из базы при старте
  useEffect(() => {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCarsDb(data);
      });
  }, []);

  const suggestions = carsDb.filter(car => 
    `${car.brand} ${car.model}`.toLowerCase().includes(brand.toLowerCase()) && brand.length > 0
  );

  const handleSelectCar = (car: any) => {
    setBrand(`${car.brand} ${car.model}`);
    setSelectedCar(car);
    setShowSuggestions(false);
  };

  const handleEvaluate = () => {
    if (!year || !mileage) return alert("Введите год и пробег");

    // Ищем машину в базе
    let basePrice = 800000; // По умолчанию
    let foundCar = selectedCar;

    if (!foundCar) {
      const searchLower = brand.toLowerCase();
      foundCar = carsDb.find((c: any) => 
        `${c.brand} ${c.model}`.toLowerCase().includes(searchLower)
      ) || null;
    }

    if (foundCar) basePrice = foundCar.marketPrice;

    let realMileage = Number(mileage);
    if (realMileage > 0 && realMileage < 1000) realMileage = realMileage * 1000;

    const age = 2026 - Number(year);
    const safeAge = age < 0 ? 0 : age;

    let ageDiscount = Math.min(safeAge * 0.05, 0.6);
    let mileageDiscount = Math.min((realMileage / 100000) * 0.05, 0.25);

    let currentPrice = basePrice * (1 - ageDiscount - mileageDiscount);

    if (isRunning === "no") currentPrice *= 0.75;
    if (docs === "no_pts") currentPrice *= 0.85;
    if (docs === "no_sts") currentPrice *= 0.95;
    if (isDamaged === "yes") currentPrice *= 0.8;

    if (currentPrice < 30000) currentPrice = 30000;

    const min = Math.round((currentPrice * 0.9) / 1000) * 1000;
    const max = Math.round((currentPrice * 1.1) / 1000) * 1000;

    setPriceRange({ min, max });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceRange) return alert("Сначала нажмите 'Оценить'");
    
    const newLead = {
      brand, year, mileage, phone,
      isRunning: isRunning === "yes" ? "На ходу" : "Не на ходу",
      docs: docs === "full" ? "Полный пакет" : docs === "no_pts" ? "Нет ПТС" : "Нет СТС",
      isDamaged: isDamaged === "yes" ? "Битая" : "Не битая",
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setBrand(""); setYear(""); setMileage(""); setPhone(""); setPriceRange(null); setSelectedCar(null);
        }, 4000);
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center px-8">
        <div className="text-2xl font-bold text-blue-500">Скупка Авто 24/7</div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-400">Главная</Link>
          <Link href="/admin" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">Админка</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-4 text-center">Продай своё авто выгодно!</h1>
        
        <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Оценить автомобиль</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Марка и модель" 
                className="border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 w-full" 
                value={brand} 
                onChange={(e) => {
                  setBrand(e.target.value);
                  setShowSuggestions(true);
                  setSelectedCar(null);
                }} 
                onFocus={() => setShowSuggestions(true)}
                required 
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((car) => (
                    <li 
                      key={car.id} 
                      onClick={() => handleSelectCar(car)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                    >
                      <div className="font-bold">{car.brand} {car.model}</div>
                      <div className="text-xs text-gray-500">Годы: {car.years} | Рынок: ~{car.marketPrice.toLocaleString()} ₽</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 relative">
                <input type="number" placeholder="Год выпуска" className="border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 w-full" value={year} onChange={(e) => setYear(e.target.value)} required />
                {selectedCar && <p className="text-xs text-blue-600 mt-1 absolute">Выпуск: {selectedCar.years}</p>}
              </div>
              <input type="number" placeholder="Пробег (км)" className="border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 w-1/2" value={mileage} onChange={(e) => setMileage(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <div>
                <label className="block text-sm font-bold mb-1">На ходу?</label>
                <select className="w-full p-2 border rounded" value={isRunning} onChange={(e) => setIsRunning(e.target.value)}>
                  <option value="yes">Да</option>
                  <option value="no">Нет</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Документы</label>
                <select className="w-full p-2 border rounded" value={docs} onChange={(e) => setDocs(e.target.value)}>
                  <option value="full">Полный пакет</option>
                  <option value="no_pts">Нет ПТС</option>
                  <option value="no_sts">Нет СТС</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-1">Битая?</label>
                <select className="w-full p-2 border rounded" value={isDamaged} onChange={(e) => setIsDamaged(e.target.value)}>
                  <option value="no">Нет</option>
                  <option value="yes">Да</option>
                </select>
              </div>
            </div>

            <button type="button" onClick={handleEvaluate} className="bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition mt-2">
              Узнать цену
            </button>

            {priceRange && (
              <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg text-center font-bold text-lg">
                Примерная цена: от {priceRange.min.toLocaleString()} ₽ до {priceRange.max.toLocaleString()} ₽
              </div>
            )}

            {priceRange && (
              <div className="mt-2 border-t pt-4 flex flex-col gap-3">
                <input type="tel" placeholder="Ваш телефон" className="border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                  Оставить заявку
                </button>
              </div>
            )}
            
            {isSubmitted && <div className="text-center text-green-600 font-bold mt-2">Заявка отправлена!</div>}
          </form>
        </div>
      </main>

      <footer className="bg-slate-950 py-8 text-center text-gray-400 mt-10">
        <p className="text-lg mb-2">Нужна помощь?</p>
        <a href="tel:+70000000000" className="text-2xl font-bold text-white hover:text-blue-400 transition">+7 (000) 000-00-00</a>
        <p className="mt-4 text-sm">© 2026 Скупка Авто. Все права защищены. (Лицензия отсутствует)</p>
      </footer>
    </div>
  );
}