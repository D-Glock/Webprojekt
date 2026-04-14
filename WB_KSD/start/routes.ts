import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'


// HAUPTSEITE ANZEIGEN 
router.get('/', async ({ view }) => {
  const habits = await db.from('habits').select('*')
  return view.render('pages/home', { habits })
})

// NEUE GEWOHNHEIT SPEICHERN
router.post('/habits/create', async ({ request, response }) => {
  const name = request.input('name')
  const category = request.input('category')

  await db.table('habits').insert({
    name: name,
    category: category,
  })

  return response.redirect('/habits')
})


// GEWOHNHEIT LÖSCHEN
router.post('/habits/delete/:id', async ({ params, response }) => {
  await db.from('habits').where('id', params.id).delete()
  return response.redirect('/habits')
})

// ALS ERLEDIGT MARKIEREN
router.post('/habits/log/:id', async ({ params, response }) => {

  const heute = new Date().toISOString().split('T')[0]

  await db.table('habit_logs').insert({
    habit_id: params.id,
    date: heute,        
    done: true          
  })
  return response.redirect('/')
})
