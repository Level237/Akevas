import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export default function TooltipChildren({children,title}:{children:React.ReactNode,title:string}) {
  return (
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>{children}</TooltipTrigger>
    <TooltipContent className="bg-gray-200 text-gray-800">
      {title}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
  )
}
