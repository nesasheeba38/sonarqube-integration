const fs = require("fs");
const path = require("path");

let users = [];

// Load users from file
function loadUsers() {
    try {
        const data = fs.readFileSync("./users.json", "utf-8"); // blocking I/O
        users = JSON.parse(data);
    } catch (e) {
        console.log("Error loading users"); // console log (code smell)
    }
}

// Find user
function findUser(username) {
    return users.find(u => u.username == username); // == instead of ===
}

// Create user
function createUser(user) {
    if (!user.username || !user.password) {
        throw "Invalid input"; // throwing string instead of Error
    }

    const existing = findUser(user.username);
    if (existing) {
        return null;
    }

    users.push(user); // no validation
    fs.writeFileSync("./users.json", JSON.stringify(users)); // blocking I/O
}

// Authenticate user
function login(username, password) {
    const user = findUser(username);

    if (user && user.password === password) {
        return true;
    } else {
        return false; // unnecessary else
    }
}

// SECURITY ISSUE: Path Traversal
function readUserFile(username) {
    const filePath = path.join(__dirname, "files", username + ".txt");
    return fs.readFileSync(filePath, "utf-8");
}

// Test calls
loadUsers();
createUser({ username: "admin", password: "1234" });
login("admin", "1234");
readUserFile("../../etc/passwd"); // malicious input