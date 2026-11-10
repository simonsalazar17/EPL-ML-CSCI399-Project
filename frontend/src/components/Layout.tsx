import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const links = [
  { to: '/', label: 'Overview' },
  { to: '/predict', label: 'Predictor' },
  { to: '/performance', label: 'Model Performance' },
  { to: '/methodology', label: 'Methodology' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/">Premier League <span>Market Value Predictor</span></NavLink>
        <nav aria-label="Main navigation">
          {links.map(({ to, label }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        </nav>
      </div>
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer><span>CSCI 399 · Premier League Market Value Predictor</span><span>Experimental regression model · Values in EUR</span></footer>
  </div>;
}
