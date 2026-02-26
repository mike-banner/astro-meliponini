// src/components/ProductTabs.tsx
import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'iconify-icon': any;
        }
    }
}

interface ProductTabsProps {
    description: string;
    shortDescription?: string;
    images?: string[];
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ description, shortDescription, images = [] }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [beeImages, setBeeImages] = useState<number[]>([]);

    React.useEffect(() => {
        // Génération unique côté client pour éviter le mismatch d'hydratation
        const indices = Array.from({ length: 5 }, () => Math.floor(Math.random() * 14) + 1);
        setBeeImages(indices);
    }, []);

    return (
        <div className="w-full px-6 md:px-20 lg:px-[6.25rem] py-12 relative z-0">
            <div className="border-b border-gray-100 mb-12">
                <div className="flex gap-12">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`pb-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'general' ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                            }`}
                    >
                        Général
                        {activeTab === 'general' && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-black" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`pb-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'comments' ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                            }`}
                    >
                        Commentaires
                        {activeTab === 'comments' && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-black" />
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {activeTab === 'general' ? (
                    <>
                        {/* Accordions */}
                        <div className="lg:col-span-7">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                <AccordionItem value="description" className="border-b border-gray-100">
                                    <AccordionTrigger className="text-[12px] font-black uppercase tracking-widest py-6 hover:no-underline">
                                        Description
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm leading-relaxed text-gray-600 prose-p:mb-4">
                                        <div dangerouslySetInnerHTML={{ __html: description }} />
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="fiche" className="border-b border-gray-100">
                                    <AccordionTrigger className="text-[12px] font-black uppercase tracking-widest py-6 hover:no-underline">
                                        Fiche technique
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-2 gap-4 text-[11px] uppercase tracking-wider">
                                            <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-2">
                                                <span className="text-gray-400 font-bold">Origine</span>
                                                <span className="font-black">Amazonie, Brésil</span>
                                            </div>
                                            <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-2">
                                                <span className="text-gray-400 font-bold">Type</span>
                                                <span className="font-black">Trigoniforme</span>
                                            </div>
                                            <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-2">
                                                <span className="text-gray-400 font-bold">Récolte</span>
                                                <span className="font-black">Artisanale</span>
                                            </div>
                                            <div className="flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-2">
                                                <span className="text-gray-400 font-bold">Période</span>
                                                <span className="font-black">Annuelle</span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Gallery Wrapper */}
                        <div className="lg:col-span-5 flex items-center justify-center">
                            <div className="gallery-v1 rounded-2xl overflow-hidden shadow-sm bg-[#F9F9F9] p-4 w-full">
                                {beeImages.map((idx, i) => (
                                    <img
                                        key={i}
                                        src={`/images/collections/bee-${idx}.webp`}
                                        alt="Abeille"
                                        className="w-full h-full object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-12 py-10 text-center">
                        <div className="mb-4 text-zinc-300">
                            <iconify-icon icon="ph:chats-circle-light" style={{ fontSize: '48px' }}></iconify-icon>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Aucun commentaire pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
