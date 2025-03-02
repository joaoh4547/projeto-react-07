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

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const hasDaySelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const dateOfMonth = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null
  return (
    <Container isTimePickerOpen={hasDaySelected}>
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      {hasDaySelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{dateOfMonth}</span>
          </TimePickerHeader>
          <TimePickerList>
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem disabled>09:00h</TimePickerItem>
            <TimePickerItem>10:00h</TimePickerItem>
            <TimePickerItem>11:00h</TimePickerItem>
            <TimePickerItem>12:00h</TimePickerItem>
            <TimePickerItem>13:00h</TimePickerItem>
            <TimePickerItem>14:00h</TimePickerItem>
            <TimePickerItem>15:00h</TimePickerItem>
            <TimePickerItem>16:00h</TimePickerItem>
            <TimePickerItem>17:00h</TimePickerItem>
            <TimePickerItem>18:00h</TimePickerItem>
            <TimePickerItem>19:00h</TimePickerItem>
            <TimePickerItem>20:00h</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
