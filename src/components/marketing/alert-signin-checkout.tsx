import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePathname } from "next/navigation"
import SigninForm from "../auth/signin-form"

export function AlertDialogSigninCheckout({
  open,
  setOpen,
  callback,
  onCancel,
}: any) {
  const pathname = usePathname()
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Sign in to your account</AlertDialogTitle>
          <AlertDialogDescription>
            Creating an account will allow you to track most orders, save
            payment methods and shipping addresses, and gain access to special
            user discounts.
            {pathname === "/checkout" && (
              // <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8">
                <SigninForm />
                {/* <div className="h-32 rounded-lg bg-gray-200"></div>
              <div className="h-32 rounded-lg bg-gray-200"></div> */}
              </div>
            )}
            Orders completed with guest checkout do not earn reward points.
            Create an account to start earning rewards!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-between sm:justify-between">
          <AlertDialogCancel onClick={() => onCancel()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => callback()}>
            I understand, Continue as Guest
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
