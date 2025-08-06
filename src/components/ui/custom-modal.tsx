"use client"

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface CustomModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showCloseButton?: boolean
    closeOnOverlayClick?: boolean
    footer?: React.ReactNode
}

export function CustomModal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = 'lg',
    showCloseButton = true,
    closeOnOverlayClick = true,
    footer
}: CustomModalProps) {

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md w-full',
        md: 'max-w-2xl w-full',
        lg: 'max-w-4xl w-full',
        xl: 'max-w-6xl w-full',
        full: 'w-[98vw] max-w-none'
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleOverlayClick}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} max-h-[96vh] flex flex-col m-4`}>
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 rounded-t-2xl">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg text-gray-600">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {showCloseButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 ml-4"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-gray-200 p-8 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// Hook para manejar el estado del modal
export function useModal() {
    const [isOpen, setIsOpen] = React.useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const toggleModal = () => setIsOpen(!isOpen)

    return {
        isOpen,
        openModal,
        closeModal,
        toggleModal
    }
}
