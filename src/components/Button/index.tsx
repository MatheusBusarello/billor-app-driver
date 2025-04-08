import { ComponentProps } from 'react'
import { ButtonSpinner, Button as GluestackButton, Text } from '@gluestack-ui/themed'

type Props = ComponentProps<typeof GluestackButton> & {
  title: string
  variant?: "solid" | "outline"
  isLoading?: boolean
}

export function Button({ title, variant="solid", isLoading = false,...rest }: Props) {
  return (
    <GluestackButton 
      w="$full"
      h="$14"
      bg={variant === "outline" ? "transparent" : "$blue400"}
      borderWidth={variant === "outline" ? "$1" : "$0"}
      borderColor="$blue300"
      rounded="$sm"
      $active-bg={variant === "outline" ? "$gray600" : "$blue300"}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" /> 
      ) : (
        <Text color={variant === "outline" ? "$blue300" : "$white"} fontFamily="$heading" fontSize="$sm">
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}