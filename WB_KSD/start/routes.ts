import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'


// HAUPTSEITE ANZEIGEN 
router.get('/', async ({ view }) => {
    const habits = await db.from('habits').select('*')

    const heute = new Date().toISOString().split('T')[0]

    const logsHeute = await db.from('habit_logs').where('date', heute)

    const habitsMitStatus = habits.map(habit => {
    
    const istErledigt = logsHeute.find(log => log.habit_id === habit.id)
    
    return {
      ...habit,
      isDoneToday: istErledigt ? true : false 
    }
  })

  return view.render('pages/home', { habits: habitsMitStatus })
})

// NEUE GEWOHNHEIT SPEICHERN
router.post('/habits/create', async ({ request, response }) => {
  const name = request.input('name')
  const category = request.input('category')

  await db.table('habits').insert({
    name: name,
    category: category,
  })

  return response.redirect('/')
})


// GEWOHNHEIT LÖSCHEN
router.post('/habits/delete/:id', async ({ params, response }) => {
  await db.from('habit_logs').where('habit_id', params.id).delete()
  await db.from('habits').where('id', params.id).delete()
  return response.redirect('/')
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
