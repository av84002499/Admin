import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const GameCard = () => {
  const [cards, setCards] = useState([]);
  const [dates, setDates] = useState([]);
  const [dateFilter, setDateFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'No token found. Please login again.',
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      
      try {
        const response = await fetch('http://localhost:4200/api/admin/cards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });

        if (!response.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Session expired. Please login again!',
            showConfirmButton: false,
            timer: 2000,
          });
          navigate('/Login');
          return;
        }

        const responseData = await response.json();
        if (Array.isArray(responseData)) {
          setDates([...new Set(responseData.map(item => item.data))]);
          if (dateFilter !== 'All' || timeFilter !== 'All') {
            let cards = responseData;
            if (dateFilter !== 'All' && timeFilter === 'All') {
              cards = cards.filter(card => card.data === dateFilter);
            } else if (dateFilter === 'All' && timeFilter !== 'All'){
              cards = cards.filter(card => card.time === timeFilter);
            } else{
              cards = cards.filter(card => (card.data === dateFilter && card.time === timeFilter));
            }
            setCards(cards);
          } else {
            setCards(responseData);
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Unexpected response format',
            text: 'Please try again later.',
          });
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load cards.',
          text: err.message,
        });
      }
    };

    fetchCards();
    const interval = setInterval(fetchCards, 5000);
    return () => clearInterval(interval);
  }, [navigate, dateFilter, timeFilter]);


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Game Cards</h2>
      Date:<select className="" defaultValue='All' onChange={(e) => setDateFilter(e.target.value)}>
        <option value="All">All</option>
        {dates.map((date) => {
          return (
            <option value={date}>{date}</option>
          )
        })}
      </select>
      Time:<select className="" defaultValue='All' onChange={(e) => setTimeFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Day">Day</option>
        <option value="Night">Night</option>
      </select>
      <div className="row">
        {cards.map((card) => {
          return (
            <div key={card._id} className="col-md-3 mb-4">
              <div className="card shadow-sm p-3">
                <h5 className="card-title">💳 Number: {card.nomber}</h5>
                <p className="card-text">💰 Price: {card.price}</p>
                <p className="card-text">📅 Date: {card.data}</p> {/* Assuming 'data' is the date */}
                <p className="card-text">⏰ Time: {card.time}</p>
                <p className="card-text">⏰ status: {card.status}</p>
                <p className="card-text">⏰ card type: {card.category}</p>
                <p className="card-text">🧑 User ID: {card.userId}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameCard;
