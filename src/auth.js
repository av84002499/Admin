
export const setUserLogged = (userLogged) => {
    localStorage.setItem('userID', userLogged.userID);
    localStorage.setItem('name', userLogged.name);
    localStorage.setItem('username', userLogged.username);
    localStorage.setItem('email', userLogged.email);
    localStorage.setItem('token', userLogged.token);
};

export const getUserLogged = () => {
    const userID = localStorage.getItem('userID');
    const name = localStorage.getItem('name');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const userLogged = {userID, name, username, email, token};
    return userLogged;
};

export const removeUserLogged = () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
};
