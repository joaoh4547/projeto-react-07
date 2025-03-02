import { useEffect, useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import dayjs from 'dayjs'
import { api } from '../../../../../lib/axios'
import { useRouter } from 'next/router'

interface Availability {
  possibilityTimes: number[]
  availabilityTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [availability, setAvailability] = useState<Availability | null>(null)

  const { query } = useRouter()

  const username = String(query.username)

  const hasDaySelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const dateOfMonth = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    api
      .get<Availability>(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })
      .then((response) => {
        setAvailability(response.data)
      })
  }, [selectedDate, username])
  return (
    <Container isTimePickerOpen={hasDaySelected}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      {hasDaySelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{dateOfMonth}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibilityTimes.map((time) => {
              return (
                <TimePickerItem
                  key={time}
                  disabled={!availability.availabilityTimes.includes(time)}
                >
                  {String(time).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
