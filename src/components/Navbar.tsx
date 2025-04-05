import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="inline-block font-serif font-extrabold text-2xl md:text-3xl text-[#5A5A5A] tracking-tight">
            Fashion <span className="text-pink-500">Finder</span>

          </span>
        </Link>
          
        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-flex font-semibold text-base"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="font-semibold text-base"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="font-semibold text-base"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex font-semibold text-base"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
