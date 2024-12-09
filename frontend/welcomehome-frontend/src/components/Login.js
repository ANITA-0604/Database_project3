import React, { useState } from 'react';
import { login, register } from '../api/auth';

function Login() {
    const [isRegistering, setIsRegistering] = useState(false); // 控制登入或註冊
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user'); 
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        setMessage('');
        const response = await login(username, password);

        if (response.success) {
            setMessage('Login successful!');
            window.location.href = '/find-item'; 
        } else {
            setMessage(`Login failed: ${response.error.message}`);
        }
    };

    const handleRegister = async () => {
        setMessage('');
        const response = await register(username, password, fname, lname, email, role);

        if (response.success) {
            setMessage('Registration successful! You can now log in.');
            setIsRegistering(false); 
        } else {
            setMessage(`Registration failed: ${response.error.message}`);
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            

            {isRegistering && (
                <div>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Staff">Staff</option>
                        <option value="Donar">Donar</option>  
                    </select>
                </div>
                
            )}

            <button onClick={isRegistering ? handleRegister : handleLogin}>
                {isRegistering ? 'Register' : 'Login'}
            </button>

            <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>

            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </button>
        </div>
    );
}

export default Login;
