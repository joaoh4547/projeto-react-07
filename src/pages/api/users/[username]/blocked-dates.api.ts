import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res
      .status(400)
      .json({ message: "Missing 'date' or 'month' parameter" })
  }

  const monthFormated = month.toString().padStart(2, '0')

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    where: { user_id: user.id },
    select: { week_day: true },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (day) => !availableWeekDays.some((a) => a.week_day === day),
  )

  const blockedDatesRaw = await prisma.$queryRaw<Array<{ date: number }>>`
    SELECT 
      EXTRACT(DAY FROM s.date) AS date,
      COUNT(s.date) AS amount,
      ((t.time_end_in_minutes  - t.time_start_in_minutes) / 60) as size
    FROM schedulings s
    LEFT JOIN user_time_intervals t on 
      t.week_day = WEEKDAY(DATE_ADD(s.date, INTERVAL 1 day))
    WHERE 
      s.user_id = ${user.id} AND
      DATE_FORMAT(s.date, '%Y-%m') = ${`${year}-${monthFormated}`}
    GROUP BY 
      EXTRACT(DAY FROM s.date),
      ((t.time_end_in_minutes  - t.time_start_in_minutes) / 60)
    HAVING amount >= size or size = 0
  `

  const blockedDates = blockedDatesRaw.map((i) => i.date)

  return res.json({
    blockedWeekDays,
    blockedDates,
  })
}
