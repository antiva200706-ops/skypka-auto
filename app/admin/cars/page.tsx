"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [years, setYears] = useState("");
  const [price, setPrice] = useState("");

  const loadCars = async () => {
    try {
      const res = await fetch("/api/cars");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error("Ошибка от сервера:", data);
        setCars([]); // Если пришла не таблица, ставим пустой массив
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !years || !price) return alert("Заполните все поля");

    try {
      await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, years, marketPrice: price }),
      });

      setBrand(""); setModel(""); setYears(""); setPrice("");
      loadCars();
    } catch (error) {
      alert("Ошибка при добавлении");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить машину из базы?")) return;
    try {
      await fetch(`/api/cars/${id}`, { method: "DELETE" });
      loadCars();
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Управление ценами на авто</h1>
          <Link href="/admin" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">Назад в заявки</Link>
        </div>

        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-4 gap-4">
          <input placeholder="Марка (Kia)" className="border p-2 rounded" value={brand} onChange={e => setBrand(e.target.value)} required />
          <input placeholder="Модель (Rio)" className="border p-2 rounded" value={model} onChange={e => setModel(e.target.value)} required />
          <input placeholder="Годы (2005-2026)" className="border p-2 rounded" value={years} onChange={e => setYears(e.target.value)} required />
          <input type="number" placeholder="Цена (руб)" className="border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} required />
          <button type="submit" className="col-span-4 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Добавить машину</button>
        </form>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {cars.length === 0 ? (
            <div className="p-8 text-center text-gray-500">В базе пока нет машин. Добавьте первую!</div>
          ) : (
            cars.map(car => (
              <div key={car.id} className="flex justify-between items-center p-4 border-b last:border-0">
                <div>
                  <span className="font-bold text-lg">{car.brand} {car.model}</span>
                  <span className="text-gray-500 text-sm ml-4">({car.years})</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-green-600">{car.marketPrice.toLocaleString()} ₽</span>
                  <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-700 font-bold">Удалить</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}