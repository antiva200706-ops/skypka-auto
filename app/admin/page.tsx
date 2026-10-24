"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (Array.isArray(data)) setLeads(data);
    } catch (error) {
      console.log("Ошибка загрузки");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "210406") {
      setIsAuth(true);
      loadLeads();
    } else {
      alert("Неверный пароль!");
    }
  };

  useEffect(() => {
    if (!isAuth) return;
    const interval = setInterval(() => loadLeads(), 1000);
    return () => clearInterval(interval);
  }, [isAuth]);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить заявку навсегда?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) setLeads(leads.filter(l => l.id !== id));
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

  const handleTogglePin = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentStatus }),
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, isPinned: !currentStatus } : l));
      }
    } catch (error) {
      alert("Ошибка при закреплении");
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.id - a.id;
  });

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-96 text-black">
          <h1 className="text-2xl font-bold mb-6 text-center">Вход в Админку</h1>
          <input type="password" placeholder="Введите пароль" className="border-2 border-gray-300 w-full p-3 rounded-lg mb-4 focus:border-blue-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Войти</button>
          <Link href="/" className="block text-center mt-4 text-gray-500 hover:text-black">На главную</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-black p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Заявки на выкуп</h1>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">● Онлайн (База данных)</span>
          </div>
          
          <div className="flex gap-4">
            <Link href="/admin/cars" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition">Управление ценами</Link>
            <Link href="/" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 font-medium transition">Выйти на сайт</Link>
          </div>
        </div>

        {sortedLeads.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl shadow text-gray-500">Пока нет заявок...</div>
        ) : (
          <div className="grid gap-4">
            {sortedLeads.map((lead) => (
              <div key={lead.id} className={`p-6 rounded-xl shadow flex justify-between items-start border-l-4 ${lead.isPinned ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold">{lead.brand}</h2>
                    {lead.isPinned && <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded font-bold">ЗАКРЕПЛЕНО</span>}
                  </div>
                  <p className="text-gray-700 font-medium">Год: {lead.year} | Пробег: {lead.mileage}</p>
                  
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{lead.isRunning}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{lead.docs}</span>
                    <span className={`px-2 py-1 rounded text-xs ${lead.isDamaged === 'Битая' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{lead.isDamaged}</span>
                  </div>

                  {/* ВЫВОД ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ */}
                  {lead.extraInfo && (
                    <div className="mt-3 bg-blue-50 text-blue-800 p-2 rounded text-sm border border-blue-100">
                      <span className="font-bold">Детали:</span> {lead.extraInfo}
                    </div>
                  )}

                  <p className="text-sm text-gray-400 mt-3">Дата: {new Date(lead.createdAt).toLocaleString("ru-RU")}</p>
                </div>

                <div className="text-right flex flex-col items-end ml-4">
                  <p className="text-lg font-medium mt-1 mb-3">Тел: {lead.phone}</p>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleTogglePin(lead.id, lead.isPinned)} className={`px-3 py-1 rounded text-sm font-bold transition ${lead.isPinned ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {lead.isPinned ? "Открепить" : "Закрепить"}
                    </button>
                    <button onClick={() => handleDelete(lead.id)} className="px-3 py-1 rounded text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition">
                      Удалить
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}