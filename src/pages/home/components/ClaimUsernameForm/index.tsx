import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUserNameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  function handleClaimUser(data: unknown) {
    console.log(data)
  }

  return (
    <>
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
      <FormAnnotation type={errors.username ? 'error' : 'info'}>
        <Text size="sm">
          {errors.username
            ? errors.username?.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
