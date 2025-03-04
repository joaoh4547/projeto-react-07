import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '../../lib/axios'
import { isAxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
})

type RegisterUserSchema = z.infer<typeof registerUserSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', router.query?.username as string)
    }
  }, [router.query?.username, setValue])

  async function handleRegisterUser(data: RegisterUserSchema) {
    try {
      await api.post('users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (isAxiosError(error)) {
        if (error?.response?.data?.message) {
          alert(error.response.data.message)
          return
        }
      }
      console.error(error)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegisterUser)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="call.io/"
              placeholder="Seu Usuario"
              {...register('username')}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu Nome" {...register('name')} />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Proximo passo <ArrowRight weight="bold" />
          </Button>
        </Form>
      </Container>
    </>
  )
}
