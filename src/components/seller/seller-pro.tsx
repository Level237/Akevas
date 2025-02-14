import React from 'react'
import { Card } from '../ui/card'
import { Check } from 'lucide-react'
import AsyncLink from '../ui/AsyncLink'
import { Button } from '../ui/button'

export default function SellerPro() {
  return (
    <div>
        {/* Section Vendeur Pro */}
              <Card className="p-6 bg-gradient-to-br from-[#ed7e0f]/10 to-orange-50 border-2 border-[#ed7e0f]/20">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Devenez Vendeur Pro 🌟</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Visibilité accrue sur la marketplace</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Support client prioritaire</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Outils marketing avancés</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Commission réduite sur les ventes</span>
                    </li>
                  </ul>
                  <AsyncLink to='/seller/pro' className="block mt-6">
                    <Button className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold py-3">
                      Devenir Vendeur Pro
                    </Button>
                  </AsyncLink>
                </div>
              </Card>
    </div>
  )
}
