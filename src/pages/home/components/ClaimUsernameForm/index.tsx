import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const claimUserNameFormSchema = z.object({
  username: z.string(),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUserNameFormSchema>

export function ClaimUsernameForm() {
  const { register, handleSubmit } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  function handleClaimUser(data: unknown) {
    console.log(data)
  }

  return (
    <Form as="form" onSubmit={handleSubmit(handleClaimUser)}>
      <TextInput
        size="sm"
        prefix="call.io/"
        placeholder="Seu Usuario"
        {...register('username')}
      />
      <Button size="sm" type="submit">
        Reservar <ArrowRight />
      </Button>
    </Form>
  )
}
