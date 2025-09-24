import { Factory, Luggage } from 'lucide-react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

interface RoleAndIndustryProps {
  industries: readonly string[]
}

function RoleAndIndustry({ industries }: RoleAndIndustryProps) {
  return (
    <>
      {/** Role Section */}
      <FormField
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              <Luggage className="size-5" /> What&apos;s your professional role?
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Founder, Manager, Software Engineer..."
                {...field}
                className="bg-white text-xs sm:text-base"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/** Industry Section */}
      <FormField
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mt-8 text-base font-semibold">
              <Factory className="size-5" /> What&apos;s your industry?
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string | undefined}
              value={field.value as string | undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full bg-white text-xs sm:text-base">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default RoleAndIndustry
