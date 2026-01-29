import { Link } from "wouter";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="w-24 h-24 mx-auto opacity-20 bg-solar-glow/20 rounded-2xl overflow-hidden flex items-center justify-center">
          <img src="/logo.jpg" alt="Gen Innovators Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The path you are looking for does not exist in our ecosystem.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4 rounded-xl">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
