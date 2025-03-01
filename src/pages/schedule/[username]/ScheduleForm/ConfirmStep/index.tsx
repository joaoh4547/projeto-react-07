import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { ConfirmForm, FormActions, FormHeader } from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'

export function ConfirmStep() {
  function handleConfirmScheduling() {}

  return (
    <ConfirmForm as="form" onSubmit={handleConfirmScheduling}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          01 de fevereiro de 2025
        </Text>
        <Text>
          <Clock />
          17:00h
        </Text>
      </FormHeader>
      <label>
        <Text size="sm">Nome Completo</Text>
        <TextInput placeholder="Seu Nome" />
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput type="email" placeholder="email@example.com" />
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>
      <FormActions>
        <Button variant="tertiary" type="button">
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  )
}
