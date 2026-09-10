// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!auth.currentUser) {
        alert('Please login to access your dashboard');
        window.location.href = 'login.html';
        return;
    }

    // Display user information
    displayUserStats();
    displayLeaderboard();
});

function displayUserStats() {
    const user = auth.currentUser;

    // Update display name
    document.getElementById('userDisplayName').textContent = user.username;

    // Update stats
    document.getElementById('userPoints').textContent = user.points.toLocaleString();
    document.getElementById('userWins').textContent = user.wins;

    // Calculate rank
    const leaderboard = auth.getLeaderboard();
    const rank = leaderboard.findIndex(entry => entry.username === user.username) + 1;
    document.getElementById('userRank').textContent = rank > 0 ? '#' + rank : '-';

    // Display achievements
    displayAchievements(user);

    // Display recent activity
    displayRecentActivity(user);
}

function displayAchievements(user) {
    const achievementsList = document.getElementById('achievementsList');
    const achievements = [];

    // New Member - automatic
    achievements.push({
        icon: '🎯',
        name: 'New Member'
    });

    // First Win
    if (user.wins >= 1) {
        achievements.push({
            icon: '🏆',
            name: 'First Win'
        });
    }

    // High Roller
    if (user.points >= 1000) {
        achievements.push({
            icon: '💰',
            name: 'High Roller'
        });
    }

    // Winning Streak
    if (user.wins >= 5) {
        achievements.push({
            icon: '🔥',
            name: 'Hot Streak'
        });
    }

    // Elite Player
    if (user.points >= 5000) {
        achievements.push({
            icon: '👑',
            name: 'Elite Player'
        });
    }

    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement" title="${achievement.name}">
            <span class="achievement-icon">${achievement.icon}</span>
            <span>${achievement.name}</span>
        </div>
    `).join('');
}

function displayRecentActivity(user) {
    const activityList = document.getElementById('recentActivity');
    
    // Simulate recent activity
    const activities = [
        `Joined ${user.username} on ${new Date(user.createdAt).toLocaleDateString()}`,
        `Started at ${user.points} points`,
        `${user.wins} wins so far`
    ];

    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No recent activity yet</p>';
    } else {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span>${activity}</span>
            </div>
        `).join('');
    }
}

function displayLeaderboard() {
    const leaderboardPreview = document.getElementById('leaderboardPreview');
    const leaderboard = auth.getLeaderboard(5);

    if (leaderboard.length === 0) {
        leaderboardPreview.innerHTML = '<tr><td colspan="4" style="text-align: center;">No players yet</td></tr>';
    } else {
        leaderboardPreview.innerHTML = leaderboard.map(entry => `
            <tr>
                <td><strong>${entry.rank}</strong></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <img src="${entry.avatar}" alt="${entry.username}" style="width: 30px; height: 30px; border-radius: 50%;">
                        ${entry.username}
                    </div>
                </td>
                <td>${entry.points.toLocaleString()}</td>
                <td>${entry.wins}</td>
            </tr>
        `).join('');
    }
}

// Action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const action = e.currentTarget.textContent.trim();
        alert(action + ' feature coming soon!');
    });
});

// Demo: Add test points button (for testing)
function addTestPoints() {
    auth.addPoints(auth.currentUser.id, 100, true);
    displayUserStats();
    displayLeaderboard();
}

// Make addTestPoints globally available if needed
window.addTestPoints = addTestPoints;