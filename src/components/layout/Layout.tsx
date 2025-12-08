// import { cn } from "../../lib/utils";
import { useRoastingStore } from "../../store/useRoastingStore";
import { Button } from "../ui";
import { LayoutDashboard, History, Coffee } from "lucide-react";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { view, setView } = useRoastingStore();

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
                        <Button
                            variant={view === 'dashboard' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setView('dashboard')}
                        >
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                        </Button>
                        <Button
                            variant={view === 'history' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setView('history')}
                        >
                            <History className="h-4 w-4 mr-2" />
                            History
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container max-w-screen-2xl px-4 py-6 md:py-8">
                {children}
            </main>
        </div>
    );
}
