import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function ConnectCalendar() {
  const session = useSession()

  const router = useRouter()

  const hasAuthError = !!router.query.error

  const hasSignedIn = session.status === 'authenticated'

  async function handleSignIn() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Agenda</Text>
            {hasSignedIn && (
              <Button size="sm" disabled>
                Conectado <Check weight="bold" />
              </Button>
            )}
            {!hasSignedIn && (
              <Button variant="secondary" size="sm" onClick={handleSignIn}>
                Conectar <ArrowRight weight="bold" />
              </Button>
            )}
          </ConnectItem>
          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar com o google, verifique se você habilitou as
              permissões de acesso ao Google Calendar.
            </AuthError>
          )}
          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!hasSignedIn}
          >
            Proximo passo <ArrowRight weight="bold" />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
