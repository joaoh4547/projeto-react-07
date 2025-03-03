import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import dayjs from 'dayjs'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: "Missing 'date' parameter" })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const referenceDate = dayjs(String(date))

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibilityTimes: [], availabilityTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: { user_id: user.id, week_day: referenceDate.get('day') },
  })

  if (!userAvailability) {
    return res.json({ possibilityTimes: [], availabilityTimes: [] })
  }

  // eslint-disable-next-line camelcase
  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  // eslint-disable-next-line camelcase
  const startHour = time_start_in_minutes / 60

  // eslint-disable-next-line camelcase
  const endHour = time_end_in_minutes / 60

  const possibilityTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availabilityTimes = possibilityTimes.filter((t) => {
    const isTimeBlocked = blockedTimes.some((b) => b.date.getHours() === t)

    const isTimeInPast = referenceDate.set('hour', t).isBefore(new Date())
    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ availabilityTimes, possibilityTimes })
}
