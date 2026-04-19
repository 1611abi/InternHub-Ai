import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeSection = ({ title, icon, children, defaultOpen = true, onAdd, addLabel }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="surface mb-4 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        {icon}
                    </div>
                    <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-6 pb-5 pt-2 border-t border-surface-100">
                            {children}

                            {onAdd && (
                                <button
                                    onClick={onAdd}
                                    className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                >
                                    + {addLabel || 'Add Entry'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeSection;
