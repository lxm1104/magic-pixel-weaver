
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-artistic-cream to-artistic-mistyBlue p-4">
      <div className="glass-card rounded-xl p-10 text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto bg-white/50 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-artistic-deepBrown/70" />
        </div>
        <h1 className="text-3xl font-semibold text-artistic-deepBrown">Page Not Found</h1>
        <p className="text-muted-foreground">
          We couldn't find the page you were looking for. The page might have been removed or the URL might be incorrect.
        </p>
        <Link to="/" className="glass-button inline-flex items-center gap-2 rounded-full py-2 px-4">
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
