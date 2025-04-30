import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TodayReport = () => {
    const [cards, setCards] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [minNumber, setMinNumber] = useState({ 'number': '-', 'amount':  0});
    const [digitFilter, setDigitFilter] = useState('OneDigit');
    const [timeFilter, setTimeFilter] = useState('Day');
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
                const today = new Date().toLocaleDateString('en-GB');
                if (Array.isArray(responseData)) {
                    let cards = responseData.filter(card => card.data === today && card.time === timeFilter && card.category === digitFilter);
                    setCards(cards);
                    setNumbers([...new Set(cards.map(item => item.nomber))]);
                    numbers.forEach(number => {
                        const amount = cards.filter(item => item.nomber === number).reduce((sum, item) => sum + Number(item.price), 0);
                        if(minNumber.amount === 0 || minNumber.amount > amount){
                            setMinNumber({'number': number, 'amount':  amount});
                        }
                    });

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
        const interval = setInterval(fetchCards, 1000);
        return () => clearInterval(interval);
    }, [navigate, numbers, digitFilter, timeFilter]);


    return (
        <div className='mt-5 pt-5'>
            <div className="container bg-light p-3 rounded">
                <h2 className="mb-4">Today's Game Report | {new Date().toLocaleDateString('en-GB')}</h2>
                Digits:<select onChange={(e) => setDigitFilter(e.target.value)}>
                    <option value="OneDigit">One Digit</option>
                    <option value="TwoDigit">Two Digit</option>
                    <option value="ThreeDigit">Three Digit</option>
                    <option value="FourDigit">Four Digit</option>
                </select>
                Time:<select onChange={(e) => setTimeFilter(e.target.value)}>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                </select>
                <div className='container my-3'>
                    <div class="card">
                        <div class="card-body">
                            <h6>Minumum Amount:</h6>{minNumber.amount}
                            <h6>Number:</h6>{minNumber.number}
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Card Count</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">Total Return</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            {numbers.map((number, index) => {
                                const numCards = cards.filter(item => item.nomber === number);
                                const count = numCards.length;
                                const amount = numCards.reduce((sum, item) => sum + Number(item.price), 0);
                                const returnRate = { 'OneDigit': 5, 'TwoDigit': 10, 'ThreeDigit': 15, 'FourDigit': 20 }
                                const returnAmount = amount * returnRate[digitFilter];
                                return (
                                    <tr>
                                        <th scope="row">{number}</th>
                                        <td>{count}</td>
                                        <td>{amount}</td>
                                        <td>{returnAmount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TodayReport;
