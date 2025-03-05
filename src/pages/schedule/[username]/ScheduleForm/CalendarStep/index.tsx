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
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
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
            timezoneOffset: selectedDate ? selectedDate.getTimezoneOffset() : 0,
          },
        },
      )

      return response.data
    },
    queryKey: ['availability', username, selectedDateWithoutTime],
    enabled: !!selectedDate,
  })

  function handleSelectTime(hour: number) {
    const dateTime = dayjs(selectedDate).hour(hour).startOf('hour')
    onSelectDateTime(dateTime.toDate())
  }

  return (
    <Container isTimePickerOpen={hasDaySelected}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      {hasDaySelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{dateOfMonth}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((time) => {
              return (
                <TimePickerItem
                  key={time}
                  disabled={!availability.availableTimes.includes(time)}
                  onClick={() => handleSelectTime(time)}
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
