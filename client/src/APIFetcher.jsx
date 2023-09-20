import React, { useState, useEffect } from 'react';

function APIFetcher() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const fetchData = () => {
        setLoading(true);
        fetch('http://localhost:8080/product')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }

    useEffect(fetchData, []);

    const handleDelete = id => {
        fetch(`http://localhost:8080/product/${id}`, {
            method: 'DELETE',
        }).then(fetchData);
    }

    const handleCreate = () => {
        fetch('http://localhost:8080/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description  // Jeśli "description" to rzeczywiście "autor", w przeciwnym razie zmień nazwę zmiennej na coś bardziej adekwatnego.
            }),
        }).then(fetchData);
    }
    
    const handleUpdate = (id) => {
        fetch(`http://localhost:8080/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description // Jak wyżej, upewnij się, że "description" to faktycznie "autor".
            }),
        }).then(() => {
            fetchData();
            setSelectedItem(null);
        });
    }
    

    const clearForm = () => {
        setSelectedItem(null);
        setTitle("");
        setDescription("");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {selectedItem === null ? (
                <div>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                    <button onClick={handleCreate}>Create</button>
                </div>
            ) : (
                <div>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                    <button onClick={() => handleUpdate(selectedItem.id)}>Update</button>
                    <button onClick={clearForm}>Cancel</button>
                </div>
            )}

            {data.map((item) => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <button onClick={() => { setSelectedItem(item); setTitle(item.title); setDescription(item.description); }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default APIFetcher;
