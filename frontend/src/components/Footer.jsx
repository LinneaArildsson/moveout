import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MoveOut. All rights reserved.</p>
        <p>"Icon made by Freepik from www.flaticon.com"</p>
      </div>
    </footer>
  );
};

export default Footer;
