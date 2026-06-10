
import { Outlet, NavLink } from 'react-router-dom';

const TopAppBar = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-margin-mobile bg-background dark:bg-background border-b-[0.5px] border-outline-variant dark:border-outline md:px-margin-desktop">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">forum</span>
        <span className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-primary-fixed-dim tracking-tight">SpeakUp</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:opacity-80">
          <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border-[0.5px] border-outline-variant bg-surface-container-high">
          <img alt="User profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAQ7tzzeSur25DHLJTdn2S_UYq-8nuNWfclsEA0rkd0Y5VwCYLv6wIUaUR_83pBCmo3CpBRbC3QkLv-aF5ssixwc-bItECZejXkbOTYnVvd9dR8ohbChum29tX3NQ13LZthcYF-cazDNrD690h20PktrmCno3nmrsunfOWR-IMJig6XIPvQWHEJshEvZ2WbNii-ybeKHkKVadXUK5DTkQpYVduJLP7x4I66LYYLs63Yl2pxFqYWfXQw3mQ2PVrEoUZDwetOR6LJz1"/>
        </div>
      </div>
    </header>
  );
};

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-surface dark:bg-surface-container border-t-[0.5px] border-outline-variant dark:border-outline md:hidden">
      <NavLink to="/" className={({ isActive }) => 
        `flex flex-col items-center justify-center rounded-lg px-3 py-1 active:scale-95 transition-all duration-100 ${isActive ? 'text-on-primary-container bg-primary-container' : 'text-on-surface-variant hover:bg-surface-container-highest'}`
      }>
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
        <span className="font-label-md text-[10px] leading-none">Coach</span>
      </NavLink>
      <NavLink to="/insights" className={({ isActive }) => 
        `flex flex-col items-center justify-center rounded-lg px-3 py-1 active:scale-95 transition-all duration-100 ${isActive ? 'text-on-primary-container bg-primary-container' : 'text-on-surface-variant hover:bg-surface-container-highest'}`
      }>
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
        <span className="font-label-md text-[10px] leading-none">Insights</span>
      </NavLink>
      <NavLink to="/library" className={({ isActive }) => 
        `flex flex-col items-center justify-center rounded-lg px-3 py-1 active:scale-95 transition-all duration-100 ${isActive ? 'text-on-primary-container bg-primary-container' : 'text-on-surface-variant hover:bg-surface-container-highest'}`
      }>
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
        <span className="font-label-md text-[10px] leading-none">Library</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => 
        `flex flex-col items-center justify-center rounded-lg px-3 py-1 active:scale-95 transition-all duration-100 ${isActive ? 'text-on-primary-container bg-primary-container' : 'text-on-surface-variant hover:bg-surface-container-highest'}`
      }>
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        <span className="font-label-md text-[10px] leading-none">Profile</span>
      </NavLink>
    </nav>
  );
};

const DesktopNav = () => {
  return (
    <div className="hidden md:flex fixed top-0 right-[200px] h-16 items-center gap-6 z-50">
      <NavLink to="/" className={({ isActive }) => `font-label-md text-label-md h-full px-2 flex items-center border-b-[2px] ${isActive ? 'text-primary font-bold border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}>Coach</NavLink>
      <NavLink to="/insights" className={({ isActive }) => `font-label-md text-label-md h-full px-2 flex items-center border-b-[2px] ${isActive ? 'text-primary font-bold border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}>Insights</NavLink>
      <NavLink to="/library" className={({ isActive }) => `font-label-md text-label-md h-full px-2 flex items-center border-b-[2px] ${isActive ? 'text-primary font-bold border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}>Library</NavLink>
      <NavLink to="/profile" className={({ isActive }) => `font-label-md text-label-md h-full px-2 flex items-center border-b-[2px] ${isActive ? 'text-primary font-bold border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}>Profile</NavLink>
    </div>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col pt-[64px] pb-[100px] md:pb-0">
      <TopAppBar />
      <DesktopNav />
      <main className="flex-1 max-w-[1200px] w-full mx-auto relative">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  );
};
