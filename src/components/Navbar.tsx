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
          <span className="inline-block font-serif font-bold text-2xl md:text-3xl text-fashion-charcoal tracking-tight">
            Fashion<span className="text-fashion-blush">Finder</span>
          </span>
        </Link>
          
        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
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
