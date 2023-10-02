import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

import worldCup from '../db/data-world-cup.json'

interface WorldCup {
	[team: string]: {
		team: string
		'logo-team': string
		images: {
			title: string
			description: string
			urlImage: string
		}[]
	}
}

const dataWorldCup: WorldCup = worldCup 

const app = new Hono();
app.use('*', cors({ origin: '*' }))

app.get('/', (ctx) => {
	return ctx.json([
		{
			url: '/world-cup',
			method: 'GET',
			description: 'Get images of Messi vs the rivals of Argentina in the world cup 2022'
		},
		{
			url: '/world-cup/:team',
			example: '/world-cup/saudi-arabia',
			method: 'GET',
			description: 'Get images of Messi in Argentina vs Saudi-Arabia in the world cup 2022'
		}
	])
})

app.get('/world-cup', (ctx) => {
	return ctx.json(dataWorldCup)
})

app.get('/world-cup/:team', (ctx) => {
	const reqTeam = ctx.req.param('team')

	const existTeam = Object.keys(worldCup).find((team) => team.toLowerCase() === reqTeam.toLowerCase())
	
	if (!existTeam) {
		return ctx.json({ error: 'Team not found' })
	}

	const teamImages = dataWorldCup[reqTeam]

	return ctx.json({ team: teamImages })
})

app.get('/static/*', serveStatic({ root: './'}))

export default app