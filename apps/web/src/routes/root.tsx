import { Link, Outlet } from '@tanstack/react-router';

export function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Cockpit</Link>
      </nav>
      <Outlet />
    </>
  );
}
