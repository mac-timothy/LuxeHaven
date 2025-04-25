import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApislice";
import { toast } from "react-toastify";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const cancelEdit = () => {
    setEditableUserId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-2xl font-semibold text-white text-center">
            User Management
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="px-6 py-4">
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user._id.substring(0, 6)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex space-x-1">
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 text-green-500 hover:text-green-400 transition-colors"
                              title="Save"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-red-500 hover:text-red-400 transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {user.username}
                          </span>
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex space-x-1">
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 text-green-500 hover:text-green-400 transition-colors"
                              title="Save"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-red-500 hover:text-red-400 transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <a
                            href={`mailto:${user.email}`}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {user.email}
                          </a>
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                          <FaCheck className="mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                          <FaTimes className="mr-1" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;