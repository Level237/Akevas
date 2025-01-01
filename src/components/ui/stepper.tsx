import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ShoppingCart, CreditCard, Truck, Package } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  children: React.ReactNode[];
  className?: string;
}

const steps = [
  {
    title: 'Panier',
    icon: ShoppingCart,
    path: '/panier'
  },
  {
    title: 'Paiement',
    icon: CreditCard,
    path: '/paiement'
  },
  {
    title: 'Expédition',
    icon: Truck,
    path: '/expedition'
  },
  {
    title: 'Confirmation',
    icon: Package,
    path: '/confirmation'
  }
];

export const Stepper = ({ currentStep, children, className }: StepperProps) => {
  return (
    <div className={cn('w-full py-4 px-2', className)}>
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Progress line */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200">
            <motion.div
              className="absolute left-0 top-0 h-full bg-indigo-600"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;

            return (
              <div key={step.title} className="relative z-10 flex flex-col items-center">
                <motion.div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2',
                    isCompleted ? 'border-indigo-600 bg-indigo-600 text-white' : 
                    isCurrent ? 'border-indigo-600 bg-white text-indigo-600' :
                    'border-gray-200 bg-white text-gray-400'
                  )}
                  initial={false}
                  animate={isCompleted ? { scale: [1.4, 1], opacity: [0, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-6 whitespace-nowrap text-sm font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {step.title}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        {children[currentStep]}
      </div>
    </div>
  );
};
