import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

router.get('/', async () => {
  return 'App läuft! 🎉'
})

router.get('/test', async () => {
  const habits = await db.from('habits').select('*')
  return habits
})