import BottomNav from '@/components/customer/BottomNav';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Desktop Header */}
      <header className="hidden md:flex w-full sticky top-0 bg-surface/80 backdrop-blur-lg shadow-[0_1px_3px_rgba(61,43,31,0.06)] z-40">
        <div className="flex justify-between items-center px-8 py-4 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Solaria's CoffeeShop" className="h-10 w-auto" />
            <span className="font-sans font-bold text-xl text-primary">
              Solaria&apos;s CoffeeShop
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
