import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { FolderOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { pickBackupDirectory, getBackupDirectoryHandle } from '../../lib/backup-service';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const [connected, setConnected] = useState(false);
    const [folderName, setFolderName] = useState<string | null>(null);

    const checkStatus = async () => {
        const handle = await getBackupDirectoryHandle();
        if (handle) {
            setConnected(true);
            setFolderName(handle.name);
        } else {
            setConnected(false);
            setFolderName(null);
        }
    };

    useEffect(() => {
        if (open) {
            checkStatus();
        }
    }, [open]);

    const handleConnect = async () => {
        const success = await pickBackupDirectory();
        if (success) {
            await checkStatus();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Backup Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <FolderOpen className="h-4 w-4" />
                                Local Backup
                            </CardTitle>
                            {/* <CardDescription> removed as it doesn't exist */}
                            <p className="text-sm text-muted-foreground">
                                Automatically save roasting logs to a folder on your computer.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {connected ? (
                                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <AlertCircle className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {connected ? folderName : "Not Connected"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {connected ? "Ready to auto-save" : "Select a folder to enable"}
                                        </span>
                                    </div>
                                </div>
                                <Button size="sm" variant={connected ? "outline" : "default"} onClick={handleConnect}>
                                    {connected ? "Change" : "Connect"}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Note: Browser may request permission confirmation when saving files after restart.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
