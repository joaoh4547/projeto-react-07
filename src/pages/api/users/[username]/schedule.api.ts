import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'
import dayjs from 'dayjs'

const createSchedulingBody = z.object({
  name: z.string(),
  email: z.string(),
  observations: z.string(),
  date: z.string().datetime(),
})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res
      .status(400)
      .json({ message: 'Scheduling date must be in the future' })
  }

  const conflictScheduling = await prisma.scheduling.findFirst({
    where: {
      user: { id: user.id },
      date: schedulingDate.toDate(),
    },
  })

  if (conflictScheduling) {
    return res
      .status(400)
      .json({ message: 'Scheduling date is already booked' })
  }

  await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      user_id: user.id,
      email,
      name,
      observations,
    },
  })

  return res.status(201).end()
}
