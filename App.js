import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, ListGroup, Modal } from 'react-bootstrap';
import './App.css'; // Import custom CSS for animations and styling

function App() {
    const [view, setView] = useState('initial');
    const [formData, setFormData] = useState({
        gr_liv_area: '',
        overall_qual: '',
        garage_cars: '',
        year_built: ''
    });

    const [predictedPrice, setPredictedPrice] = useState(null);
    const [storedData, setStoredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showStoredData, setShowStoredData] = useState(false);

    useEffect(() => {
        // Retrieve stored data from Local Storage when the component mounts
        const data = JSON.parse(localStorage.getItem('houseData')) || [];
        setStoredData(data);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gr_liv_area: parseInt(formData.gr_liv_area),
                    overall_qual: parseInt(formData.overall_qual),
                    garage_cars: parseInt(formData.garage_cars),
                    year_built: parseInt(formData.year_built)
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPredictedPrice(data.predicted_price);
            setShowModal(true);

            // Save the input data and predicted price to Local Storage
            const newData = {
                gr_liv_area: parseInt(formData.gr_liv_area),
                overall_qual: parseInt(formData.overall_qual),
                garage_cars: parseInt(formData.garage_cars),
                year_built: parseInt(formData.year_built),
                predicted_price: data.predicted_price
            };

            const updatedStoredData = [...storedData, newData];
            setStoredData(updatedStoredData);
            localStorage.setItem('houseData', JSON.stringify(updatedStoredData));
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleToggleStoredData = () => {
        setShowStoredData(!showStoredData);
    };

    return (
        <div className={`app-container ${view}`}>
            {view === 'initial' && (
                <Container className="my-5 text-center">
                    <div className="initial-view">
                        <h1 className="hover-title" onClick={() => setView('form')}>House Price Estimator</h1>
                    </div>
                </Container>
            )}

            {view === 'form' && (
                <Container className="my-5">
                    {!showStoredData && (
                        <Card className="p-4 animated-card form-card">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Gr Liv Area:</Form.Label>
                                    <Form.Control type="number" name="gr_liv_area" value={formData.gr_liv_area} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Overall Qual:</Form.Label>
                                    <Form.Control type="number" name="overall_qual" value={formData.overall_qual} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Garage Cars:</Form.Label>
                                    <Form.Control type="number" name="garage_cars" value={formData.garage_cars} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Year Built:</Form.Label>
                                    <Form.Control type="number" name="year_built" value={formData.year_built} onChange={handleChange} required />
                                </Form.Group>
                                <div className="text-center mt-4">
                                    <Button variant="primary" type="submit">Predict Price</Button>
                                </div>
                            </Form>
                            <div className="text-center mt-3">
                                <Button variant="secondary" onClick={handleToggleStoredData}>
                                    View Stored Data
                                </Button>
                            </div>
                        </Card>
                    )}
                    {showStoredData && (
                        <Card className="mt-5 animated-card wider-card fade-in-right">
                            <Card.Header>Stored Data</Card.Header>
                            <ListGroup variant="flush">
                                {storedData.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        Gr Liv Area: {item.gr_liv_area}, Overall Qual: {item.overall_qual}, Garage Cars: {item.garage_cars}, Year Built: {item.year_built}, Predicted Price: ${item.predicted_price.toFixed(2)}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="text-center mt-3">
                                <Button variant="secondary" onClick={handleToggleStoredData}>
                                    Go Back
                                </Button>
                            </div>
                        </Card>
                    )}
                    <Modal show={showModal} onHide={handleCloseModal} className="modal-popup">
                        <Modal.Header closeButton>
                            <Modal.Title>Estimated Price</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>The estimated price of the house is: ${predictedPrice ? predictedPrice.toFixed(2) : ''}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            )}
        </div>
    );
}

export default App;
