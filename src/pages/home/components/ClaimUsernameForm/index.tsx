import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from 'phosphor-react'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput size="sm" prefix="call.io/" placeholder="Seu Usuario" />
      <Button size="sm" type="submit">
        Reservar <ArrowRight />
      </Button>
    </Form>
  )
}
