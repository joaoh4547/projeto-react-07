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

  const blockedDatesRaw = await prisma.$queryRaw`
    SELECT
      s.* 
    FROM schedulings s
    WHERE 
      s.user_id = ${user.id} AND
      DATE_FORMAT(s.date, '%Y-%m') = ${`${year}-${month}`}

  `

  return res.json({ blockedWeekDays, blockedDatesRaw })
}
