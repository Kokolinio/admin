import { Currency } from "@medusajs/medusa"
import { useAdminUpdateCurrency } from "medusa-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import CoinsIcon from "../../../../components/fundamentals/icons/coins-icon"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type CurrencyTaxSettingFormType = {
  includes_tax: boolean
}

type Props = {
  currency: Currency
  isDefault: boolean
}

const CurrencyTaxSetting = ({ currency, isDefault }: Props) => {
  const { mutate } = useAdminUpdateCurrency(currency.code)
  const { handleSubmit, control, reset } = useForm<CurrencyTaxSettingFormType>({
    defaultValues: {
      includes_tax: currency.includes_tax,
    },
  })

  const notification = useNotification()

  useEffect(() => {
    reset({
      includes_tax: currency.includes_tax,
    })
  }, [currency])

  const onSubmit = handleSubmit((data: CurrencyTaxSettingFormType) => {
    mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully updated currency", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  })

  return (
    <form>
      <div className="flex items-center justify-between inter-base-regular">
        <div className="flex items-center gap-x-base">
          <div className="flex items-center justify-center bg-grey-10 rounded-rounded w-xlarge h-xlarge">
            <CoinsIcon size={20} className="text-grey-50" />
          </div>
          <div className="flex items-center gap-x-xsmall">
            <p className="inter-base-semibold text-grey-90">
              {currency.code.toUpperCase()}
            </p>
            <p className="text-grey-50 inter-small-regular">{currency.name}</p>
          </div>
          {isDefault && (
            <div className="bg-grey-10 rounded-rounded py-[2px] px-xsmall">
              <p className="inter-small-semibold text-grey-50">Default</p>
            </div>
          )}
        </div>
        <Controller
          control={control}
          name="includes_tax"
          render={({ field: { value, onChange } }) => {
            return (
              <Switch
                checked={value}
                onCheckedChange={(data) => {
                  onChange(data)
                  onSubmit()
                }}
              />
            )
          }}
        />
      </div>
    </form>
  )
}

export default CurrencyTaxSetting
