
import React from 'react';
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import '../index.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="map-section">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2985.9027214792723!2d106.67525717355134!3d10.738002459904308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f62a90e5dbd%3A0x674d5126513db295!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgU8OgaSBHw7Ju!5e1!3m2!1svi!2s!4v1742760023654!5m2!1svi!2s" width="600" height="450" style={{ border:0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div className="contact-info">
          <h2>Liên hệ với chúng tôi</h2>
          <div className="info-box">
            <div className="info-icon">
                <FaMapMarkerAlt className="contact-icon" />
            </div>
            <div className="info-content">
              <h3>Địa chỉ</h3>
              <p>180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh, Việt Nam</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">
                <AiOutlineMail className="contact-icon" />
            </div>
            <div className="info-content">
              <h3>Email</h3>
              <p>stu.edu.vn</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">
                <AiOutlinePhone className="contact-icon" />
            </div>
            <div className="info-content">
              <h3>Số điện thoại</h3>
              <p>02838505520</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;