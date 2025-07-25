import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Step {
  title: string;
  icon: React.ElementType;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  children: React.ReactNode[];
  className?: string;
}

export const Stepper = ({ currentStep, steps, children, className }: StepperProps) => {
  return (
    <div className={cn('w-full py-4 px-2', className)}>
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-center justify-between mb-8">
          {/* Progress line */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200">
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#ed7e0f]"
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
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition-all',
                    isCompleted ? 'border-[#ed7e0f] bg-[#ed7e0f] text-white' : 
                    isCurrent ? 'border-[#ed7e0f] bg-white text-[#ed7e0f]' :
                    'border-gray-200 bg-white text-gray-400'
                  )}
                  initial={false}
                  animate={isCompleted ? { scale: [1.2, 1], opacity: [0, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <Icon className="h-7 w-7" />
                  )}
                </motion.div>
                <motion.div
                  className="absolute -bottom-7 whitespace-nowrap text-sm font-semibold text-gray-700"
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
      <div className="mt-2 p-6 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
        {children[currentStep]}
      </div>
    </div>
  );
};
