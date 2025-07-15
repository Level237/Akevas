import AsyncLink from '@/components/ui/AsyncLink'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {motion} from "framer-motion"

export default function TitleOverview({title,content,link,number,cta}:{title:string,content:string,link:string,number:number,cta:string}) {
  return (
    <div>
                  <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Card className="p-6 bg-[#ed7e0f]/5 border-[#ed7e0f]/20">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 max-sm:h-6 max-sm:w-6 max-sm:p-5 rounded-full bg-[#ed7e0f] flex items-center justify-center">
                    <span className="text-white font-bold">{number}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold max-sm:text-base text-gray-900">{title}</h2>
                    <p className="text-gray-600 max-sm:text-sm mt-1">
                     {content}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <AsyncLink to={link}>
                  <Button
                    className="bg-[#ed7e0f] max-sm:text-sm hover:bg-[#ed7e0f]/90 text-white font-semibold"
                   
                  >
                   {cta}
                  </Button>
                </AsyncLink>
                </div>
              </Card>
            </motion.div>
    </div>
  )
}
