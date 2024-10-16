import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MoveOut. All rights reserved.</p>
        <p>Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a></p>
        <p>Icon made by Freepik from www.flaticon.com</p>
      </div>
    </footer>
  );
};

export default Footer;
