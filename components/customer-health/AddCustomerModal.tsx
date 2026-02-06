'use client';

import { useState, FormEvent } from 'react';
import { clsx } from 'clsx';

interface AddCustomerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomerModal({ onClose, onSuccess }: AddCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    mrr: '',
    ownerName: '',
    ownerEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain';
    }

    if (!formData.mrr.trim()) {
      newErrors.mrr = 'MRR is required';
    } else if (isNaN(Number(formData.mrr)) || Number(formData.mrr) <= 0) {
      newErrors.mrr = 'MRR must be a positive number';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call the API
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      alert(`Customer "${formData.name}" added successfully!`);
      onSuccess();
    } catch (error) {
      console.error('Failed to add customer:', error);
      alert('Failed to add customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white border-2 border-black shadow-brutal-lg w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b-2 border-black bg-black">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Add New Customer
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
              Company Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={clsx(
                'input',
                errors.name && 'border-health-at-risk focus:ring-health-at-risk/20'
              )}
              placeholder="Acme Corporation"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-bold text-health-at-risk">{errors.name}</p>
            )}
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block text-sm font-bold text-black mb-1">
              Domain *
            </label>
            <input
              id="domain"
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className={clsx(
                'input',
                errors.domain && 'border-health-at-risk focus:ring-health-at-risk/20'
              )}
              placeholder="acme.com"
            />
            {errors.domain && (
              <p className="mt-1 text-xs font-bold text-health-at-risk">{errors.domain}</p>
            )}
          </div>

          {/* MRR */}
          <div>
            <label htmlFor="mrr" className="block text-sm font-bold text-black mb-1">
              Monthly Recurring Revenue (MRR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-black">
                $
              </span>
              <input
                id="mrr"
                type="number"
                value={formData.mrr}
                onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                className={clsx(
                  'input pl-8',
                  errors.mrr && 'border-health-at-risk focus:ring-health-at-risk/20'
                )}
                placeholder="5000"
                min="0"
                step="0.01"
              />
            </div>
            {errors.mrr && (
              <p className="mt-1 text-xs font-bold text-health-at-risk">{errors.mrr}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label htmlFor="ownerName" className="block text-sm font-bold text-black mb-1">
              Account Owner Name *
            </label>
            <input
              id="ownerName"
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className={clsx(
                'input',
                errors.ownerName && 'border-health-at-risk focus:ring-health-at-risk/20'
              )}
              placeholder="John Doe"
            />
            {errors.ownerName && (
              <p className="mt-1 text-xs font-bold text-health-at-risk">{errors.ownerName}</p>
            )}
          </div>

          {/* Owner Email */}
          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-bold text-black mb-1">
              Account Owner Email *
            </label>
            <input
              id="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              className={clsx(
                'input',
                errors.ownerEmail && 'border-health-at-risk focus:ring-health-at-risk/20'
              )}
              placeholder="john.doe@flowdesk.com"
            />
            {errors.ownerEmail && (
              <p className="mt-1 text-xs font-bold text-health-at-risk">{errors.ownerEmail}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
