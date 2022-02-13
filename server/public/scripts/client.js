$(document).ready(function(){
    console.log('jQuery sourced.');
    getTasks();
    addClickHandlers();
  });

function addClickHandlers(){
    $('#taskList').on('click','.flip',updateTask);
    $('#taskList').on('click','.delete',clickDeleteTask);
    $('#submit').on('click',addTask);
}


// Input a new Task
function addTask(){
    console.log('Add Task clicked');
    console.log($('#newTask').val());
    let newTask = $('#newTask').val();

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Task Added!',
        showConfirmButton: false,
        timer: 1500
      })

    $.ajax({
        method: 'post',
        url: 'tasks',
        data: {
            name: newTask,
            done: false
        }
        }).then(function(response){
            console.log('Successful add');
            getTasks();
            $('#newTask').val('');
        }).catch(function(err){
            console.log('error on post',err);
            
        })
    }





// Flips tast to Done / Not Done ================ 

function updateTask(){
    console.log('Flip Clicked', $(this).closest('div').data().id);
    let flip; 

    if ($(this).val() === 'notDone'){
    flip = false;
    } else (flip = true);

    console.log('This is flip',flip);  
    console.log('This is not flip',!flip);
    
    let queryId = $(this).closest('div').data().id;
    $.ajax({
        method: 'Put',
        url: `/tasks/${queryId}`,
        data: {
            done: !flip
        }
    }).then( function(response){
        console.log(response);
        getTasks();
    }).catch(function(error){
        console.log('Error on Put', error);
    })
    
}

// ====== GET FULL TABLE =================

 function getTasks(){
    $.ajax({
        type: 'get',
        url: '/tasks'
    }).then(function(response) {
        console.log(response);
        renderTasks(response);
      }).catch(function(error){
        console.log('error in GET', error);
      });
  }

//  ======== TAKES IN ARRAY, RENDERS TO DOM==============

  function renderTasks(tasks){
      $('#toDoList').empty();

      $('#doneList').empty();

      for (let task of tasks){
        if (task.done === false){
          $('#toDoList').append(`
          <div class="btn-group btn-lg btn-block task
          
          " data-id=${task.id} role="group" aria-label="Basic example">
        
          <button type="button" class="btn btn-primary flip " value="notDone">
          ${task.name}
          </button>
          <button type="button" class="btn btn-primary delete btn-danger">X</button></div>`);
        } else {
            $('#doneList').append(`
            <div class="btn-group btn-lg btn-block task
            
            " data-id=${task.id} role="group" aria-label="Basic example">
          
            <button type="button" class="btn btn-secondary flip" value="Done">
            ${task.name}
            </button>
            <button type="button" class="btn btn-secondary delete btn-danger">X</button></div>`);
        }
      }
  }

// ============= Handle PopUp for Deleting a task ==============
function clickDeleteTask(){
    console.log('Delete Clicked', $(this).closest('div').data().id);
    let deleteId = $(this).closest('div').data().id

    Swal.fire({
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete Task'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTask(deleteId);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Task Deleted',
            showConfirmButton: false,
            timer: 1000
          })
          getTasks();
        }
      })
    
}

// ======== AJAX Method to DELETE ===== TAKES IN ID

function deleteTask(queryId){
    $.ajax({
        method: 'Delete',
        url: `/tasks/${queryId}`
    }).then(function(response){
        console.log('Deleted task');
        
    }).catch(function(err){
        console.log('Error on Delete',err);
    })
}