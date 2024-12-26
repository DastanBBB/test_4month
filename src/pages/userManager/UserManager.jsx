import React, {useEffect, useState} from 'react';
import "./userManager.css"

const API_URL = "http://localhost:8000/users";

function UserManager(props) {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", username: "" });
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Ошибка при загрузке пользователей:", error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.username) {
            alert("Все поля обязательны!");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.status === 201) {
                setModalMessage("Пользователь успешно создан");
                fetchUsers();
                setFormData({ name: "", email: "", username: "" });
            }
        } catch (error) {
            console.error("Ошибка при создании пользователя:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (response.status === 200) {
                setModalMessage("Пользователь удален");
                fetchUsers();
            }
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
        }
    };

    return (
        <div className="user-manager">
            <h1>Таблица пользователей</h1>

            <form onSubmit={handleCreateUser} className="user-form">
                <input
                    type="text"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <button type="submit">Создать</button>
            </form>

            {users.length > 0 ? (
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Имя пользователя</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="empty-list">Список пуст</p>
            )}

            {modalMessage && (
                <div className="modal">
                    <p>{modalMessage}</p>
                    <button onClick={() => setModalMessage("")}>Закрыть</button>
                </div>
            )}
        </div>
    );
}

export default UserManager;