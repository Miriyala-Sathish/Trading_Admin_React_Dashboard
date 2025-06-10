import { useState, useEffect } from 'react';
import axios from 'axios';
import noResults from '../Images/no_results.jpg';
import useFormValidation from './Validations/FormValidation';
import { demoPaidConfig } from './Validations/FormConfigs';

const GenericSubscribers = ({ apiEndpoint, fieldPrefix, title, subtitle, searchPlaceholder, addButtonText, sectionClass }) => {
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

  // Map selectedUser fields to match formConfig field names
  const initialData = isUpdateMode && selectedUser ? {
    referralId: selectedUser[`referralId${fieldPrefix}`],
    name: selectedUser[`name${fieldPrefix}`],
    date: selectedUser[`date${fieldPrefix}`],
    tradingViewId: selectedUser[`tradingViewId${fieldPrefix}`],
    phoneNumber: selectedUser[`phoneNumber${fieldPrefix}`],
    email: selectedUser[`email${fieldPrefix}`],
    expiryDate: selectedUser[`expiryDate${fieldPrefix}`],
  } : {};

  // Use validation hook
  const { formData, errors, handleInputChange, validateForm, resetForm } = useFormValidation(
    demoPaidConfig,
    initialData
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      const allUsers = response.data.map(user => ({
        ...user,
        [`remainingDays${fieldPrefix}`]: calculateRemainingDays(user[`expiryDate${fieldPrefix}`]),
      }));
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
    data.forEach(page => totalUsers += page.length);
    return Math.ceil(totalUsers / usersPerPage);
  };

  const rebalancePages = (data) => {
    let allUsers = [];
    data.forEach(page => allUsers.push(...page));
    const newData = [];
    for (let i = 0; i < allUsers.length; i += usersPerPage) {
      newData.push(allUsers.slice(i, i + usersPerPage));
    }
    return newData;
  };

  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  const handleActionClick = (user, e) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowActionMenu(showActionMenu === user.id ? null : user.id);
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
      await axios.delete(`${apiEndpoint}/${selectedUser.id}`);
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
    return usersOnPage.map(user => (
      <tr key={user.id}>
        <td>{user[`referralId${fieldPrefix}`]}</td>
        <td>{user[`name${fieldPrefix}`]}</td>
        <td>{user[`date${fieldPrefix}`]}</td>
        <td>{user[`tradingViewId${fieldPrefix}`]}</td>
        <td>{user[`phoneNumber${fieldPrefix}`]}</td>
        <td>{user[`email${fieldPrefix}`]}</td>
        <td>{user[`expiryDate${fieldPrefix}`]}</td>
        <td>{user[`remainingDays${fieldPrefix}`]}</td>
        <td className="action-cell">
          <span className="action-icon" onClick={(e) => handleActionClick(user, e)}>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </span>
          {showActionMenu === user.id && (
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
        const response = await axios.get(apiEndpoint);
        const allUsers = response.data.map(user => ({
          ...user,
          [`remainingDays${fieldPrefix}`]: calculateRemainingDays(user[`expiryDate${fieldPrefix}`]),
        }));
        const filtered = allUsers.filter(
          user =>
            user[`referralId${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`name${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`date${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`tradingViewId${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`phoneNumber${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`email${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`expiryDate${fieldPrefix}`].toLowerCase().includes(term) ||
            user[`remainingDays${fieldPrefix}`].toString().includes(term)
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

    // Map formData back to API field names
    const apiData = {
      [`referralId${fieldPrefix}`]: formData.referralId,
      [`name${fieldPrefix}`]: formData.name,
      [`date${fieldPrefix}`]: formData.date,
      [`tradingViewId${fieldPrefix}`]: formData.tradingViewId,
      [`phoneNumber${fieldPrefix}`]: formData.phoneNumber,
      [`email${fieldPrefix}`]: formData.email,
      [`expiryDate${fieldPrefix}`]: formData.expiryDate,
    };

    try {
      if (isUpdateMode && selectedUser) {
        await axios.put(`${apiEndpoint}/${selectedUser.id}`, apiData);
      } else {
        await axios.post(apiEndpoint, apiData);
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
    <section className={`${sectionClass} main-users`}>
      <div className="banner">
        <div className="banner-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="user-controls">
        <div className="search-bar">
          <input
            type="text"
            id="userSearchInput"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon"><ion-icon name="search-outline"></ion-icon></span>
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <ion-icon name="person-add-outline"></ion-icon> {addButtonText}
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Referral ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Trading View ID</th>
              <th>Phone Number</th>
              <th>Email ID</th>
              <th>Expiry Date</th>
              <th>Remaining Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {renderTable()}
          </tbody>
        </table>
        <div
          id="noResults"
          style={{ display: showNoResults ? 'block' : 'none', textAlign: 'center', padding: '30px' }}
        >
          <img src={noResults} alt="No Results Found" style={{ maxWidth: '250px' }} />
          <p>No Results found.</p>
        </div>
      </div>

      <div className="pagination" style={{ display: totalPages > 0 ? 'flex' : 'none' }}>
        <button
          id="prevPage"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
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
          <span className="close-modal" onClick={handleCloseModal}>×</span>
          <h2>{isUpdateMode ? 'Update Subscriber' : 'Add New Subscriber'}</h2>
          <form className="modal-form" onSubmit={handleSubmitUser}>
            <label htmlFor="referralId">Referral ID</label>
            <input
              type="text"
              id="referralId"
              name="referralId"
              value={formData.referralId}
              onChange={handleInputChange}
              placeholder="e.g., REF123"
            />
            {errors.referralId && <span className="error">{errors.referralId}</span>}

            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
            {errors.date && <span className="error">{errors.date}</span>}

            <label htmlFor="tradingViewId">Trading View ID</label>
            <input
              type="text"
              id="tradingViewId"
              name="tradingViewId"
              value={formData.tradingViewId}
              onChange={handleInputChange}
              placeholder="e.g., TV_123"
            />
            {errors.tradingViewId && <span className="error">{errors.tradingViewId}</span>}

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="e.g., +1234567890"
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}

            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., sathish@gmail.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
            {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}

            <button type="submit" id="submitUser">
              {isUpdateMode ? 'Update Subscriber' : 'Add Subscriber'}
            </button>
          </form>
        </div>
      </div>

      <div className="modal" id="deleteUserModal" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete subscriber with Referral ID {selectedUser?.[`referralId${fieldPrefix}`]}?</p>
          <div className="modal-actions">
            <button onClick={confirmDelete}>Yes, Delete</button>
            <button onClick={handleCloseDeleteModal}>No, Cancel</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenericSubscribers;