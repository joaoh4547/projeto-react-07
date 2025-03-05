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
    EXTRACT(DAY FROM S.DATE)::int AS date,
    COUNT(S.date),
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

  FROM schedulings S

  LEFT JOIN user_time_intervals UTI
    ON UTI.week_day = EXTRACT(DOW FROM S.date )

  WHERE S.user_id = ${user.id}
    AND EXTRACT(YEAR FROM S.date) = ${year}::int
    AND EXTRACT(MONTH FROM S.date) =  ${month}::int

  GROUP BY EXTRACT(DAY FROM S.DATE),
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

  HAVING
    COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60);
  `
  console.log(blockedDatesRaw)
  const blockedDates = blockedDatesRaw.map((i) => Number(i.date))

  return res.json({
    blockedWeekDays,
    blockedDates,
  })
}
