"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { categorySchema, CategoryFormValues } from "../schema";

interface CategoryFormProps {
    defaultValues?: Partial<CategoryFormValues>;
    onSubmit: (values: CategoryFormValues) => void;
    isLoading: boolean;
    submitLabel: string;
}

export default function CategoryForm({
    defaultValues,
    onSubmit,
    isLoading,
    submitLabel,
}: CategoryFormProps) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: defaultValues?.name ?? "",
            description: defaultValues?.description ?? "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#111827]">
                                Category Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Type category name here..."
                                    className="h-11 rounded-[8px] border-[#E5E7EB] focus-visible:ring-[#8C5CFF] bg-white"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#111827]">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type category description here..."
                                    rows={5}
                                    className="rounded-[8px] border-[#E5E7EB] focus-visible:ring-[#8C5CFF] bg-white resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-[#8C5CFF] hover:bg-[#7A4AEF] text-white font-semibold px-6 gap-2"
                >
                    {isLoading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>
        </Form>
    );
}
