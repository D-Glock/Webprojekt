import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'

router.get('/', async () => {
  return 'App läuft! 🎉'
})

router.get('/test', async () => {
  const habits = await db.from('habits').select('*')
  return habits
})

router.get('/habits', async () => {
  const habits = await db.from('habits').select('*')
  return habits
})

router.post('/habits/create', async ({ request, response }) => {
  const name = request.input('name')
  const category = request.input('category')

  await db.table('habits').insert({
    name: name,
    category: category,
  })

  return response.redirect('/habits')
})

router.post('/habits/delete/:id', async ({ params, response }) => {
  await db.from('habits').where('id', params.id).delete()
  return response.redirect('/habits')
})
