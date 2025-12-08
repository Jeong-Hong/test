import { Coffee } from "lucide-react";
// import { cn } from "../../lib/utils";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                    <div className="mr-4 flex items-center space-x-2">
                        <Coffee className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Coffee Log System
                        </span>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        {/* Future: Settings or User Profile */}
                    </div>
                </div>
            </header>
            <main className="container max-w-screen-2xl px-4 py-6 md:py-8">
                {children}
            </main>
        </div>
    );
}
