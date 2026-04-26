import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import {
  DEFAULT_LOGIN_PAGE_HEADER_TEXT,
  getLoginPageHeaderText,
  LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH,
  removeLoginPageHeaderText,
  setLoginPageHeaderText,
} from '@/auth/utils/login-page-header.util'
import { UserState } from '@/core/models/user.model'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'

const schema = z.object({
  headerText: z
    .string()
    .trim()
    .min(1, 'Header text is required')
    .max(
      LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH,
      `Header text must be ${LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH} characters or less`
    ),
})
type FormValues = z.infer<typeof schema>

function LoginPageSettings(_props: { user: UserState }) {
  const [previewText, setPreviewText] = useState(getLoginPageHeaderText)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { headerText: previewText },
  })

  const watchedHeaderText = watch('headerText')

  useEffect(() => {
    setPreviewText(watchedHeaderText?.trim() || DEFAULT_LOGIN_PAGE_HEADER_TEXT)
  }, [watchedHeaderText])

  const onSubmit = (data: FormValues) => {
    const savedText = setLoginPageHeaderText(data.headerText)
    reset({ headerText: savedText })
    setPreviewText(savedText)
    toast.success('Login page header updated')
  }

  const handleReset = () => {
    removeLoginPageHeaderText()
    reset({ headerText: DEFAULT_LOGIN_PAGE_HEADER_TEXT })
    setPreviewText(DEFAULT_LOGIN_PAGE_HEADER_TEXT)
    toast.success('Login page header reset')
  }

  return (
    <>
      {/* Header */}
      <div className="py-4">
        <h1 className="text-lg font-medium">Login Page</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Change the heading shown at the top of the login page on this browser.
        </p>
      </div>
      <Separator />

      <div className="py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="login-page-header-text"
              className="text-muted-foreground text-sm font-medium"
            >
              Header text
            </label>
            <Input
              id="login-page-header-text"
              placeholder={DEFAULT_LOGIN_PAGE_HEADER_TEXT}
              maxLength={LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH}
              {...register('headerText')}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                {errors.headerText ? (
                  <p className="text-destructive text-xs">
                    {errors.headerText.message}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    This only affects the login page for this browser.
                  </p>
                )}
              </div>
              <p className="text-muted-foreground shrink-0 text-xs">
                {watchedHeaderText?.length ?? 0}/
                {LOGIN_PAGE_HEADER_TEXT_MAX_LENGTH}
              </p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
              Preview
            </p>
            <p className="text-foreground text-3xl font-semibold tracking-tight">
              {previewText}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!isDirty}>
              Save changes
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset to default
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginPageSettings
