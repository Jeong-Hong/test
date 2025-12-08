import { useState, useEffect } from "react";
import { useRoastingStore } from "../../store/useRoastingStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Label } from "../ui";
import { Settings } from "lucide-react";

interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const { settings, updateSettings } = useRoastingStore();

    // Local state for inputs
    const [temp, setTemp] = useState(settings.defaultStartTemp.toString());
    const [heat, setHeat] = useState(settings.defaultStartHeat.toString());

    // Update local state when modal opens or store changes
    useEffect(() => {
        if (open) {
            setTemp(settings.defaultStartTemp.toString());
            setHeat(settings.defaultStartHeat.toString());
        }
    }, [open, settings]);

    const handleSave = () => {
        const newTemp = Number(temp);
        const newHeat = Number(heat);

        if (isNaN(newTemp) || isNaN(newHeat)) {
            alert("유효한 숫자를 입력해주세요.");
            return;
        }

        updateSettings({
            defaultStartTemp: newTemp,
            defaultStartHeat: newHeat
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        환경 설정
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="defaultTemp" className="text-right">
                            기본 시작 온도
                        </Label>
                        <Input
                            id="defaultTemp"
                            type="number"
                            value={temp}
                            onChange={(e) => setTemp(e.target.value)}
                            className="col-span-3"
                            placeholder="400"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="defaultHeat" className="text-right">
                            기본 시작 화력
                        </Label>
                        <Input
                            id="defaultHeat"
                            type="number"
                            value={heat}
                            onChange={(e) => setHeat(e.target.value)}
                            className="col-span-3"
                            placeholder="80"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        취소
                    </Button>
                    <Button onClick={handleSave}>
                        저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
