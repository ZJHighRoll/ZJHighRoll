// Authentication System - Local Storage Based
// This uses browser localStorage to simulate user accounts
// For production, connect to a real backend/database

class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('zjh_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('zjh_currentUser')) || null;
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('zjh_users', JSON.stringify(this.users));
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('zjh_currentUser', JSON.stringify(user));
        this.updateNavbar();
    }

    // Clear current user (logout)
    logout() {
        this.currentUser = null;
        localStorage.removeItem('zjh_currentUser');
        this.updateNavbar();
        window.location.href = 'index.html';
    }

    // Check if user exists
    userExists(email) {
        return this.users.some(user => user.email === email);
    }

    // Check if username is taken
    usernameTaken(username) {
        return this.users.some(user => user.username === username);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    isValidPassword(password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Create new account (Sign Up)
    signup(username, email, password, confirmPassword) {
        // Validation checks
        if (!username || !email || !password) {
            return { success: false, message: 'All fields are required' };
        }

        if (this.usernameTaken(username)) {
            return { success: false, message: 'Username already taken' };
        }

        if (this.userExists(email)) {
            return { success: false, message: 'Email already registered' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        if (!this.isValidPassword(password)) {
            return { success: false, message: 'Password must be at least 8 characters with uppercase, lowercase, and a number' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: this.hashPassword(password), // Simple hash (not production-safe)
            createdAt: new Date().toISOString(),
            points: 0,
            wins: 0,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: '',
            joinedEvents: [],
            achievements: []
        };

        this.users.push(newUser);
        this.saveUsers();

        return { success: true, message: 'Account created successfully', user: newUser };
    }

    // Login
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        const user = this.users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'Email not found' };
        }

        if (this.hashPassword(password) !== user.password) {
            return { success: false, message: 'Invalid password' };
        }

        // Remove password from user object before storing
        const userToStore = { ...user };
        delete userToStore.password;

        this.setCurrentUser(userToStore);
        return { success: true, message: 'Login successful', user: userToStore };
    }

    // Simple password hash (for demo only - use bcrypt in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }

    // Update user profile
    updateProfile(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveUsers();
            if (this.currentUser.id === userId) {
                this.setCurrentUser(this.users[userIndex]);
            }
            return { success: true, user: this.users[userIndex] };
        }
        return { success: false, message: 'User not found' };
    }

    // Update leaderboard (add points/wins)
    addPoints(userId, points, won = false) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].points += points;
            if (won) this.users[userIndex].wins += 1;
            this.saveUsers();
            this.setCurrentUser(this.users[userIndex]);
            return { success: true };
        }
        return { success: false };
    }

    // Get leaderboard
    getLeaderboard(limit = 50) {
        return this.users
            .sort((a, b) => b.points - a.points)
            .slice(0, limit)
            .map((user, index) => ({
                rank: index + 1,
                username: user.username,
                points: user.points,
                wins: user.wins,
                avatar: user.avatar
            }));
    }

    // Update navbar based on login state
    updateNavbar() {
        const loginBtn = document.querySelector('.btn-login');
        if (!loginBtn) return;

        if (this.currentUser) {
            loginBtn.innerHTML = `
                <div class="user-menu">
                    <img src="${this.currentUser.avatar}" alt="${this.currentUser.username}" class="user-avatar">
                    <span>${this.currentUser.username}</span>
                    <div class="dropdown">
                        <a href="profile.html">My Profile</a>
                        <a href="dashboard.html">Dashboard</a>
                        <hr>
                        <a href="#" onclick="auth.logout(); return false;">Logout</a>
                    </div>
                </div>
            `;
            loginBtn.style.background = 'transparent';
        } else {
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = () => window.location.href = 'login.html';
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// ============ SIGN UP PAGE ============
if (document.getElementById('signupForm')) {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usernameHint = document.getElementById('usernameHint');
    const passwordMatch = document.getElementById('passwordMatch');

    // Real-time username validation
    usernameInput.addEventListener('input', (e) => {
        const username = e.target.value;
        if (username.length < 3) {
            usernameHint.textContent = 'Username must be at least 3 characters';
            usernameHint.className = 'validation-hint error';
        } else if (auth.usernameTaken(username)) {
            usernameHint.textContent = 'Username already taken';
            usernameHint.className = 'validation-hint error';
        } else {
            usernameHint.textContent = 'Username available!';
            usernameHint.className = 'validation-hint success';
        }
    });

    // Real-time password validation
    confirmPasswordInput.addEventListener('input', (e) => {
        if (passwordInput.value !== e.target.value) {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.className = 'validation-hint error';
        } else if (passwordInput.value) {
            passwordMatch.textContent = 'Passwords match!';
            passwordMatch.className = 'validation-hint success';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.querySelector('input[name="terms"]').checked;

        if (!terms) {
            alert('Please accept the Terms of Service');
            return;
        }

        const result = auth.signup(username, email, password, confirmPassword);

        if (result.success) {
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'block';
            successMsg.className = 'success-message';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            alert('Error: ' + result.message);
        }
    });
}

// ============ LOGIN PAGE ============
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        const result = auth.login(email, password);

        if (result.success) {
            if (remember) {
                localStorage.setItem('zjh_rememberMe', email);
            }
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'block';
            successMsg.className = 'success-message';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            alert('Login Failed: ' + result.message);
        }
    });

    // Auto-fill if remember me was checked
    const remembered = localStorage.getItem('zjh_rememberMe');
    if (remembered) {
        document.getElementById('email').value = remembered;
    }
}

// Social login buttons (placeholder)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Social login coming soon! For now, use the form above.');
    });
});

// Update navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.updateNavbar();
});