"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isLoading: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    isLoading,
}: DeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[400px] rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#111827]">
                        Delete Producer Request
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-[#6B7280]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#111827]">&quot;{title}&quot;</span>? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-[#FF3D00] hover:bg-[#E63700]"
                    >
                        {isLoading ? <Skeleton className="h-4 w-12 rounded-full bg-white/40" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
