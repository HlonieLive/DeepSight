
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, Server, Database, Wifi, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="modal-overlay"
            >
                <div className="modal-backdrop-click" onClick={onClose}></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="modal-container"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    {/* Header */}
                    <div className="modal-header">
                        <h2 className="modal-title">
                            {title === 'Performance' && <Activity className="text-emerald-400" size={24} />}
                            {title === 'Storage' && <Database className="text-blue-400" size={24} />}
                            {title === 'Network' && <Wifi className="text-amber-400" size={24} />}
                            {(title === 'Health' || title === 'System Health') && <Activity className="text-red-400" size={24} />}
                            <span>{title} Insights</span>
                        </h2>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body custom-scrollbar">
                        {children}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
