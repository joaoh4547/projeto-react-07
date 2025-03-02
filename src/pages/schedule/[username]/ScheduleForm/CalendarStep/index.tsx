import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../../../lib/axios'

interface Availability {
  possibilityTimes: number[]
  availabilityTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { query } = useRouter()

  const username = String(query.username)

  const hasDaySelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const dateOfMonth = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery({
    queryFn: async () => {
      const response = await api.get<Availability>(
        `/users/${username}/availability`,
        {
          params: {
            date: selectedDateWithoutTime,
          },
        },
      )

      return response.data
    },
    queryKey: ['availability', username, selectedDateWithoutTime],
    enabled: !!selectedDate,
  })

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
