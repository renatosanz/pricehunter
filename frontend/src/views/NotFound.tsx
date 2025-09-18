import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-2">
          <CardContent className="p-8 md:p-12 text-center">
            {/* 404 Icon */}
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="h-12 w-12 text-primary" />
            </div>

            {/* 404 Heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
              404
            </h1>

            {/* Main Message */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">
              Deal Not Found
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto text-pretty">
              Looks like this page went out of stock! The deal you're looking
              for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                size="lg"
                className="h-12 px-6 bg-transparent"
              >
                <Button variant={"outline"} onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Go Back
                </Button>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
