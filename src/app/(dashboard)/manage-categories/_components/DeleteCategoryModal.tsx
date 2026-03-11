"use client";

import { LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
    isLoading: boolean;
}

export default function DeleteCategoryModal({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
    isLoading,
}: DeleteCategoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[400px] rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#111827]">
                        Delete Category
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-[#6B7280]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[#111827]">"{categoryName}"</span>?
                        This action cannot be undone.
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
                        {isLoading ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
