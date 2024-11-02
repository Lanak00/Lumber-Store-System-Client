import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../components/orders/OrderDetailsPage.module.css';

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [client, setClient] = useState({ firstName: "", lastName: "" });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = getUserRoleFromToken(token);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://localhost:7046/api/Order/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        console.log(data)
        setOrder(data);

        if (data.clientId) {
          fetchClientDetails(data.clientId);
          console.log(data.clientId)
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    const fetchClientDetails = async (clientId) => {
      try {
        const response = await fetch(`https://localhost:7046/api/Client/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch client details');
        }
        const clientData = await response.json();
        console.log(clientData)
        setClient({ firstName: clientData.firstName, lastName: clientData.lastName });
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchOrder();
  }, [id, token]);

  const markAsFinished = async () => {
    try {
      const response = await fetch(`https://localhost:7046/api/Order`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, status: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      alert('Order marked as finished!');
      setOrder({ ...order, status: 1 });
      setShowModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to mark order as finished.');
    }
  };

  const generateCuttingListPdf = async () => {
    setIsLoading(true); // Start loading
    try {
      const transformedCuttingList = order.cuttingLists.flatMap(cl =>
        cl.cuttingListItems.map(item => ({
          width: item.width,
          length: item.length,
          amount: item.amount,
        }))
      );

      const response = await fetch(`https://localhost:7046/api/Cutting/OptimizeAndGeneratePDF`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardWidth: 275,
          boardHeight: 208,
          cuttingList: transformedCuttingList,
          productName: order.cuttingLists[0]?.productName, 
          productId: "H445 NH",
          clientFirstName: client.firstName,
          clientLastName: client.lastName,
          orderId: order.id,
          orderDate: order.date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CuttingLayout.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!order) return <p>Loading...</p>;

  return (
    <div className={styles.orderContainer}>
      <h1>Porudzbina #{order.id}</h1>
      <p><strong>Datum:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Cena:</strong> {order.totalPrice} RSD</p>

      <div className={styles.productList}>
        <h4>Proizvodi:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index} className={styles.productItem}>
              <img src={item.productImage} alt={item.productName} className={styles.productImage} />
              <div>
                <p><strong>{item.productName}</strong></p>
                <p>Kolicina: {item.quantity}</p>
                <p>Cena: {item.price} RSD</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order.cuttingLists.length > 0 && (
        <div className={styles.cuttingList}>
          <h4>Krojne liste:</h4>
          {order.cuttingLists.map((cl, index) => (
            <div key={index} className={styles.cuttingListItem}>
              <img
                src={cl.image}
                alt={cl.productName}
                className={styles.cuttingListImage}
              />
              <div className={styles.cuttingListDetails}>
                <p><strong>{cl.productName}</strong></p>
                <p>Cena: {cl.price} RSD</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {userRole === 'Employee' && order.status === 0 && (
        <div className={styles.buttonContainer}>
          <button
            className={styles.finishButton}
            onClick={openModal}
          >
            Oznaci kao zavrseno
          </button>
          {order.cuttingLists.length > 0 && ( // Only show if cutting lists are present
            <button
              className={styles.generatePdfButton}
              onClick={generateCuttingListPdf}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Loading..." : "Generisi Krojnu Listu"}
              {isLoading && <span className={styles.spinner}></span>} {/* Conditionally render spinner */}
            </button>
          )}
        </div>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>Jeste li sigurni da zelite da zavrsite porudzbinu?</p>
            <div className={styles.modalButtons}>
              <button onClick={markAsFinished} className={styles.confirmButton}>
                Potvrdi
              </button>
              <button onClick={closeModal} className={styles.cancelButton}>
                Otkazi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const getUserRoleFromToken = (token) => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

export default OrderDetailsPage;
