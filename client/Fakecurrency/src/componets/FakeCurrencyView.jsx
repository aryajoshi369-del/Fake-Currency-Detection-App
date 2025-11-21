import React, { useEffect, useState } from 'react';
import { GetUser } from '../api/allApi';

function FakeCurrencyView() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fakeCurrency, setFakeCurrency] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    GetUser()
      .then((res) => {
        const filterUsers = res.data.filter((user) => !user.is_superuser);
        setUsers(filterUsers);
      })
      .catch((err) => console.error('Error fetching users:', err));
  };

  const fetchFakeCurrency = (userId) => {
    const sampleData = {
      11: [
        { id: 1, image: "https://paisaboltahai.rbi.org.in/images/200Front.jpg", date: "2023-05-01" },
        { id: 2, image: "https://paisaboltahai.rbi.org.in/images/500.jpg", date: "2023-06-15" },
      ],
      2: [
        { id: 3, image: "https://paisaboltahai.rbi.org.in/images/100.jpg", date: "2023-07-20" },
      ],
    };
    setFakeCurrency(sampleData[userId] || []);
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="row g-4" style={{ minHeight: '100vh' }}>
        <div className="col-12">
          <div className="bg-secondary rounded h-100 p-4">
            <h5 className="mb-4">Users List</h5>
            <div className="table-responsive">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th>SI No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedUser(user); fetchFakeCurrency(user.id); }}>
                        <th>{index + 1}</th>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.location?.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-3">No Users Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedUser(null)}>
          <div className="modal-content bg-dark p-4" style={{ width: '80%', maxHeight: '80vh', overflowY: 'auto', borderRadius: '10px' }} onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-4 text-white">Fake Currency for {selectedUser.username}</h5>
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {fakeCurrency.length > 0 ? (
                  fakeCurrency.map((item, index) => (
                    <tr key={item.id}>
                      <th>{index + 1}</th>
                      <td>
                        <img src={item.image} alt="Fake currency" style={{ width: '100px', height: 'auto', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedImage(item.image)} />
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No fake currency records found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="btn btn-primary mt-3 w-100" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: 'relative' }}>
            <img src={selectedImage} alt="Full size" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '10px' }} />
            <button className="btn btn-danger" style={{ position: 'absolute', top: 10, right: 10, padding: '5px 15px', borderRadius: '50%' }} onClick={() => setSelectedImage(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FakeCurrencyView;
