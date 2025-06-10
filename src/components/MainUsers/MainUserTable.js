import { useState, useEffect } from 'react';
import axios from 'axios';
import noResults from '../../Images/no_results.jpg';
import useFormValidation from '../Validations/FormValidation';
import { mainUsersConfig } from '../Validations/FormConfigs';

const MainUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const usersPerPage = 5;

  // Initialize form data with selectedUser for updates
  const initialData = isUpdateMode && selectedUser ? {
    referralId_main_user: selectedUser.referralId_main_user,
    name_main_user: selectedUser.name_main_user,
    tradingId_main_user: selectedUser.tradingId_main_user,
    email_main_user: selectedUser.email_main_user,
    subscriberCount_main_user: selectedUser.subscriberCount_main_user,
  } : {};

  // Use validation hook
  const { formData, errors, handleInputChange, validateForm, resetForm } = useFormValidation(
    mainUsersConfig,
    initialData
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5600/api/main-users');
      const allUsers = response.data;
      const rebalanced = rebalancePages([allUsers]);
      setUsers(rebalanced);
      setFilteredUsers([]);
      setIsSearching(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    }
  };

  const calculateTotalPages = (data) => {
    let totalUsers = 0;
    data.forEach((page) => (totalUsers += page.length));
    return Math.ceil(totalUsers / usersPerPage);
  };

  const rebalancePages = (data) => {
    let allUsers = [];
    data.forEach((page) => allUsers.push(...page));
    const newData = [];
    for (let i = 0; i < allUsers.length; i += usersPerPage) {
      newData.push(allUsers.slice(i, i + usersPerPage));
    }
    return newData;
  };

  const handleActionClick = (user, e) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowActionMenu(showActionMenu === user.referralId_main_user ? null : user.referralId_main_user);
  };

  const handleUpdate = () => {
    setIsUpdateMode(true);
    setIsModalOpen(true);
    setShowActionMenu(null);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setShowActionMenu(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5600/api/main-users/${selectedUser.id}`);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const renderTable = () => {
    const data = isSearching ? filteredUsers : users;
    const usersOnPage = data[currentPage - 1] || [];
    return usersOnPage.map((user) => (
      <tr key={user.id}>
        <td>{user.referralId_main_user}</td>
        <td>{user.name_main_user}</td>
        <td>{user.tradingId_main_user}</td>
        <td>{user.email_main_user}</td>
        <td>{user.subscriberCount_main_user}</td>
        <td className="action-cell">
          <span className="action-icon" onClick={(e) => handleActionClick(user, e)}>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </span>
          {showActionMenu === user.referralId_main_user && (
            <div className="action-menu">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </td>
      </tr>
    ));
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setIsSearching(false);
      setCurrentPage(1);
      setFilteredUsers([]);
    } else {
      try {
        const response = await axios.get('http://localhost:5600/api/main-users');
        const allUsers = response.data;
        const filtered = allUsers.filter(
          (user) =>
            user.referralId_main_user.toLowerCase().includes(term) ||
            user.name_main_user.toLowerCase().includes(term) ||
            user.tradingId_main_user.toLowerCase().includes(term) ||
            user.email_main_user.toLowerCase().includes(term) ||
            user.subscriberCount_main_user.toString().includes(term)
        );
        setFilteredUsers(rebalancePages([filtered]));
        setIsSearching(true);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error searching users:', error);
        alert('Failed to search users');
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const data = isSearching ? filteredUsers : users;
    const totalPages = calculateTotalPages(data);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddUser = () => {
    setIsUpdateMode(false);
    setSelectedUser(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsUpdateMode(false);
    resetForm();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // Use formData directly, adjusting subscriberCount_main_user to integer
    const apiData = {
      ...formData,
      subscriberCount_main_user: parseInt(formData.subscriberCount_main_user),
    };

    try {
      if (isUpdateMode && selectedUser) {
        await axios.put(`http://localhost:5600/api/main-users/${selectedUser.id}`, apiData);
      } else {
        await axios.post('http://localhost:5600/api/main-users', apiData);
      }
      await fetchUsers();
      setIsModalOpen(false);
      setIsUpdateMode(false);
      setSelectedUser(null);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. ' + (error.response?.data?.message || ''));
    }
  };

  const data = isSearching ? filteredUsers : users;
  const totalPages = calculateTotalPages(data);
  const showNoResults = totalPages === 0;

  return (
    <div className="user-management">
      <div className="user-controls">
        <div className="search-bar">
          <input
            type="text"
            id="userSearchInput"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">
            <ion-icon name="search-outline"></ion-icon>
          </span>
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <ion-icon name="person-add-outline"></ion-icon> Add New User
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Referral ID</th>
              <th>Name</th>
              <th>Trading ID</th>
              <th>Email</th>
              <th>Subscriber Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">{renderTable()}</tbody>
        </table>
        <div
          id="noResults"
          style={{ display: showNoResults ? 'block' : 'none', textAlign: 'center', padding: '30px' }}
        >
          <img src={noResults} alt="No Results Found" style={{ maxWidth: '250px' }} />
          <p>No users found.</p>
        </div>
      </div>

      <div className="pagination" style={{ display: totalPages > 0 ? 'flex' : 'none' }}>
        <button id="prevPage" disabled={currentPage === 1} onClick={handlePrevPage}>
          <ion-icon name="chevron-back-outline"></ion-icon>
          Previous
        </button>
        <span id="pageInfo">Page {currentPage} of {totalPages}</span>
        <button
          id="nextPage"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={handleNextPage}
        >
          Next
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>

      <div className="modal" id="addUserModal" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close-modal" onClick={handleCloseModal}>
            ×
          </span>
          <h2>{isUpdateMode ? 'Update User' : 'Add New User'}</h2>
          <form className="modal-form" onSubmit={handleSubmitUser}>
            <label htmlFor="referralId_main_user">Referral ID</label>
            <input
              type="text"
              id="referralId_main_user"
              name="referralId_main_user"
              value={formData.referralId_main_user}
              onChange={handleInputChange}
              placeholder="e.g., REF999"
            />
            {errors.referralId_main_user && <span className="error">{errors.referralId_main_user}</span>}

            <label htmlFor="name_main_user">Name</label>
            <input
              type="text"
              id="name_main_user"
              name="name_main_user"
              value={formData.name_main_user}
              onChange={handleInputChange}
              placeholder="e.g., Sathish Miriyala"
            />
            {errors.name_main_user && <span className="error">{errors.name_main_user}</span>}

            <label htmlFor="tradingId_main_user">Trading ID</label>
            <input
              type="text"
              id="tradingId_main_user"
              name="tradingId_main_user"
              value={formData.tradingId_main_user}
              onChange={handleInputChange}
              placeholder="e.g., TD_127"
            />
            {errors.tradingId_main_user && <span className="error">{errors.tradingId_main_user}</span>}

            <label htmlFor="email_main_user">Email</label>
            <input
              type="email"
              id="email_main_user"
              name="email_main_user"
              value={formData.email_main_user}
              onChange={handleInputChange}
              placeholder="e.g., sathish@gmail.com"
            />
            {errors.email_main_user && <span className="error">{errors.email_main_user}</span>}

            <label htmlFor="subscriberCount_main_user">Subscriber Count</label>
            <input
              type="number"
              id="subscriberCount_main_user"
              name="subscriberCount_main_user"
              value={formData.subscriberCount_main_user}
              onChange={handleInputChange}
              placeholder="e.g., 5"
            />
            {errors.subscriberCount_main_user && <span className="error">{errors.subscriberCount_main_user}</span>}

            <button type="submit" id="submitUser">
              {isUpdateMode ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>
      </div>

      <div className="modal" id="deleteUserModal" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete {selectedUser?.name_main_user}?</p>
          <div className="modal-actions">
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={handleCloseDeleteModal}>No, Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainUsers;