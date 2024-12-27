import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "../ui/separator"

export function CartSheet({children}:{children:any}) {
  return (
    <>
     <Sheet>
      <SheetTrigger>
        {children}
      </SheetTrigger>
      <SheetContent >
        <SheetHeader>
          <SheetTitle className="text-3xl">Shopping Cart</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
          <Separator className="w-full"/>
        </SheetHeader>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet></>
   
  )
}
