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

interface DeleteCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    campaignTitle: string;
    onConfirm: (id: string) => void;
    isDeleting: boolean;
}

export default function DeleteCampaignModal({
    isOpen,
    onClose,
    campaignId,
    campaignTitle,
    onConfirm,
    isDeleting,
}: DeleteCampaignModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[400px] rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#111827]">Delete Campaign</DialogTitle>
                    <DialogDescription className="pt-2 text-[#6B7280]">
                        Are you sure you want to delete <span className="font-semibold text-[#111827]">"{campaignTitle}"</span>? This action cannot be undone.
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
                        disabled={isDeleting}
                        onClick={() => onConfirm(campaignId)}
                        className="flex-1 rounded-xl bg-[#FF3D00] hover:bg-[#E63700]"
                    >
                        {isDeleting ? (
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
