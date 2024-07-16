import Link from 'next/link';

export default function Header({ user }: { user?: { email: string } }) {
  return (
    <header className="bg-white" data-testid="header">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* LOGO */}
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-extrabold leading-none tracking-tight text-gray-900">Technical test</span>
          </Link>
        </div>

        {/* NAV */}
        <div className="ml-10 flex gap-x-12">
          <Link href="/auctions" className="text-sm font-semibold leading-6 text-gray-900" data-testid="link">
            Auctions
          </Link>

          {user && (
            <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900" data-testid="link">
              Dashboard
            </Link>
          )}
        </div>

        {/* LOG-IN */}
        <div className="flex flex-1 justify-end">
          {user ? (
            <span className="text-sm font-semibold leading-6 text-gray-900">{user.email}</span>
          ) : (
            <>
              <Link
                href="/register"
                className="text-sm font-semibold leading-6 text-gray-400"
                data-testid="register-link"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="ml-2 text-sm font-semibold leading-6 text-gray-900"
                data-testid="login-link"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
