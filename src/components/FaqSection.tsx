import React from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

// On définit la structure d'une question
interface FaqItem {
    question: string
    answer: string
}

// On définit les propriétés que le composant peut recevoir
interface FaqProps {
    title?: string
    items: FaqItem[]
}

export function FaqSection({ title = "Questions Fréquentes", items }: FaqProps) {
    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-24">
            <h2 className="text-xl font-medium uppercase tracking-[0.5em] mb-16 text-center">
                {title}
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-6">
                {items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-black/10">
                        <AccordionTrigger className="text-sm font-black uppercase tracking-[0.2em] text-left py-8 hover:no-underline hover:opacity-70 transition-opacity">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-gray-600 pb-8 pr-12">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
