import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Admin access required</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your account is signed in but doesn't have admin privileges. Ask an existing admin
            to grant you the role, or run the seed instruction in the Lovable Cloud database.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/"><Button variant="outline">Back home</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
