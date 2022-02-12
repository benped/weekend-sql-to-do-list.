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
    console.log('Flip Clicked', $(this).closest('li').data().id);
    let flip; 

    if ($(this).val() === 'notDone'){
    flip = false;
    } else (flip = true);

    console.log('This is flip',flip);  
    console.log('This is not flip',!flip);
    
    let queryId = $(this).closest('li').data().id;
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
          $('#toDoList').append(`<li class="task" data-id=${task.id}>
          ${task.name}
          <button class="flip" value="notDone">${task.done}</button>
          <button class="delete">Delete</button></li>`);
        } else {
            $('#doneList').append(`<li class="task" data-id=${task.id}>
            ${task.name}
            <button class="flip" value="Done">${task.done}</button>
            <button class="delete">Delete</button></li>`);
        }
      }
  }

// ============= Handle PopUp for Deleting a task ==============
function clickDeleteTask(){
    console.log('Delete Clicked', $(this).closest('li').data().id);
    let deleteId = $(this).closest('li').data().id

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTask(deleteId);
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          )
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