import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'


// HAUPTSEITE ANZEIGEN 
router.get('/', async ({ view }) => {
  // 1. FESTE GEWOHNHEITEN HOLEN & CHECKEN
  const habits = await db.from('habits').select('*')
  const heute = new Date().toISOString().split('T')[0]
  const logsHeute = await db.from('habit_logs').where('date', heute)

  const habitsMitStatus = habits.map(habit => {
    const istErledigt = logsHeute.find(log => log.habit_id === habit.id)
    return { ...habit, isDoneToday: istErledigt ? true : false }
  })

  // 2. FLEXIBLE TO-DOS HOLEN
  const todos = await db.from('todos').select('*')

  // 3. BEIDES AN DAS HTML ÜBERGEBEN
  return view.render('pages/home', { 
    habits: habitsMitStatus, 
    todos: todos 
  })
})







// FESTE GEWOHNHEITEN
router.post('/habits/log/:id', async ({ params, response }) => {
  const heute = new Date().toISOString().split('T')[0]
  await db.table('habit_logs').insert({
    habit_id: params.id,
    date: heute,        
    done: true          
  })
  return response.redirect('/')
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


// DO'S 


router.post('/todos/create', async ({ request, response }) => {
  const title = request.input('title')

  await db.table('todos').insert({
    title: title,
  })

  return response.redirect('/')
})

// To-Do löschen
router.post('/todos/delete/:id', async ({ params, response }) => {
  await db.from('todos').where('id', params.id).delete()
  return response.redirect('/')
})

// To-Do als erledigt markieren 
router.post('/todos/complete/:id', async ({ params, response }) => {
  const todo = await db.from('todos').where('id', params.id).first()

  await db.from('todos').where('id', params.id).update({
    is_completed: !todo.is_completed
  })
  return response.redirect('/')
})