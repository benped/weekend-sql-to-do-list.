const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// =========== GET ALL ROWS FROM DB ====================

router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks";';
    pool.query(queryText).then(result => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
  });

// ======= ADD NEW TASK TO DB======================

router.post('/', (req,res)=> {
  let queryText = `INSERT INTO "tasks" ("name","done")
  VALUES ($1, $2);`;
  pool.query(queryText,[req.body.name,req.body.done])
    .then(result => {
      res.sendStatus(200);
      console.log('task inserted successfully');
    }).catch( err => {
      console.log('Error on insert', err);
    })
})

// ============ TOGGLE TASK DONE/UNDONE IN DB ============

router.put('/:id', (req,res)=>{
  let reqId = req.params.id;
    console.log('PUT ID', reqId, req.body.done);
    let queryText = `UPDATE "tasks"
    SET "done" = $2
    WHERE "id" = $1;  
    `;
    // req.body.done is goign to come in as ! to what it currently is. 
    pool.query(queryText,[reqId,req.body.done])    
    .then((result) => {
      console.log('Task is flipped');
      res.sendStatus(200);
      }).catch((err)=>{
        res.sendStatus(500);
      })
})


module.exports = router;