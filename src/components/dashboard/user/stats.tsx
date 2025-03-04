import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const Stats = ({ title, icon, value, color, index }: { title: string, icon: React.ReactNode, value: string, color: string, index: number }) => {
    return (
        <div>
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className={`${color} p-3 rounded-full text-white`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">{title}</p>
                            <p className="text-2xl font-semibold">{value}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}

export default React.memo(Stats);