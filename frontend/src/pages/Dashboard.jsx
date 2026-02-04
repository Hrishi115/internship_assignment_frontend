import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { getCurrentUser } from '../services/api'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (err) {
      console.error('Failed to fetch user:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Dashboard">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome{user ? `, ${user.full_name}` : ''}!
        </h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Authenticated</p>
                <p className="text-sm text-gray-500">You are successfully logged in</p>
              </div>
            </div>
            {user && (
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Username:</span> {user.username}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span>{' '}
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </p>
              </div>
            )}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Navigate to <span className="font-medium">Tasks</span> to manage your tasks.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard