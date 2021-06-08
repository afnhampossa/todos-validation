const todos = []

module.exports = (app, connection, validate,sanitize,validations) => {


  
  app.post('/todos', (req, res) => {
    const todo = req.body
  
    const rules = {
      title: 'required|string|max:255',
      completed: 'required|range:1,2',
      user_id: 'integer',
    }
  
    const sanitizationRules = {
      title: 'trim|escape|strip_tags',
      completed: 'escape|strip_tags',
      user_id: 'escape|strip_tags',
    }
  
    validate(todo, rules, sanitizationRules)
      .then((value) => {
        sanitize(value, sanitizationRules)

        connection.query('INSERT INTO todos SET ?', [todo], (error, results, _) => {
          if (error) {
            throw error
          }
    
          // const { insertId } = results
    
          // db.query('SELECT * FROM todos WHERE id = ? LIMIT 1', [insertId], (error, results, _) => {
          //   if (error) {
          //     throw error
          //   }
    
            res.send(results[0])
         // })
        })
        
        //res.send(value)
      }).catch((error) => {
        res.status(400).send(error)
      })
  })

  
  //Método GET all
  app.get('/todos', (_, res) => {

    connection.query('SELECT * from todos', function (error, results, fields) {
      if (error) throw error;

      res.send({
        code: 200,
        meta: {
          pagination: {
            total: results.length,
            pages: 1,
            page: 1,
            limit: undefined,
          }
        },
        data: results
      })
    });
  })



  // app.get('/todos', (req, res) => {
  //   const { limit, page } = req.query

  //   const _limit = +limit
  //   const _page = +page

  //   connection.query('SELECT COUNT(id) FROM todos', (error, countResults, _) => {
  //     if (error) {
  //       throw error
  //     }

  //     const offset = (_page - 1) * _limit
  //     const total = countResults[0]['COUNT(id)']
  //     const pageCount = Math.ceil(total / limit)
      
  //     connection.query('SELECT * FROM todos LIMIT ?, ?', [offset, _limit], (error, results, _) => {
  //       if (error) {
  //         throw error
  //       }

  //       res.send({
  //         code: 200,
  //         meta: {
  //           pagination: {
  //             total: total,
  //             pages: pageCount,
  //             page: _page,
  //             limit: _limit
  //           }
  //         },
  //         data: results
  //       })
  //     })
  //   })
  // })

  app.get('/todos/:id', (req, res) => {
    const { id } = req.params

    res.send(todos.find((todo) => todo.id == id))
  })


}
