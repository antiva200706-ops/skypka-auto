export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <h1 className="text-2xl md:text-4xl font-bold text-black mb-4 uppercase">
        Сайт не был оплачен, сайт отключён
      </h1>
      <p className="text-lg md:text-xl text-gray-600">
        Создатель: <a href="https://t.me/eba_msk" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">@eba_msk</a> TG
      </p>
    </div>
  );
}