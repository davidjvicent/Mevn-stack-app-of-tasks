<template>
    <div>
        <nav class="navbar navbar-light bg-light">
            <a href="/" class="navbar-brand">MEVN Stack</a>
        </nav>

        <div class="container">
            <div class="row pt-5">
                <div class="col-md-5">
                    <div class="card">
                        <div class="card-body">
                            <form @submit.prevent="sendTask" @keyup.enter="sendTask">
                                <div class="form-group">
                                    <input type="text" placeholder="insertar nueva tarea" v-model="task.title" class="form-control">
                                </div>
                                <div class="form-group">
                                    <textarea class="form-control" v-model="task.description" cols="30" rows="10" placeholder="insert a description"></textarea>
                                </div>
                                <template v-if="edit === false">
                                    <button class="btn btn-primary btn-block">Send</button>
                                </template>
                                <template v-else>
                                    <button class="btn btn-secundary btn-block">Update</button>
                                </template>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>task</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(t, index) of tasks" :key="index">
                                <td>{{t.title}}</td>
                                <td>{{t.description}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="deleteTask(t._id)">
                                        Delete
                                    </button>
                                    <button class="btn btn-secondary" @click="editTask(t._id)">
                                        Update
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

class Task {
    constructor(title, description) {
        this.title = title
        this.description = description
    }
}

export default {
    data() {
        return {
            task: new Task(),
            tasks: [],
            edit: false,
            taskToEdit: ''
        }
    },

    created() {
        this.getTasks()
    },

    methods: {

        getTasks() {
            fetch('/api/tasks')
                .then(res => res.json())
                .then(data => {
                    this.tasks = data
                })
        },

        sendTask() {
            if(this.edit === false) {
                fetch('/api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(this.task),
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getTasks()
                })
    
                this.task = new Task()
            } else {
                fetch(`/api/tasks/${this.taskToEdit}`, {
                    method: 'PUT',
                    body: JSON.stringify(this.task),
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getTasks()
                    this.edit = false
                })

                this.task = new Task()
            }
        },

        deleteTask(id) {
            fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.getTasks()
            })
        },

        editTask(id) {
            fetch(`/api/tasks/${id}`)
              .then(res => res.json())
              .then(data => {
                  this.task = new Task(data.title, data.description)
                  this.edit = true,
                  this.taskToEdit = data._id
              })
        }
    }
}
</script>
