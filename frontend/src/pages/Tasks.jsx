import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TaskForm from '../components/TaskForm'
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../services/api'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      await createTask(formData)
      // Refetch tasks after creation
      await fetchTasks()
      setShowForm(false)
      setSuccess('Task created successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = async (taskId, currentStatus) => {
    if (currentStatus) {
      setError('Completed tasks cannot be updated')
      setTimeout(() => setError(''), 3000)
      return
    }

    try {
      await updateTaskStatus(taskId)
      setTasks(tasks.map((task) => 
        task.task_id === taskId ? { ...task, status: true } : task
      ))
      setSuccess('Task marked as complete')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(taskId)
      setTasks(tasks.filter((task) => task.task_id !== taskId))
      setSuccess('Task deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Layout title="Tasks">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks yet. Create your first one!</p>
              </div>
            ) : (
              <div className="divide-y">
                {tasks.map((task) => (
                  <div key={task.task_id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className={`text-lg font-semibold ${task.status ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.task_title}
                          </h3>
                          {task.status && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className={`mt-1 ${task.status ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.task_description}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!task.status && (
                          <button
                            onClick={() => handleToggleStatus(task.task_id, task.status)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(task.task_id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Tasks